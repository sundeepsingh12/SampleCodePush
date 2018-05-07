'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { addServerSmsService } from '../../services/classes/AddServerSms'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobDetailsService } from '../../services/classes/JobDetails'
import { setState, navigateToScene, showToastAndAddUserExceptionLog } from '..//global/globalActions'
import { performSyncService, pieChartCount } from '../home/homeActions'
import { jobStatusService } from '../../services/classes/JobStatus'
import { NavigationActions } from 'react-navigation'
import * as realm from '../../repositories/realmdb'
import { NetInfo } from 'react-native'
import _ from 'lodash'
import { fetchJobs } from '../taskList/taskListActions'
import { PLEASE_ENABLE_INTERNET_TO_UPDATE_THIS_JOB, UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET } from '../../lib/ContainerConstants'
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
    SHOULD_RELOAD_START,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT
} from '../../lib/constants'
import { draftService } from '../../services/classes/DraftService';

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}


export function endFetchingJobDetails(jobDataList, fieldDataList, currentStatus, jobTransaction, errorMessage, draftStatusInfo, parentStatusList, isEtaTimerShow, jobExpiryTime, isSyncLoading) {
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
            jobExpiryTime,
            isSyncLoading
        }
    }
}

export function getJobDetails(jobTransactionId) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingJobDetails())
            const { statusList, jobMasterList, jobAttributeMasterList, fieldAttributeMasterList, fieldAttributeStatusList, jobAttributeStatusList } = await jobDetailsService.getJobDetailsParameters()
            const details = await jobTransactionService.prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList.value, jobAttributeStatusList.value, fieldAttributeMasterList.value, fieldAttributeStatusList.value, null, null, statusList.value)
            if (details.checkForSeenStatus) dispatch(performSyncService())
            const jobMaster = await jobMasterService.getJobMasterFromJobMasterList(details.jobTransactionDisplay.jobMasterId)
            const errorMessage = (jobMaster[0].enableOutForDelivery) || (jobMaster[0].enableResequenceRestriction || (details.jobTime != null && details.jobTime != undefined)) ? jobDetailsService.checkForEnablingStatus(jobMaster[0].enableOutForDelivery,
                jobMaster[0].enableResequenceRestriction, details.jobTime, jobMasterList, details.currentStatus.tabId, details.seqSelected, statusList, jobTransactionId, details.currentStatus.actionOnStatus) : false
            const jobExpiryData = (!errorMessage && details.jobDataObject.dataMap[JOB_EXPIRY_TIME]) ? (Object.values(details.jobDataObject.dataMap[JOB_EXPIRY_TIME])[0]) : null
            const jobExpiryTime = jobExpiryData && jobExpiryData.data ? jobExpiryData.data.value : null
            const parentStatusList = (jobMaster[0].isStatusRevert) && !_.isEqual(_.toLower(details.currentStatus.code), 'seen') ? await jobDetailsService.getParentStatusList(statusList.value, details.currentStatus, jobTransactionId) : []
            const draftStatusInfo = draftService.getDraftForState(details.jobTransactionDisplay, null)
            const statusCategory = await jobStatusService.getStatusCategoryOnStatusId(details.jobTransactionDisplay.jobStatusId)
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.currentStatus, details.jobTransactionDisplay, errorMessage, draftStatusInfo, parentStatusList, (statusCategory == 1), jobExpiryTime, draftStatusInfo && jobMaster[0].enableLiveJobMaster))
            if (draftStatusInfo && jobMaster[0].enableLiveJobMaster) dispatch(checkForInternetAndStartSyncAndNavigateToFormLayout(null, jobMaster))
        } catch (error) {
            showToastAndAddUserExceptionLog(1101, error.message, 'danger', 0)
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
            showToastAndAddUserExceptionLog(1102, error.message, 'danger', 1)
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
            //dispatch(fetchJobs())
            //let landingId = (Start.landingTab) ? jobStatusService.getTabIdOnStatusId(statusList.value, statusTo[0]) : false
            //if (landingId) {
            //    await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(true))
            dispatch(NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }),
                    // NavigationActions.navigate({ routeName: TabScreen, params: { landingTab: landingId } })
                ]
            }))
            //} else { dispatch(navigation.goBack()) }
            dispatch(setState(RESET_STATE_FOR_JOBDETAIL))
        } catch (error) {
            showToastAndAddUserExceptionLog(1103, error.message, 'danger', 0)
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
            const userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
            if ((jobMaster[0].enableLocationMismatch) && currentStatusCategory == 1 && (nextStatusCategory == 2 || nextStatusCategory == 3) && jobDetailsService.checkLatLong(data.jobTransaction.jobId, userSummary.value.lastLat, userSummary.value.lastLng)) {
                dispatch(setState(IS_MISMATCHING_LOCATION, { id: data.statusList.id, name: data.statusList.name }))
            } else {
                dispatch(checkForInternetAndStartSyncAndNavigateToFormLayout(FormLayoutData, jobMaster))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(1104, error.message, 'danger', 1)
        }
    }
}

export function checkForInternetAndStartSyncAndNavigateToFormLayout(FormLayoutData, jobMaster) {
    return async function (dispatch) {
        try {
            const jobMasterValue = (!jobMaster) ? await jobMasterService.getJobMasterFromJobMasterList(FormLayoutData.jobMasterId) : jobMaster
            if (jobMasterValue[0].enableLiveJobMaster) {
                NetInfo.isConnected.fetch().then(async isConnected => {
                    if (isConnected) {
                        dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL, true))
                        let message = await dispatch(performSyncService())
                        if (message === true) {
                            dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL, false))
                            if (!_.isEmpty(FormLayoutData)) dispatch(navigateToScene('FormLayout', FormLayoutData))
                        } else {
                            dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT, false))
                            alert(UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET)
                        }
                    } else {
                        alert(PLEASE_ENABLE_INTERNET_TO_UPDATE_THIS_JOB)
                    }
                }).catch(function (err) {
                    dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL, false))
                    showToastAndAddUserExceptionLog(1105, err.message, 'danger', 1)
                })
            } else if (!_.isEmpty(FormLayoutData)) {
                dispatch(navigateToScene('FormLayout', FormLayoutData))
            }
        } catch (error) {
            dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL, false))
            showToastAndAddUserExceptionLog(1106, error.message, 'danger', 1)
        }
    }
}
