'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { transientStatusAndSaveActivatedService } from '../../services/classes/TransientStatusAndSaveActivatedService'
import { setState, navigateToScene, showToastAndAddUserExceptionLog } from '../global/globalActions'
import {
    LOADER_ACTIVE,
    POPULATE_DATA,
    CheckoutDetails,
    SAVE_ACTIVATED,
    SAVE_ACTIVATED_INITIAL_STATE,
    DELETE_ITEM_SAVE_ACTIVATED,
    HomeTabNavigatorScreen,
    SaveActivated,
    SET_SAVE_ACTIVATED_TOAST_MESSAGE,
    USER,
    IS_COMPANY_CODE_DHL,
    EMAILID_VIEW_ARRAY,
    SHOULD_RELOAD_START,
    SET_SAVE_ACTIVATED_DRAFT
} from '../../lib/constants'
import _ from 'lodash'
import { draftService } from '../../services/classes/DraftService'
import { restoreDraftAndNavigateToFormLayout } from '../form-layout/formLayoutActions'
import { fetchJobs } from '../taskList/taskListActions';

export function addTransactionAndPopulateView(formLayoutState, recurringData, commonData, statusName, navigationParams, navigationFormLayoutStates) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            if (_.isEmpty(commonData)) {
                let returnParams = await transientStatusAndSaveActivatedService.populateCommonData(navigationFormLayoutStates)
                commonData = { commonData: returnParams.commonData, amount: returnParams.totalAmount }
                statusName = returnParams.statusName
            }
            let { differentData } = await transientStatusAndSaveActivatedService.saveRecurringData(formLayoutState, recurringData, navigationParams.jobTransaction, navigationParams.currentStatus.id)
            await dispatch(storeState({
                commonData,
                differentData,
                isSignOffVisible: (_.size(navigationParams.currentStatus.nextStatusList) == 1) ? true : false,
                statusName
            }, SaveActivated, navigationParams.jobMasterId, navigationParams, navigationFormLayoutStates))
            dispatch(setState(POPULATE_DATA, {
                commonData,
                statusName,
                differentData,
                isSignOffVisible: (_.size(navigationParams.currentStatus.nextStatusList) == 1) ? true : false,
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(2001, error.message, 'danger', 1)
            dispatch(setState(LOADER_ACTIVE, false))
        }
    }
}

export function checkout(previousFormLayoutState, recurringData, jobMasterId, commonData, statusId,navigate) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            let totalAmount = await transientStatusAndSaveActivatedService.calculateTotalAmount(commonData.amount, recurringData)
            let { emailTableElement, emailIdInFieldData, contactNumberInFieldData } = await transientStatusAndSaveActivatedService.saveDataInDbAndAddTransactionsToSyncList(previousFormLayoutState, recurringData, jobMasterId, statusId, false)
            let responseMessage = await transientStatusAndSaveActivatedService.sendEmailOrSms(totalAmount, emailTableElement, emailIdInFieldData, true, true, jobMasterId)
            //await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(true))//after completing jobs set start module to reload itself so that new job which is created here will be visible
            await draftService.deleteDraftFromDb({
                id: -1,
                jobId: -1,
                jobMasterId
            }, jobMasterId)
            dispatch(setState(SET_SAVE_ACTIVATED_TOAST_MESSAGE, responseMessage))
            dispatch(navigateToScene(CheckoutDetails, {
                commonData: commonData.commonData,
                recurringData,
                totalAmount,
                jobMasterId,
                emailTableElement,
                emailIdInFieldData,
                contactNumberInFieldData
            },
            navigate
        ))
            dispatch(fetchJobs());
        } catch (error) {
            showToastAndAddUserExceptionLog(2002, error.message, 'danger', 1)
            dispatch(setState(LOADER_ACTIVE, false))
        }
    }
}

export function sendSmsOrEmails(totalAmount, emailTableElement, jobMasterId, emailOrSmsList, isEmail, emailGeneratedFromComplete) {
    return async function (dispatch) {
        try {
            let responseMessage = await transientStatusAndSaveActivatedService.sendEmailOrSms(totalAmount, emailTableElement, emailOrSmsList, isEmail, emailGeneratedFromComplete, jobMasterId)
            dispatch(setState(SET_SAVE_ACTIVATED_TOAST_MESSAGE, responseMessage))
        } catch (error) {
            showToastAndAddUserExceptionLog(2003, error.message, 'danger', 1)
        }
    }
}

export function fetchUserData(email, inputTextEmail) {
    return async function (dispatch) {
        try {
            dispatch(setState(EMAILID_VIEW_ARRAY, { email, inputTextEmail }))
            let userData = await keyValueDBService.getValueFromStore(USER)
            if (userData && userData.value && userData.value.company && userData.value.company.code && (_.startsWith(_.toLower(userData.value.company.code), 'dhl'))) {
                dispatch(setState(IS_COMPANY_CODE_DHL, true))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2004, error.message, 'danger', 1)
        }
    }
}


export function storeState(saveActivatedState, screenName, jobMasterId, navigationParams, navigationFormLayoutStates) {
    return async function (dispatch) {
        try {
            let storeObject = await transientStatusAndSaveActivatedService.createObjectForStore(saveActivatedState, screenName, jobMasterId, navigationParams, navigationFormLayoutStates)
            await keyValueDBService.validateAndSaveData(SAVE_ACTIVATED, storeObject)
        } catch (error) {
            showToastAndAddUserExceptionLog(2005, error.message, 'danger', 1)
        }
    }
}


export function clearStateAndStore(jobMasterId,pop) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            let saveActivatedData = await keyValueDBService.getValueFromStore(SAVE_ACTIVATED)
            delete saveActivatedData.value[jobMasterId]
            await keyValueDBService.validateAndSaveData(SAVE_ACTIVATED, saveActivatedData.value)
            await draftService.deleteDraftFromDb({
                id: -1,
                jobId: -1
            }, jobMasterId)
            dispatch(setState(SAVE_ACTIVATED_INITIAL_STATE, {}))
            // dispatch(navigateToScene(HomeTabNavigatorScreen, {},navigate))
            pop(2)

        } catch (error) {
            showToastAndAddUserExceptionLog(2006, error.message, 'danger', 1)
            dispatch(setState(LOADER_ACTIVE, false))
        }
    }
}


export function deleteItem(itemId, recurringData, commonData, navigationParams, statusName) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            recurringData = await transientStatusAndSaveActivatedService.deleteRecurringItem(itemId, recurringData)
            await dispatch(storeState({
                commonData,
                differentData: recurringData,
                isSignOffVisible: (_.size(navigationParams.currentStatus.nextStatusList) == 1) ? true : false,
                statusName
            }, SaveActivated,
                navigationParams.jobMasterId,
                navigationParams))
            dispatch(setState(DELETE_ITEM_SAVE_ACTIVATED, recurringData))
        } catch (error) {
            showToastAndAddUserExceptionLog(2007, error.message, 'danger', 1)
            dispatch(setState(LOADER_ACTIVE, false))
        }
    }
}

export function checkIfDraftExists(jobMasterId) {
    return async function (dispatch) {
        try {
            const draftStatusInfo = draftService.getDraftForState(null, jobMasterId)
            dispatch(setState(SET_SAVE_ACTIVATED_DRAFT, draftStatusInfo))
        } catch (error) {
            console.log(error)
        }
    }
}
export function restoreDraft(draft, contactData, recurringData, jobMasterId, navigationFormLayoutStates) {
    return async function (dispatch) {
        try {
            let cloneJobTransaction = {}
            let lastIndex = parseInt(_.findLastKey(recurringData))
            if (!lastIndex) {
                lastIndex = 0
            }
            cloneJobTransaction.jobId = cloneJobTransaction.id = --lastIndex
            cloneJobTransaction.jobMasterId = jobMasterId
            dispatch(restoreDraftAndNavigateToFormLayout(contactData, cloneJobTransaction, draft, navigationFormLayoutStates))
            dispatch(setState(SET_SAVE_ACTIVATED_DRAFT, {}))
        } catch (error) {
            console.log(error)
        }
    }
}
