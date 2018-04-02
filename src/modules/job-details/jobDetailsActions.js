'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { addServerSmsService } from '../../services/classes/AddServerSms'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobDetailsService } from '../../services/classes/JobDetails'
import { setState, navigateToScene } from '..//global/globalActions'
import { performSyncService, pieChartCount } from '../home/homeActions'
import { jobStatusService } from '../../services/classes/JobStatus'
import { NavigationActions } from 'react-navigation'
import * as realm from '../../repositories/realmdb'
import { fetchJobs } from '../taskList/taskListActions'
import {
    Start,
    PENDING,
    JOB_EXPIRY_TIME
} from '../../lib/AttributeConstants'
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
    RESET_STATE_FOR_JOBDETAIL,
    SHOULD_RELOAD_START
} from '../../lib/constants'
import { draftService } from '../../services/classes/DraftService';

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}


export function endFetchingJobDetails(jobDataList, fieldDataList, currentStatus, jobTransaction, errorMessage, draftStatusInfo, parentStatusList, isEtaTimerShow, jobExpiryTime) {
    return {
        type: JOB_DETAILS_FETCHING_END,
        payload: {
            fieldDataList,
            jobDataList,
            jobTransaction,
            currentStatus,
            errorMessage,
            parentStatusList,
            draftStatusInfo,
            isEtaTimerShow,
            jobExpiryTime
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
            const details = await jobTransactionService.prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList.value, jobAttributeStatusList.value, fieldAttributeMasterList.value, fieldAttributeStatusList.value, null, null, statusList.value)
            const jobMaster = await jobMasterService.getJobMasterFromJobMasterList(details.jobTransactionDisplay.jobMasterId)
            const errorMessage = (jobMaster[0].enableOutForDelivery) || (jobMaster[0].enableResequenceRestriction || (details.jobTime != null && details.jobTime != undefined)) ? await jobDetailsService.checkForEnablingStatus(jobMaster[0].enableOutForDelivery,
                jobMaster[0].enableResequenceRestriction, details.jobTime, jobMasterList, details.currentStatus.tabId, details.seqSelected, statusList, jobTransactionId, details.currentStatus.actionOnStatus) : false
            const jobExpiryData = (!errorMessage && details.jobDataObject.dataMap[JOB_EXPIRY_TIME]) ? (Object.values(details.jobDataObject.dataMap[JOB_EXPIRY_TIME])[0]) : null
            const jobExpiryTime = jobExpiryData && jobExpiryData.data ? jobExpiryData.data.value : null
            const parentStatusList = (jobMaster[0].isStatusRevert) ? await jobDetailsService.getParentStatusList(statusList.value, details.currentStatus, jobTransactionId) : []
            const draftStatusInfo = draftService.getDraftForState(details.jobTransactionDisplay, null)
            const statusCategory = await jobStatusService.getStatusCategoryOnStatusId(details.jobTransactionDisplay.jobStatusId)
            let isEtaTimerShow = (statusCategory == 1)
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.currentStatus, details.jobTransactionDisplay, errorMessage, draftStatusInfo, parentStatusList, isEtaTimerShow, jobExpiryTime))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
            dispatch(endFetchingJobDetails(null, null, null, null, error.message, null, null, null, null))
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
        } catch (error) {

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

export function setAllDataOnRevert(jobTransaction, statusTo, navigation) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingJobDetails());
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            await jobDetailsService.setAllDataForRevertStatus(statusList, jobTransaction, statusTo)
            dispatch(performSyncService())
            dispatch(pieChartCount())
            dispatch(fetchJobs())
            let landingId = (Start.landingTab) ? jobStatusService.getTabIdOnStatusId(statusList.value, statusTo[0]) : false
            if (landingId) {
                await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(true))
                dispatch(NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }),
                        NavigationActions.navigate({ routeName: TabScreen, params: { landingTab: landingId } })
                    ]
                }))
            } else { dispatch(navigation.goBack()) }
            dispatch(setState(RESET_STATE_FOR_JOBDETAIL))
        } catch (error) {
            console.log(error)
            dispatch(endFetchingJobDetails(null, null, null, null, error.message, null, null, null, null))
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
            const jobMaster = await jobMasterService.getJobMasterFromJobMasterList(FormLayoutData.jobMasterId)
            if (!(jobMaster[0].enableLocationMismatch) || currentStatusCategory != 1 || !nextStatusCategory || !(nextStatusCategory == 2 || nextStatusCategory == 3)) {
                dispatch(navigateToScene('FormLayout', FormLayoutData))
            }
            const userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
            if (data.jobTransaction.jobId != null && jobDetailsService.checkLatLong(data.jobTransaction.jobId, userSummary.value.lastLat, userSummary.value.lastLng)) {
                dispatch(setState(IS_MISMATCHING_LOCATION, { id: data.statusList.id, name: data.statusList.name }))
            }
            //dispatch(navigateToScene('FormLayout', FormLayoutData))
        } catch (error) {
            // To do
            // Handle exceptions and change state accordingly
            console.log(error)
        }
    }
}
