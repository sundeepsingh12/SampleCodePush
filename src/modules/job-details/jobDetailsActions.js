'use strict'

import { Actions } from 'react-native-router-flux'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../services/classes/JobTransaction'
const {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END
} = require('../../lib/constants').default

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}

export function endFetchingJobDetails(jobDataList, fieldDataList, nextStatusList) {
    return {
        type: JOB_DETAILS_FETCHING_END,
        payload: {
            jobDataList,
            fieldDataList,
            nextStatusList
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
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.nextStatusList))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}