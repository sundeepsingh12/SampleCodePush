'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { addServerSmsService } from '../../services/classes/AddServerSms'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobDetailsService } from '../../services/classes/JobDetails'
import { jobStatusService } from '../../services/classes/JobStatus'
import { NavigationActions } from 'react-navigation'
import { setState, navigateToScene } from '..//global/globalActions'
import { performSyncService, pieChartCount } from '../home/homeActions'
import * as realm from '../../repositories/realmdb'
import { fetchJobs } from '../taskList/taskListActions'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    FormLayout,
    JOB_SUMMARY,
    IS_MISMATCHING_LOCATION,
    TABLE_JOB,
    USER_SUMMARY,
    JOB_MASTER,
    USER,
    TabScreen,
    HomeTabNavigatorScreen,
    RESET_STATE_FOR_JOBDETAIL
} from '../../lib/constants'

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}

export function resetState() {
    return {
        type: RESET_STATE_FOR_JOBDETAIL,
    }
}

export function endFetchingJobDetails(jobDataList, fieldDataList, currentStatus, jobTransaction, errorMessage,parentStatusList) {
    return {
        type: JOB_DETAILS_FETCHING_END,
        payload: {
            fieldDataList,
            jobDataList,
            jobTransaction,
            currentStatus,
            errorMessage,
            parentStatusList
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
            const jobMaster = jobMasterService.getJobMaterFromJobMasterLists(details.jobTransactionDisplay.jobMasterId, jobMasterList)
            const errorMessage = (jobMaster[0].enableOutForDelivery) || (jobMaster[0].enableResequenceRestriction || (details.jobTime != null && details.jobTime != undefined)) ? await jobDetailsService.checkForEnablingStatus(jobMaster[0].enableOutForDelivery, 
                                jobMaster[0].enableResequenceRestriction, details.jobTime, jobMasterList, details.currentStatus.tabId, details.seqSelected, statusList, jobTransactionId) : false
            const parentStatusList = (jobMaster[0].isStatusRevert) ? jobDetailsService.getParentStatusList(statusList.value,details.currentStatus) : []
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.currentStatus, details.jobTransactionDisplay,errorMessage,parentStatusList))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}
export function setSmsBodyAndSendMessage(contact, smsTemplate, jobTransaction, jobData, fieldData) {
    return async function (dispatch) {
        try {
            let jobAttributesList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE);
            let fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
            let user = await keyValueDBService.getValueFromStore(USER);
            await addServerSmsService.sendFieldMessage(contact, smsTemplate, jobTransaction, jobData, fieldData, jobAttributesList, fieldAttributesList, user)
        }catch (error) {

        }
    }
}

/**
 * ## status revert from field case
 *  
 * @param {object} jobTransaction - It contains data for form layout
 * @param {object} statusTo - status to revert transaction
 * @param {callback} navigation - navigation action
 *
 * It set all data for revert status and start sync service
 * It also fetch jobs and reset state of job details
 *
 */

export function setAllDataOnRevert(jobTransaction,statusTo,navigation) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingJobDetails());    
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)            
            await jobDetailsService.setAllDataForRevertStatus(statusList,jobTransaction,statusTo)
            dispatch(performSyncService())     
            dispatch(pieChartCount())                                                           
            dispatch(fetchJobs())
            dispatch(navigation.goBack())            
            dispatch(resetState())
        } catch (error) {
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
