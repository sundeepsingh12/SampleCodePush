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
    TABLE_RUNSHEET
} from '../../lib/constants'

import {
    PENDING,
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    PINCODE,
    LANDMARK,
    POST
} from '../../lib/AttributeConstants'

import _ from 'lodash'
import * as realm from '../../repositories/realmdb'
import CONFIG from '../../lib/config'

class Sequence {

    async getSequenceList(runsheetNumber) {
        if (!runsheetNumber) {
            throw new Error('Runsheet number not present !')
        }
        const statusIds = await jobStatusService.getNonUnseenStatusIdsForStatusCategory(PENDING)
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        const jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'Sequence', {
            statusIds,
            runsheetNumber
        })
        return jobTransactionCustomizationList
    }

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

    getRunsheets() {
        const runsheetArray = realm.getAll(TABLE_RUNSHEET)
        let runsheetNumberList = []
        runsheetArray.forEach(runsheetObject => {
            const runsheetClone = { ...runsheetObject }
            runsheetNumberList.push(runsheetClone.runsheetNumber)
        })
        if (_.isEmpty(runsheetNumberList)) {
            throw new Error('No runsheet found !')
        }
        return runsheetNumberList
    }

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

    async updateJobTrasaction(transactionsWithChangedSeqeunceMap) {
        if (!transactionsWithChangedSeqeunceMap) {
            throw new Error('transactionsWithChangedSeqeunceMap not present')
        }
        let abc = realm.getAll(TABLE_JOB_TRANSACTION)
        await realm.saveList(TABLE_JOB_TRANSACTION, _.values(transactionsWithChangedSeqeunceMap))
        abc = realm.getAll(TABLE_JOB_TRANSACTION)
    }

    onRowDragged(rowParam, sequenceList, transactionsWithChangedSeqeunceMap) {
        if (!sequenceList) {
            throw new Error('sequenceList not present')
        }
        if (rowParam.to == rowParam.from) {
            throw new Error(`New seqence can't be same as previous sequence`)
        }
        if (!_.inRange(rowParam.to, 0, _.size(sequenceList)) || !_.inRange(rowParam.from, 0, _.size(sequenceList))) {
            throw new Error('Enter valid sequence between 1 to ' + sequenceList.length)
        }

        let cloneSequenceList = _.cloneDeep(sequenceList)
        cloneSequenceList[rowParam.from].seqAssigned = cloneSequenceList[rowParam.from].seqSelected = cloneSequenceList[rowParam.to].seqSelected
        transactionsWithChangedSeqeunceMap[cloneSequenceList[rowParam.from].id] = cloneSequenceList[rowParam.from]
        if (rowParam.from < rowParam.to) {
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

    searchReferenceNumber(searchText, sequenceList) {
        if (!sequenceList) {
            throw new Error('sequenceList not present')
        }
        if (!searchText) {
            throw new Error('searchText not present')
        }
        let counter = 0
        for (let transaction of sequenceList) {
            if (_.isEqual(searchText, transaction.referenceNumber)) {
                return counter
            }
            counter++
        }
        return -1
    }

    fetchResequencedJobsFromServer(token, sequenceRequestDto) {
        if (!token) {
            throw new Error('Token missing')
        }
        if (!sequenceRequestDto) {
            throw new Error('sequenceRequestDto missing')
        }
        const sequenceResponse = RestAPIFactory(token).serviceCall(JSON.stringify(sequenceRequestDto), CONFIG.API.SEQUENCE_USING_ROUTING_API, POST)
        return sequenceResponse
    }
}

export let sequenceService = new Sequence()