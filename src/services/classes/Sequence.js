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
    SAME_SEQUENCE_ERROR,
    SEQUENCELIST_MISSING,
    BLANK_NEW_SEQUENCE,
    CURRENT_SEQUENCE_ROW_MISSING,
    SEQUENCE_NOT_AN_INT,
    RUNSHEET_NUMBER_MISSING,
    TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SEARCH_TEXT_MISSING,
    SEQUENCE_REQUEST_DTO,
    TOKEN_MISSING
} from '../../lib/ContainerConstants'
import _ from 'lodash'
import * as realm from '../../repositories/realmdb'
import CONFIG from '../../lib/config'

class Sequence {

    /**
     * 
     * @param {*} runsheetNumber 
     * @returns jobTransactionCustomizationList // jobTransacion List
     */
    async getSequenceList(runsheetNumber) {
        if (!runsheetNumber) {
            throw new Error(RUNSHEET_NUMBER_MISSING)
        }
        const statusIds = await jobStatusService.getNonUnseenStatusIdsForStatusCategory(PENDING)
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        const jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'Sequence', {
            statusIds,
            runsheetNumber
        })
        return jobTransactionCustomizationList
    }

    /**
     * 
     * @param {*} sequenceList 
     * @returns sequenceRequestDto 
     */
    async prepareRequestBody(sequenceList) {
        let sequenceRequestDto = []
        const hub = await keyValueDBService.getValueFromStore(HUB)
        _.forEach(sequenceList, object => {
            let autoAssignAddressDTO = {},
                address1, address2, locality, pincode
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
     * 
     * @param {*} responseBody 
     * @param {*} sequenceList
     * @returns updatedSequenceList // sequence list with updated sequence from server response
     */
    processSequenceResponse(responseBody, sequenceList) {
        const transactionIdSequenceMap = responseBody.transactionIdSequenceMap
        const updatedSequenceList = JSON.parse(JSON.stringify(sequenceList))
        let position = 1
        if (transactionIdSequenceMap != null && transactionIdSequenceMap != undefined && !_.isEmpty(transactionIdSequenceMap)) {
            for (let transaction of updatedSequenceList) {
                if (transactionIdSequenceMap[transaction.id]) {
                    position++
                    transaction.seqSelected = transactionIdSequenceMap[transaction.id]
                }
            }
        }
        const unAllocatedTransactionIds = responseBody.unAllocatedTransactionIds
        if (unAllocatedTransactionIds != null && unAllocatedTransactionIds != undefined && !_.isEmpty(unAllocatedTransactionIds)) {
            for (let transaction in updatedSequenceList) {
                if (unAllocatedTransactionIds.includes(transaction.id)) {
                    transactionIdSequenceMap[transaction.id] = position++
                    transaction.seqSelected = transactionIdSequenceMap[transaction.id]
                }
            }
        }
        realm.updateRealmDb(TABLE_JOB_TRANSACTION, transactionIdSequenceMap)
        return updatedSequenceList
    }

    /**
     * 
     * @param {*} sequenceList 
     * @returns Object:
                      isDuplicateSequenceFound: _.size(fequencySeqeunceMap) != _.size(sequenceArray),
                      sequenceArray,
                      transactionsWithChangedSeqeunceMap
     */
    checkForAutoSequencing(sequenceList) {
        if (!sequenceList) {
            return {}
        }
        let fequencySeqeunceMap = {}, sequenceCount, sequenceArray = [], transactionsWithChangedSeqeunceMap = {}
        for (let jobTrasaction of sequenceList) {
            if (!fequencySeqeunceMap[jobTrasaction.seqSelected]) {
                fequencySeqeunceMap[jobTrasaction.seqSelected] = []
            }
            fequencySeqeunceMap[jobTrasaction.seqSelected].push(jobTrasaction)
        }
        for (let fequencySeqeunceMapObject in fequencySeqeunceMap) {
            if (!sequenceCount) {
                sequenceCount = fequencySeqeunceMapObject
            }
            for (let transactionWithSameSequence of fequencySeqeunceMap[fequencySeqeunceMapObject]) {
                transactionWithSameSequence.seqActual = (transactionWithSameSequence.seqActual) ?
                    transactionWithSameSequence.seqActual : transactionWithSameSequence.seqSelected

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
        return {
            isDuplicateSequenceFound: _.size(fequencySeqeunceMap) != _.size(sequenceArray),
            sequenceArray,
            transactionsWithChangedSeqeunceMap
        }
    }

    /**
     * 
     * @param {*} transactionsWithChangedSeqeunceMap 
     * save job transaction map to db
     */
    async updateJobTrasaction(transactionsWithChangedSeqeunceMap) {
        if (!transactionsWithChangedSeqeunceMap) {
            throw new Error(TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP)
        }
        await realm.saveList(TABLE_JOB_TRANSACTION, _.values(transactionsWithChangedSeqeunceMap))
    }

    /**
     * 
     * @param {*} rowParam 
     * @param {*} sequenceList 
     * @param {*} transactionsWithChangedSeqeunceMap 
     * @param {*} isCalledFromJumpSequence 
     * @returns Object :  cloneSequenceList, // sequence list with new sequnece caused by shift
                          newTransactionsWithChangedSeqeunceMap // transaction map having those transactions whose sequence has been changed
     */
    onRowDragged(rowParam, sequenceList, transactionsWithChangedSeqeunceMap, isCalledFromJumpSequence) {
        if (!sequenceList) {
            throw new Error(SEQUENCELIST_MISSING)
        }
        if (!isCalledFromJumpSequence && rowParam.to == rowParam.from) {
            throw new Error(SAME_SEQUENCE_ERROR)
        }
        let cloneSequenceList = _.cloneDeep(sequenceList)
        if (!isCalledFromJumpSequence) {
            cloneSequenceList[rowParam.from].seqAssigned = cloneSequenceList[rowParam.from].seqSelected = cloneSequenceList[rowParam.to].seqSelected
            transactionsWithChangedSeqeunceMap[cloneSequenceList[rowParam.from].id] = cloneSequenceList[rowParam.from]
        } if (rowParam.from < rowParam.to) {
            for (let rowIndex = rowParam.from + 1; rowIndex <= rowParam.to; rowIndex++) {
                cloneSequenceList[rowIndex].seqSelected--
                cloneSequenceList[rowIndex].seqAssigned--
                transactionsWithChangedSeqeunceMap[cloneSequenceList[rowIndex].id] = cloneSequenceList[rowIndex]
            }
        } else {
            for (let rowIndex = rowParam.to; rowIndex < rowParam.from; rowIndex++) {
                cloneSequenceList[rowIndex].seqSelected++
                cloneSequenceList[rowIndex].seqAssigned++
                transactionsWithChangedSeqeunceMap[cloneSequenceList[rowIndex].id] = cloneSequenceList[rowIndex]
            }
        }
        cloneSequenceList.splice(rowParam.to, 0, cloneSequenceList.splice(rowParam.from, 1)[0])
        return {
            cloneSequenceList,
            newTransactionsWithChangedSeqeunceMap: transactionsWithChangedSeqeunceMap
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
        for (let transaction of sequenceList) {
            if (_.isEqual(searchText, transaction.referenceNumber)) {
                return transaction
            }
        }
        return
    }

    /**
     * 
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
    jumpSequence(currentSequenceListItemIndex, newSequence, sequenceList, transactionsWithChangedSeqeunceMap) {
        if (_.isNull(currentSequenceListItemIndex) || _.isUndefined(currentSequenceListItemIndex)) {
            throw new Error(CURRENT_SEQUENCE_ROW_MISSING)
        } if (_.size(_.trim(newSequence)) == 0) {
            throw new Error(BLANK_NEW_SEQUENCE)
        } if (!parseInt(newSequence) || parseInt(newSequence) < 1) {
            throw new Error(SEQUENCE_NOT_AN_INT + newSequence)
        } if (!sequenceList) {
            throw new Error(SEQUENCELIST_MISSING)
        }
        newSequence = parseInt(newSequence)
        if (_.isEqual(sequenceList[currentSequenceListItemIndex].seqSelected, newSequence)) {
            throw new Error(SAME_SEQUENCE_ERROR)
        }
        let index
        if (sequenceList[currentSequenceListItemIndex].seqSelected < newSequence) {
            for (index = currentSequenceListItemIndex + 1; index < _.size(sequenceList) && sequenceList[index].seqSelected <= newSequence; index++);
            index--
        } else {
            for (index = currentSequenceListItemIndex - 1; index >= 0 && sequenceList[index].seqSelected >= newSequence; index--);
            index++
        }
        sequenceList[currentSequenceListItemIndex].seqSelected = sequenceList[currentSequenceListItemIndex].seqAssigned = newSequence
        transactionsWithChangedSeqeunceMap[sequenceList[currentSequenceListItemIndex].id] = sequenceList[currentSequenceListItemIndex]
        return this.onRowDragged({
            from: currentSequenceListItemIndex,
            to: index
        }, sequenceList, transactionsWithChangedSeqeunceMap, true)
    }
}

export let sequenceService = new Sequence()