import {
    keyValueDBService
} from './KeyValueDBService'
import {
    jobTransactionService
} from './JobTransaction'
import {
    jobStatusService
} from './JobStatus'
import { transactionCustomizationService } from './TransactionCustomization'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    HUB,
    TABLE_JOB_TRANSACTION,
    UNSEEN
} from '../../lib/constants'

import {
    PENDING,
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    PINCODE,
    LANDMARK,
    POST
} from '../../lib/AttributeConstants'
import {
    SEQUENCELIST_MISSING,
    CURRENT_SEQUENCE_ROW_MISSING,
    RUNSHEET_NUMBER_MISSING,
    TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SEARCH_TEXT_MISSING,
    SEQUENCE_REQUEST_DTO,
    TOKEN_MISSING,
    JOB_MASTER_ID_CUSTOMIZATION_MAP_MISSING
} from '../../lib/ContainerConstants'
import _ from 'lodash'
import * as realm from '../../repositories/realmdb'
import CONFIG from '../../lib/config'

class Sequence {

    /**
     * get jobTransaction List according to runsheet Number and jobMasterIds
     * @param {*} runsheetNumber
     * @param {*} jobMasterIds // job master ids whose jobs are visible in this module 
     * @returns jobTransactionCustomizationList // jobTransacion List
     */
    async getSequenceList(runsheetNumber, jobMasterIds, jobTransactionList) {
        if (!runsheetNumber) {
            throw new Error(RUNSHEET_NUMBER_MISSING);
        }
        let jobMasterMap = _.mapKeys(jobMasterIds);
        let jobTransactionCustomizationList = {}
        let allStatusIdsMapForCode = await jobStatusService.getAllStatusIdsMapForCode(UNSEEN)
        for(let jobMasterId in jobTransactionList){
            if(jobMasterMap[jobMasterId]){
                jobTransactionCustomizationList = Object.assign(jobTransactionCustomizationList, jobTransactionList[jobMasterId]) 
            }
        }
        const sequenceMap =  _.pickBy(jobTransactionCustomizationList, function(value, key) {
            return (value.runsheetNo == runsheetNumber && !allStatusIdsMapForCode[value.statusId])
        })
        return Object.values(sequenceMap);
    }

    /**
     * This method prepare Request body 
     * and for that it searches for AddressLine1, AddressLine2, Pincode, Landmark
     * @param {*} sequenceList 
     * @returns sequenceRequestDto 
     */
    async prepareRequestBody(sequenceList) {
        let sequenceRequestDto = []
        const hub = await keyValueDBService.getValueFromStore(HUB)
        _.forEach(sequenceList, object => {
            let autoAssignAddressDTO = {},
                address1, address2, locality, pincode
            //check if jobSwipableDetails present and if present then check it has addressData
            if (!_.isEmpty(object.jobSwipableDetails && !_.isEmpty(object.jobSwipableDetails.addressData))) {
                (object.jobSwipableDetails.addressData).forEach(object => {
                    if (object[ADDRESS_LINE_1]) {
                        address1 = object[ADDRESS_LINE_1]
                    }
                    if (object[ADDRESS_LINE_2]) {
                        address2 = object[ADDRESS_LINE_2]
                    }
                    if (object[LANDMARK]) {
                        locality = object[LANDMARK]
                    }
                    if (object[PINCODE]) {
                        pincode = object[PINCODE]
                    }
                    autoAssignAddressDTO = {
                        address1,
                        address2,
                        locality,
                        pincode
                    }
                })
            }
            sequenceRequestDto.push({
                transactionId: object.id,
                latitude: object.jobLatitude,
                longitude: object.jobLongitude,
                jobMasterId: object.jobMasterId,
                jobId: object.jobId,
                hubId: hub.value.id,
                autoAssignAddressDTO
            })
        })
        return sequenceRequestDto
    }

    /**
     * This method will update seqSelected property of transaction as per the response and save updated transaction to DB
     * transactionIdSequenceMap // contains sequence map corresponding to transactionId
     * unAllocatedTransactionIds //it contains transaction ids which doesn't have any lat long or address related info like address1, address2, locality, pincode in job details
     * @param {*} responseBody 
     * @param {*} sequenceList
     * @returns updatedSequenceList // sequence list with updated sequence from server response
     */
    processSequenceResponse(responseBody, sequenceList) {
        const transactionIdSequenceMap = responseBody.transactionIdSequenceMap
        const updatedSequenceList = JSON.parse(JSON.stringify(sequenceList))//clone sequenceList
        let position = 1
        //this block sets seqSelected for transaction which are allocated i.e. have some kind of location parameter
        if (transactionIdSequenceMap) {
            for (let transaction of updatedSequenceList) {
                if (transactionIdSequenceMap[transaction.id]) {
                    position++
                    transaction.seqSelected = transactionIdSequenceMap[transaction.id]
                }
            }
        }
        //this block sets seqselected for unallocated transaction
        const unAllocatedTransactionIds = responseBody.unAllocatedTransactionIds
        if (unAllocatedTransactionIds) {
            for (let transaction in updatedSequenceList) {
                if (unAllocatedTransactionIds.includes(transaction.id)) {
                    transactionIdSequenceMap[transaction.id] = position++
                    transaction.seqSelected = transactionIdSequenceMap[transaction.id]
                }
            }
        }
        realm.updateRealmDb(TABLE_JOB_TRANSACTION, transactionIdSequenceMap)//save updated jobTransaction to DB
        return updatedSequenceList
    }

    /**
     * it will check all transaction seqSelected property and if at least 2 transaction having same value of seqSelected than it will change there value 
     * @param {*} sequenceList 
     * @returns Object:
                      isDuplicateSequenceFound,
                      sequenceArray,
                      transactionsWithChangedSeqeunceMap
     */
    checkForAutoSequencing(sequenceList, jobMasterSeperatorMap) {
        //non empty sequence list should be there
        if (!sequenceList) {
            return {}
        }
        let fequencySeqeunceMap = {}, sequenceCount, sequenceArray = [], transactionsWithChangedSeqeunceMap = {}
        /*check all transaction and make a map
           fequencySeqeunceMap: {
               seqSelected: [jobTransactions] //array having all those transaction which have same sequence
           }     
        */
        for (let jobTrasaction of sequenceList) {
            if (!fequencySeqeunceMap[jobTrasaction.seqSelected]) {
                fequencySeqeunceMap[jobTrasaction.seqSelected] = []
            }
            fequencySeqeunceMap[jobTrasaction.seqSelected].push(jobTrasaction)
        }

        // loop through fequencySeqeunceMap
        for (let fequencySeqeunceMapObject in fequencySeqeunceMap) {
            //initial case as sequenceCount is undefined @ first iteration
            if (!sequenceCount) {
                sequenceCount = fequencySeqeunceMapObject // assign lowest sequence number to sequenceCount
            }
            /* get array of transaction which have same sequence,
               array will contain only single jobTransaction if there is single transaction with a specific sequence
            */
            for (let transactionWithSameSequence of fequencySeqeunceMap[fequencySeqeunceMapObject]) {
                transactionWithSameSequence.seqActual = (transactionWithSameSequence.seqActual) ?
                    transactionWithSameSequence.seqActual : transactionWithSameSequence.seqSelected // if seqActual is defined then don't edit it if not defined then copy value of seqSelected to seqActual. 
                if (sequenceCount > transactionWithSameSequence.seqSelected) {
                    transactionWithSameSequence.seqSelected = sequenceCount++
                    transactionsWithChangedSeqeunceMap[transactionWithSameSequence.id] = transactionWithSameSequence
                } else {
                    sequenceCount = transactionWithSameSequence.seqSelected + 1
                }
                transactionWithSameSequence.seqAssigned = transactionWithSameSequence.seqSelected
                sequenceArray.push(transactionWithSameSequence)
            }
        }
        //case of duplicate sequence present
        if (_.size(fequencySeqeunceMap) != _.size(sequenceArray)) {
            //change line1, line 2, circle 1, circle 2 text if necessary
            let returnObject = this.changeSequenceInJobTransaction(sequenceArray, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap)
            return {
                isDuplicateSequenceFound: true,
                sequenceArray: returnObject.sequenceArray,
                transactionsWithChangedSeqeunceMap: returnObject.transactionsWithChangedSeqeunceMap
            }
        }
        //case of no duplicate sequence present
        return {
            isDuplicateSequenceFound: false,
            sequenceArray,
            transactionsWithChangedSeqeunceMap
        }
    }

    /**
     * 
     * @param {*Object} transactionsWithChangedSeqeunceMap 
     * save job transaction map to db
     */
    async updateJobTrasaction(transactionsWithChangedSeqeunceMap) {
        if (!transactionsWithChangedSeqeunceMap) {
            throw new Error(TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP)
        }
        //save jobTransaction to DB
        await realm.saveList(TABLE_JOB_TRANSACTION, _.values(transactionsWithChangedSeqeunceMap))
        //this is use to enable reload of start module
        //await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(true))
    }

    /**
     * change sequence of jobTransaction
     * @param {*Object} rowParam { to, //final drag position
     *                       from ,//intial position
     *                       jobTransaction   
     *                      }
     * @param {*Array} sequenceList 
     * @param {*Object} transactionsWithChangedSeqeunceMap //contains all jobTransactions whose sequence had been changed or it will be empty for initial case
     * @param {*boolean} isCalledFromJumpSequence //false if drag and drop event occured, true if user presses sequenceList item and change the sequence
     * @returns Object :  cloneSequenceList, // sequence list with new sequnece caused by shift
                          newTransactionsWithChangedSeqeunceMap // transaction map having those transactions whose sequence has been changed
     */
    onRowDragged(rowParam, sequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap, isCalledFromJumpSequence) {
        if (!sequenceList) {
            throw new Error(SEQUENCELIST_MISSING)
        }
        let cloneSequenceList = JSON.parse(JSON.stringify(sequenceList))
        if (!isCalledFromJumpSequence) {
            cloneSequenceList[rowParam.from].seqAssigned = cloneSequenceList[rowParam.from].seqSelected = cloneSequenceList[rowParam.to].seqSelected
            transactionsWithChangedSeqeunceMap[cloneSequenceList[rowParam.from].id] = cloneSequenceList[rowParam.from]
        }
        // if sequence of list item is dragged from lower value to highar value
        if (rowParam.from < rowParam.to) {
            for (let rowIndex = rowParam.from + 1; rowIndex <= rowParam.to; rowIndex++) {
                cloneSequenceList[rowIndex].seqSelected--
                cloneSequenceList[rowIndex].seqAssigned--
                transactionsWithChangedSeqeunceMap[cloneSequenceList[rowIndex].id] = cloneSequenceList[rowIndex]
            }
        } else { // if sequence of list item is dragged from higher value to lower value
            for (let rowIndex = rowParam.to; rowIndex < rowParam.from; rowIndex++) {
                cloneSequenceList[rowIndex].seqSelected++
                cloneSequenceList[rowIndex].seqAssigned++
                transactionsWithChangedSeqeunceMap[cloneSequenceList[rowIndex].id] = cloneSequenceList[rowIndex]
            }
        }
        cloneSequenceList.splice(rowParam.to, 0, cloneSequenceList.splice(rowParam.from, 1)[0])
        //change line1, line 2, circle1 ,circle2 text if necessary
        let returnObject = this.changeSequenceInJobTransaction(cloneSequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap)
        return {
            cloneSequenceList: returnObject.sequenceArray,
            newTransactionsWithChangedSeqeunceMap: returnObject.transactionsWithChangedSeqeunceMap
        }
    }

    /**
     * 
     * @param {*} searchText 
     * @param {*} sequenceList 
     * @returns object : transaction object having reference number equal to searchText
     */
    searchReferenceNumber(searchText, sequenceList) {
        if (!sequenceList) {
            throw new Error(SEQUENCELIST_MISSING)
        }
        if (!searchText) {
            throw new Error(SEARCH_TEXT_MISSING)
        }
        /*Check all transaction and return transaction which have same referenceNumber as searchText 
           if no match found return undefined */
        for (let transaction of sequenceList) {
            if (_.isEqual(searchText, transaction.referenceNumber)) {
                return transaction
            }
        }
        return
    }

    /**
     * Hit an API when update sequence from server is pressed
     * @param {*} token 
     * @param {*} sequenceRequestDto 
     * return object: sequence List with sequence set by the server
     */
    fetchResequencedJobsFromServer(token, sequenceRequestDto) {
        if (!token) {
            throw new Error(TOKEN_MISSING)
        }
        if (!sequenceRequestDto) {
            throw new Error(SEQUENCE_REQUEST_DTO)
        }
        const sequenceResponse = RestAPIFactory(token).serviceCall(JSON.stringify(sequenceRequestDto), CONFIG.API.SEQUENCE_USING_ROUTING_API, POST)
        return sequenceResponse
    }

    /**
     * 
     * @param {*} currentSequenceListItemIndex 
     * @param {*} newSequence 
     * @param {*} sequenceList 
     * @param {*} transactionsWithChangedSeqeunceMap 
     * @returns Object :  cloneSequenceList, // sequence list with new sequnece caused by shift
                          newTransactionsWithChangedSeqeunceMap // transaction map having those transactions whose sequence has been changed
     */
    jumpSequence(currentSequenceListItemIndex, newSequence, sequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap) {
        if (_.isNull(currentSequenceListItemIndex) || _.isUndefined(currentSequenceListItemIndex)) { //check for null and undefined only
            throw new Error(CURRENT_SEQUENCE_ROW_MISSING)
        } if (!sequenceList) {
            throw new Error(SEQUENCELIST_MISSING)
        }
        let index
        // below 2 loops are just use to find the final index
        // new sequence is greater than previous sequence
        if (sequenceList[currentSequenceListItemIndex].seqSelected < newSequence) {
            for (index = currentSequenceListItemIndex + 1; index < _.size(sequenceList) && sequenceList[index].seqSelected <= newSequence; index++);//don't remove this semicolon
            index--
        } else {
            //new sequence is smaller than previous sequence
            for (index = currentSequenceListItemIndex - 1; index >= 0 && sequenceList[index].seqSelected >= newSequence; index--);//don't remove this semicolon
            index++
        }
        sequenceList[currentSequenceListItemIndex].seqSelected = sequenceList[currentSequenceListItemIndex].seqAssigned = newSequence
        transactionsWithChangedSeqeunceMap[sequenceList[currentSequenceListItemIndex].id] = sequenceList[currentSequenceListItemIndex]//add transaction to transactionsWithChangedSeqeunceMap
        //call the same method which is called for drag and drop event
        return this.onRowDragged({
            from: currentSequenceListItemIndex,
            to: index
        }, sequenceList, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap, true)
    }

    /**
     * It takes CUSTOMIZATION_LIST_MAP and return an object having jobMasterId vs seperatorMap, seperator map contains seperator at
     * line1, line 2, circle1, circle2 
     * seperator map is used to change line1, line2, cicle1, circle2 text whenever sequence is changed
     * @param {*} jobMasterIdCustomizationMap 
     * @returns jobMasterSeperatorMap // map of jobMasterId vs seperatorMap
     */
    createSeperatorMap(jobMasterIdCustomizationMap) {
        //check if jobMasterIdCustomizationMap is undefined then throw an error else run the logic
        if (!jobMasterIdCustomizationMap || !jobMasterIdCustomizationMap.value) {
            throw new Error(JOB_MASTER_ID_CUSTOMIZATION_MAP_MISSING)
        }
        let jobMasterSeperatorMap = {}
        for (let jobMasterCustomizationIndex in jobMasterIdCustomizationMap.value) {
            let seperatorMap = {}
            let jobMasterCustomizationObject = jobMasterIdCustomizationMap.value[jobMasterCustomizationIndex]
            /*checks if seperator is present with routing sequence number enabled 
                if both conditions are true add them to seperator map */
            if (jobMasterCustomizationObject[1] && jobMasterCustomizationObject[1].routingSequenceNumber) {
                seperatorMap['line1'] = {
                    separator: jobMasterCustomizationObject[1].separator,
                }
            }
            if (jobMasterCustomizationObject[2] && jobMasterCustomizationObject[2].routingSequenceNumber) {
                seperatorMap['line2'] = {
                    separator: jobMasterCustomizationObject[2].separator,
                }
            }
            if (jobMasterCustomizationObject[3] && jobMasterCustomizationObject[3].routingSequenceNumber) {
                seperatorMap['circle1'] = {
                    separator: jobMasterCustomizationObject[3].separator,
                }
            }
            if (jobMasterCustomizationObject[4] && jobMasterCustomizationObject[4].routingSequenceNumber) {
                seperatorMap['circle2'] = {
                    separator: jobMasterCustomizationObject[4].separator,
                }
            }
            //seperator map should not be empty
            if (!_.isEmpty(seperatorMap)) {
                jobMasterSeperatorMap[jobMasterCustomizationIndex] = seperatorMap
            }
        }
        return jobMasterSeperatorMap
    }

    /**
     * 
     * @param {*} sequenceArray 
     * @param {*} transactionsWithChangedSeqeunceMap 
     * @param {*} jobMasterSeperatorMap 
     * @returns Object: {
            sequenceArray: // sequence List
            transactionsWithChangedSeqeunceMap // transaction with changed seqeunce
        }
     */
    changeSequenceInJobTransaction(sequenceArray, transactionsWithChangedSeqeunceMap, jobMasterSeperatorMap) {
        //if no seperator present then return
        if (_.isEmpty(jobMasterSeperatorMap)) {
            return {
                sequenceArray,
                transactionsWithChangedSeqeunceMap
            }
        }
        // convert sequence array to map of object and id as property of each object
        const cloneSequenceMap = _.mapKeys(sequenceArray, 'id')
        for (let jobTransactionIndex in transactionsWithChangedSeqeunceMap) {
            let jobTransacion = transactionsWithChangedSeqeunceMap[jobTransactionIndex]
            //if map doesn't contain desired jobMasterId then skip the loop
            if (!jobMasterSeperatorMap[jobTransacion.jobMasterId]) {
                continue
            }

            //if seperator map and jobTransaction contain below property then change the text
            let seperatorMap = jobMasterSeperatorMap[jobTransacion.jobMasterId]
            if (seperatorMap.line1 && jobTransacion.line1) {
                cloneSequenceMap[jobTransacion.id].line1 = jobTransacion.line1 = this.changeLineTextOrCicleText(seperatorMap.line1.separator, jobTransacion.line1, jobTransacion.seqSelected)
            }
            if (seperatorMap.line2 && jobTransacion.line2) {
                cloneSequenceMap[jobTransacion.id].line2 = jobTransacion.line2 = this.changeLineTextOrCicleText(seperatorMap.line2.separator, jobTransacion.line2, jobTransacion.seqSelected)
            }
            if (seperatorMap.circle1 && jobTransacion.circleLine1) {
                cloneSequenceMap[jobTransacion.id].circleLine1 = jobTransacion.circleLine1 = this.changeLineTextOrCicleText(seperatorMap.circle1.separator, jobTransacion.circleLine1, jobTransacion.seqSelected)
            }
            if (seperatorMap.circle2 && jobTransacion.circleLine2) {
                cloneSequenceMap[jobTransacion.id].circleLine2 = jobTransacion.circleLine2 = this.changeLineTextOrCicleText(seperatorMap.circle2.separator, jobTransacion.circleLine2, jobTransacion.seqSelected)
            }
        }
        return {
            sequenceArray: _.values(cloneSequenceMap),
            transactionsWithChangedSeqeunceMap
        }
    }


    checkForJobMasterIdsOfUpdatedJobs(updatedTransactionListIds, jobMasterIdsList){
        for(let jobMasterId in jobMasterIdsList){
            if(!_.isEmpty(updatedTransactionListIds[jobMasterIdsList[jobMasterId]])){
                return true
            }
        }
        return false
    }

    /**
     * it will find routing number and change it to the new routing number
     * @param {*} separator 
     * @param {*} textToChange 
     * @param {*} seqSelected 
     * @returns string // returns text by changing seqeuence in text
     */
    changeLineTextOrCicleText(separator, textToChange, seqSelected) {
        let startIndex = textToChange.indexOf('Sequence: ') + 10
        let lastIndex = startIndex
        if (separator) {
            for (; lastIndex < _.size(textToChange) && !_.isEqual(textToChange[lastIndex], separator); lastIndex++);// Don't remove this semi-colon
        } else {
            for (; lastIndex < _.size(textToChange); lastIndex++);// Don't remove this semi-colon
        }
        let finalText = textToChange.substring(0, startIndex) + seqSelected + textToChange.substring(lastIndex, _.size(textToChange))
        return finalText
    }
}

export let sequenceService = new Sequence()