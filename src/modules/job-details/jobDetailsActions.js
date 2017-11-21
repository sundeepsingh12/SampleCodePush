'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import {jobMasterService} from '../../services/classes/JobMaster'
import {jobDetailsService} from '../../services/classes/JobDetails'
import {
    JOB_ATTRIBUTE,
    JOB_MASTER,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    FormLayout
} from '../../lib/constants'

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}

export function endFetchingJobDetails(jobDataList, fieldDataList, currentStatus,jobTransaction,isEnableRestriction) {
    return {
        type: JOB_DETAILS_FETCHING_END,
        payload: {
            fieldDataList,
            jobDataList,
            jobTransaction,
            currentStatus,
            isEnableRestriction
        }
    }
}

export function getJobDetails(jobTransactionId) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingJobDetails())
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
            const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS)
            const details = jobTransactionService.prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList.value, jobAttributeStatusList.value, fieldAttributeMasterList.value, fieldAttributeStatusList.value, null, null, statusList.value)
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobMaster =  jobMasterService.getJobMaterFromJobMasterList(details.jobTransactionDisplay.jobMasterId,jobMasterList)
            const isEnableRestriction = (jobMaster[0].enableResequenceRestriction ) ? (jobDetailsService.checkEnableResequence(jobMasterList,details.currentStatus.tabId,details.seqSelected,statusList)): true
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.currentStatus,details.jobTransactionDisplay,isEnableRestriction))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}