'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { transientStatusService } from '../../services/classes/TransientStatusService'
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
} from '../../lib/constants'
import _ from 'lodash'

export function addTransactionAndPopulateView(formLayoutState, recurringData, commonData, statusName, navigationParams, navigationFormLayoutStates) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            if (_.isEmpty(commonData)) {
                let returnParams = await transientStatusService.populateCommonData(navigationFormLayoutStates)
                commonData = { commonData: returnParams.commonData, amount: returnParams.totalAmount }
                statusName = returnParams.statusName
            }
            let { differentData } = await transientStatusService.saveRecurringData(formLayoutState, recurringData, navigationParams.jobTransaction, navigationParams.currentStatus.id)
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

export function checkout(previousFormLayoutState, recurringData, jobMasterId, commonData, statusId) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            let totalAmount = await transientStatusService.calculateTotalAmount(commonData.amount, recurringData)
            let { emailTableElement, emailIdInFieldData, contactNumberInFieldData } = await transientStatusService.saveDataInDbAndAddTransactionsToSyncList(previousFormLayoutState, recurringData, jobMasterId, statusId, false)
            let responseMessage = await transientStatusService.sendEmailOrSms(totalAmount, emailTableElement, emailIdInFieldData, true, true, jobMasterId)
            dispatch(setState(SET_SAVE_ACTIVATED_TOAST_MESSAGE, responseMessage))
            dispatch(navigateToScene(CheckoutDetails, {
                commonData: commonData.commonData,
                recurringData,
                totalAmount,
                jobMasterId,
                emailTableElement,
                emailIdInFieldData,
                contactNumberInFieldData
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(2002, error.message, 'danger', 1)
            dispatch(setState(LOADER_ACTIVE, false))
        }
    }
}

export function sendSmsOrEmails(totalAmount, emailTableElement, jobMasterId, emailOrSmsList, isEmail, emailGeneratedFromComplete) {
    return async function (dispatch) {
        try {
            let responseMessage = await transientStatusService.sendEmailOrSms(totalAmount, emailTableElement, emailOrSmsList, isEmail, emailGeneratedFromComplete, jobMasterId)
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
            let storeObject = await transientStatusService.createObjectForStore(saveActivatedState, screenName, jobMasterId, navigationParams, navigationFormLayoutStates)
            await keyValueDBService.validateAndSaveData(SAVE_ACTIVATED, storeObject)
        } catch (error) {
            showToastAndAddUserExceptionLog(2005, error.message, 'danger', 1)
        }
    }
}


export function clearStateAndStore(jobMasterId) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            let saveActivatedData = await keyValueDBService.getValueFromStore(SAVE_ACTIVATED)
            delete saveActivatedData.value[jobMasterId]
            await keyValueDBService.validateAndSaveData(SAVE_ACTIVATED, saveActivatedData.value)
            dispatch(setState(SAVE_ACTIVATED_INITIAL_STATE, {}))
            dispatch(navigateToScene(HomeTabNavigatorScreen, {}))
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
            recurringData = await transientStatusService.deleteRecurringItem(itemId, recurringData)
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

