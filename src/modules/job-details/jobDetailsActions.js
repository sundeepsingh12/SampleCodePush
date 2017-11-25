'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { NavigationActions } from 'react-navigation'
import { setState, navigateToScene } from '..//global/globalActions'
import { jobDetailsService } from '../../services/classes/JobDetails'
import { jobMasterService } from '../../services/classes/JobMaster'

import * as realm from '../../repositories/realmdb'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    FormLayout,
    IS_MISMATCHING_LOCATION,
    TABLE_JOB,
    USER_SUMMARY,
    JOB_MASTER,
} from '../../lib/constants'

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}

export function endFetchingJobDetails(jobDataList, fieldDataList, currentStatus, jobTransaction) {
    return {
        type: JOB_DETAILS_FETCHING_END,
        payload: {
            fieldDataList,
            jobDataList,
            jobTransaction,
            currentStatus,
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
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.currentStatus, details.jobTransactionDisplay))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}

/**
 * ## Location Mismatch
 * @param {object} data - It contains data for form layout
 * @param {string} currentStatusCategory - current status category
 *
 * It check that user location and job location are far than 100m or less 
 *
 */
export function checkForLocationMismatch(data, currentStatusCategory) {
    return async function (dispatch) {
        try {
            const FormLayoutData = { contactData: data.contactData, jobTransactionId: data.jobTransaction.id, jobTransaction: data.jobTransaction, statusId: data.statusList.id, statusName: data.statusList.name, jobMasterId: data.jobTransaction.jobMasterId }
            const nextStatusCategory = data.statusList.statusCategory
            const jobMaster = await jobMasterService.getJobMaterFromJobMasterList(FormLayoutData.jobMasterId)
            if (!(jobMaster[0].enableLocationMismatch) || currentStatusCategory != 1 || !nextStatusCategory || !(nextStatusCategory == 2 || nextStatusCategory == 3))
                return dispatch(navigateToScene('FormLayout', FormLayoutData))
            const userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
            if (data.jobTransaction.jobId != null && jobDetailsService.checkLatLong(data.jobTransaction.jobId, userSummary.value.lastLat, userSummary.value.lastLng))
                return dispatch(setState(IS_MISMATCHING_LOCATION, { id: data.statusList.id, name: data.statusList.name }))
            dispatch(navigateToScene('FormLayout', FormLayoutData))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }

}