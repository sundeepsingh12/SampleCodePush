'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { addServerSmsService } from '../../services/classes/AddServerSms'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobDetailsService } from '../../services/classes/JobDetails'
import { setState, showToastAndAddUserExceptionLog } from '..//global/globalActions'
import { performSyncService, pieChartCount } from '../home/homeActions'
import { jobStatusService } from '../../services/classes/JobStatus'
import { MosambeeWalletPaymentServices } from '../../services/payment/MosambeeWalletPayment'
import {mapKeys} from 'lodash'
import { fetchJobs } from '../taskList/taskListActions'
import { paymentService } from '../../services/payment/Payment'
import { UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET,OK,TRANSACTION_SUCCESSFUL } from '../../lib/ContainerConstants'
import { saveJobTransaction } from '../form-layout/formLayoutActions'
import { Toast } from 'native-base'
import { jobDataService } from '../../services/classes/JobData'
import { fieldDataService } from '../../services/classes/FieldData'
import {
    JOB_EXPIRY_TIME,
} from '../../lib/AttributeConstants'
import { StackActions } from 'react-navigation'
import { navDispatch, navigate } from '../navigators/NavigationService'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    IS_MISMATCHING_LOCATION,
    USER_SUMMARY,
    USER,
    RESET_STATE_FOR_JOBDETAIL,
    SET_LANDING_TAB,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT,
    SET_CHECK_TRANSACTION_STATUS
} from '../../lib/constants'
import { draftService } from '../../services/classes/DraftService';

export function startFetchingJobDetails() {
    return {
        type: JOB_DETAILS_FETCHING_START,
    }
}


export function endFetchingJobDetails(jobDataList, fieldDataList, currentStatus, jobTransaction, errorMessage, draftStatusInfo, parentStatusList, isEtaTimerShow, jobExpiryTime, isSyncLoading, messageList) {
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
            isSyncLoading,
            messageList
        }
    }
}

export function getJobDetails(params, key) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingJobDetails())
            const jobTransactionId = params.jobTransaction.id
            const { statusList, jobMasterList, jobAttributeMasterList, fieldAttributeMasterList, fieldAttributeStatusList, jobAttributeStatusList } = await jobDetailsService.getJobDetailsParameters()
            const details = await jobTransactionService.prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList.value, jobAttributeStatusList.value, fieldAttributeMasterList.value, fieldAttributeStatusList.value, statusList.value)
            if (details.checkForSeenStatus) dispatch(performSyncService())
            const jobMaster = await jobMasterService.getJobMasterFromJobMasterList(details.jobTransactionDisplay.jobMasterId)
            const errorMessage = (jobMaster[0].enableOutForDelivery) || (jobMaster[0].enableResequenceRestriction || (details.jobTime != null && details.jobTime != undefined)) ? jobDetailsService.checkForEnablingStatus(jobMaster[0].enableOutForDelivery,
                jobMaster[0].enableResequenceRestriction, details.jobTime, jobMasterList, details.currentStatus.tabId, details.seqSelected, statusList, jobTransactionId, details.currentStatus.actionOnStatus) : false
            const jobExpiryData = (!errorMessage && details.jobDataObject.dataMap[JOB_EXPIRY_TIME]) ? (Object.values(details.jobDataObject.dataMap[JOB_EXPIRY_TIME])[0]) : null
            const jobExpiryTime = jobExpiryData && jobExpiryData.data ? jobExpiryData.data.value : null
            const parentStatusList = (jobMaster[0].isStatusRevert) && !_.isEqual(_.toLower(details.currentStatus.code), 'seen') ? await jobDetailsService.getParentStatusList(statusList.value, details.currentStatus, jobTransactionId) : []
            const draftStatusInfo = draftService.getDraftForState(details.jobTransactionDisplay, null)
            const statusCategory = await jobStatusService.getStatusCategoryOnStatusId(details.jobTransactionDisplay.jobStatusId)
            if (draftStatusInfo) {
                await dispatch(checkForPaymentAtEnd(draftStatusInfo, details.jobTransactionDisplay, params, key, SET_CHECK_TRANSACTION_STATUS))
            }
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.fieldDataObject.dataList, details.currentStatus, details.jobTransactionDisplay, errorMessage, draftStatusInfo, parentStatusList, (statusCategory == 1), jobExpiryTime, draftStatusInfo && jobMaster[0].enableLiveJobMaster, details.messageList))
            if (draftStatusInfo && jobMaster[0].enableLiveJobMaster) dispatch(checkForInternetAndStartSyncAndNavigateToFormLayout(null, jobMaster))
        } catch (error) {
            showToastAndAddUserExceptionLog(1101, error.message, 'danger', 0)
            dispatch(endFetchingJobDetails(null, null, null, null, error.message, null, null, null, null))
        }
    }
}
export function checkForPaymentAtEnd(draftStatusInfo, jobTransaction, params, key, checkTransactionState, loaderState) {
    return async function (dispatch) {
        try {
            let { formLayoutState, navigationFormLayoutStatesForRestore } = draftService.getFormLayoutStateFromDraft(draftStatusInfo)
            const paymentAtEnd = formLayoutState.paymentAtEnd
            if (paymentAtEnd.parameters) {
                if (loaderState) dispatch(setState(loaderState, true))
                const walletParameters = paymentAtEnd.parameters
                let responseMessage = await MosambeeWalletPaymentServices.prepareJsonAndHitCheckTransactionApi(walletParameters, "20")
                let transactionId = _.trim(responseMessage.transId)
                if (_.isEqual(responseMessage.status, 'SUCCESS') && !_.isEmpty(transactionId) && !_.isEqual(transactionId, 'NA') && !_.isEqual(transactionId, 'N.A.')) {
                    const taskListScreenDetails = { jobDetailsScreenKey: key, pageObjectAdditionalParams: params ? params.pageObjectAdditionalParams : null }
                    paymentService.addPaymentObjectToDetailsArray(walletParameters.actualAmount, 14, responseMessage.transId, walletParameters.selectedWalletDetails.code, responseMessage, formLayoutState)
                    setTimeout(() => { dispatch(setState(checkTransactionState, TRANSACTION_SUCCESSFUL)) }, 1000);
                    if (!jobTransaction) {
                        Toast.show({ text: TRANSACTION_SUCCESSFUL, position: 'bottom', buttonText: OK, type: 'success', duration: 5000 })
                        jobTransaction = { id: formLayoutState.jobTransactionId, jobMasterId: draftStatusInfo.jobMasterId, jobId: formLayoutState.jobTransactionId, referenceNumber: draftStatusInfo.referenceNumber }
                    }
                    await dispatch(saveJobTransaction(formLayoutState, draftStatusInfo.jobMasterId, walletParameters.contactData, jobTransaction, navigationFormLayoutStatesForRestore, null, taskListScreenDetails))
                    return true
                } else {
                    dispatch(setState(checkTransactionState, null))
                    return
                }
            } else {
                return
            }
        } catch (error) {
            dispatch(setState(checkTransactionState, error.message))
        }
    }
}
export function deleteDraftAndNavigateToFormLayout(formLayoutData) {
    return async function (dispatch) {
        try {
            draftService.deleteDraftFromDb(formLayoutData.jobTransaction, formLayoutData.jobMasterId)
            navigate('FormLayout', formLayoutData)
        } catch (error) {
            showToastAndAddUserExceptionLog(1108, error.message, 'danger', 1)
        }
    }
}

export function setSmsBodyAndSendMessage(contact, smsTemplate, jobTransaction, jobData, fieldData) {
    return async function (dispatch) {
        try {
            let user = await keyValueDBService.getValueFromStore(USER);
            let jobDataMap = {}, fieldDataMap = {}
            jobDataService.buildMasterIdDataMapFormList(jobData, jobDataMap, 'jobAttributeMasterId')
            jobDataService.buildMasterIdDataMapFormList(fieldData, fieldDataMap, 'fieldAttributeMasterId')
            await addServerSmsService.sendFieldMessage(contact, smsTemplate, jobTransaction, user, fieldDataMap, jobDataMap)
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

export function setAllDataOnRevert(jobTransaction, statusTo, pageObjectAdditionalParams) {
    return async function (dispatch) {
        try {
            dispatch(startFetchingJobDetails());
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            await jobDetailsService.setAllDataForRevertStatus(statusList, jobTransaction, statusTo)
            let landingTabId = JSON.parse(pageObjectAdditionalParams).landingTabAfterJobCompletion ? jobStatusService.getTabIdOnStatusId(statusList.value, statusTo[0]) : null
            dispatch(setState(SET_LANDING_TAB, { landingTabId }))
            dispatch(performSyncService())
            dispatch(pieChartCount())
            dispatch(fetchJobs())
            navDispatch(StackActions.pop())
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
            const FormLayoutData = { contactData: data.contactData, jobTransactionId: data.jobTransaction.id, jobTransaction: data.jobTransaction, statusId: data.statusList.id, statusName: data.statusList.name, jobMasterId: data.jobTransaction.jobMasterId, pageObjectAdditionalParams: data.pageObjectAdditionalParams, jobDetailsScreenKey: data.jobDetailsScreenKey,transient:data.statusList.transient,saveActivated:data.statusList.saveActivated }
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
                dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL, true))
                let message = await dispatch(performSyncService())
                if (message === true) {
                    dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL, false))
                    if (!_.isEmpty(FormLayoutData)) navigate('FormLayout', FormLayoutData)
                } else {
                    dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT, false))
                    alert(UNABLE_TO_SYNC_WITH_SERVER_PLEASE_CHECK_YOUR_INTERNET)
                }
            }
            else if (!_.isEmpty(FormLayoutData)) {
                navigate('FormLayout', FormLayoutData)
            }
        } catch (error) {
            dispatch(setState(SET_LOADER_FOR_SYNC_IN_JOBDETAIL, false))
            showToastAndAddUserExceptionLog(1106, error.message, 'danger', 1)
        }
    }
}
