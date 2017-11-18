'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobMasterService } from '../../services/classes/JobMaster'
import {jobDetailsService} from '../../services/classes/JobDetails'
import {jobStatusService} from '../../services/classes/JobStatus'
import { NavigationActions } from 'react-navigation'
import { setState } from '../global/globalActions'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    FormLayout,
    JOB_MASTER,
    JOB_SUMMARY
} from '../../lib/constants'

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}

export function endFetchingJobDetails(jobDataList, fieldDataList, currentStatus,jobTransaction,isEnableOutForDelivery) {
    return {
        type: JOB_DETAILS_FETCHING_END,
        payload: {
            fieldDataList,
            jobDataList,
            jobTransaction,
            currentStatus,
            isEnableOutForDelivery
        }
    }
}

export function getJobDetails(jobTransactionId) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingJobDetails())
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
            const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS)
            const details = jobTransactionService.prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList.value, jobAttributeStatusList.value, fieldAttributeMasterList.value, fieldAttributeStatusList.value, null, null, statusList.value)
            const jobMaster = await jobMasterService.getJobMaterFromJobMasterList(details.jobTransactionDisplay.jobMasterId)
            const isEnableOutForDelivery = (jobMaster[0].enableOutForDelivery ) ? (await jobDetailsService.checkOutForDelivery(jobMasterList)): true
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.currentStatus,details.jobTransactionDisplay,isEnableOutForDelivery))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}

//     export function checkOutForDelivery(jobTransactionId) {
//         return async function (dispatch) {
//             try {
//                 const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
//                 let jobTransactionQuery = 'id = ' + jobTransactionId
//                 const jobTransaction = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery)
//                 const isEnableOutForDelivery = (await jobMasterService.getJobMaterFromJobMasterList(jobTransaction[0].jobMasterId) ) ? 
//                                                (await jobDetailsService.checkOutForDelivery(jobMasterList) ) : true
//                 // const x  = jobMasterList.value.filter((obj) => obj.enableOutForDelivery == true).map(obj => obj.id) 
//                 // const mapStatus = await jobStatusService.getjobMasterIdStatusIdMap(x,'UNSEEN')
//                 // let result = Object.keys(mapStatus).map(function(key) {
//                 //     return mapStatus[key];
//                 //   });
//                 // const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(result)  
//                 // const isEnable = !(unseenTransactions.length>0)
//                 dispatch(setState(ENABLE_OUT_FOR_DELIVERY,isEnableOutForDelivery))
//             } catch (error) {
//                 // To do
//                 // Handle exceptions and change state accordingly
//                 console.log(error)
//             }
//         }

// }
