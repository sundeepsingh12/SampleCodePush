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

import {
    JOB_STATUS,
    CUSTOMIZATION_LIST_MAP,
    JOB_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    CUSTOMER_CARE,
    SMS_TEMPLATE,
    JOB_MASTER,
    HUB,
    TABLE_JOB_TRANSACTION
} from '../../lib/constants'

import {
    PENDING,
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    PINCODE,
    LANDMARK
} from '../../lib/AttributeConstants'

import _ from 'lodash'
import * as realm from '../../repositories/realmdb'

class Sequence {

    async getSequenceList() {
        const statusIds = await jobStatusService.getNonUnseenStatusIdsForStatusCategory(PENDING)
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        const jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO,'Sequence',statusIds)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList,'id')
        console.log('idJobTransactionCustomizationListMap',idJobTransactionCustomizationListMap)
        return idJobTransactionCustomizationListMap
    }

    async prepareRequestBody(sequenceList) {
        let sequenceRequestDto = []
        const hub = await keyValueDBService.getValueFromStore(HUB)
        _.forEach(sequenceList, object => {
            let autoAssignAddressDTO = {},
                address1, address2, locality, pincode
            Object.values(object.jobSwipableDetails.addressData).forEach(object => {
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
        let position  = 1
        if (transactionIdSequenceMap != null && transactionIdSequenceMap != undefined && !_.isEmpty(transactionIdSequenceMap)) {
            for (let index in sequenceList) {
                if(transactionIdSequenceMap[sequenceList[index].id]){
                    position++
                    updatedSequenceList[index].seqSelected = transactionIdSequenceMap[index]
                }
            }
        }
        const unAllocatedTransactionIds = responseBody.unAllocatedTransactionIds
        if(unAllocatedTransactionIds!=null && unAllocatedTransactionIds!=undefined && !_.isEmpty(unAllocatedTransactionIds)){
              for (let index in sequenceList) {
                if(unAllocatedTransactionIds.includes(sequenceList[index].id)){
                    transactionIdSequenceMap[sequenceList[index].id] = position++
                    updatedSequenceList[index].seqSelected = transactionIdSequenceMap[index]
                }
            }
        }
        realm.updateRealmDb(TABLE_JOB_TRANSACTION, transactionIdSequenceMap)
        return  updatedSequenceList

    }
}

export let sequenceService = new Sequence()