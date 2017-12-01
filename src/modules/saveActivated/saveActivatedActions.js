'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import { setState, navigateToScene } from '../global/globalActions'
const {
    LOADER_ACTIVE,
    POPULATE_DATA,
    CheckoutDetails,
    SAVE_ACTIVATED,
    SAVE_ACTIVATED_INITIAL_STATE,
    DELETE_ITEM_SAVE_ACTIVATED,
    Home,
    SaveActivated
} = require('../../lib/constants').default
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
            let { differentData } = await transientStatusService.setSavedJobDetails(formLayoutState, recurringData, navigationParams.jobTransaction, navigationParams.currentStatus.id)
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
            console.log(error)
        }
    }
}

export function checkout(previousFormLayoutState, recurringData, jobMasterId, commonData, statusId) {
    return async function (dispatch) {
        try {
            dispatch(setState(LOADER_ACTIVE, true))
            let totalAmount = await transientStatusService.calculateTotalAmount(commonData.amount, recurringData)
            await transientStatusService.saveDataInDbAndAddTransactionsToSyncList(previousFormLayoutState, recurringData, jobMasterId, statusId, false)
            dispatch(navigateToScene(CheckoutDetails, {
                commonData: commonData.commonData,
                recurringData,
                totalAmount,
                jobMasterId
            }))
        } catch (error) {
            console.log(error)
        }
    }
}

export function storeState(saveActivatedState, screenName, jobMasterId, navigationParams, navigationFormLayoutStates) {
    return async function (dispatch) {
        try {
            let cloneSaveActivatedState = _.cloneDeep(saveActivatedState)
            let cloneNavigationFormLayoutStates = _.cloneDeep(navigationFormLayoutStates)
            let { differentData, arrayFormElement } = await transientStatusService.convertMapToArrayAndArrayToMap(cloneSaveActivatedState.differentData, cloneNavigationFormLayoutStates, true)
            cloneSaveActivatedState.differentData = differentData
            cloneNavigationFormLayoutStates = arrayFormElement
            await keyValueDBService.validateAndSaveData(SAVE_ACTIVATED, {
                saveActivatedState: cloneSaveActivatedState,
                screenName,
                jobMasterId,
                navigationParams,
                navigationFormLayoutStates: cloneNavigationFormLayoutStates
            })
        } catch (error) {
            console.log(error)
        }
    }
}


export function clearStateAndStore() {
    return async function (dispatch) {
        try {
            dispatch(setState(SAVE_ACTIVATED_INITIAL_STATE, {}))
            dispatch(navigateToScene(Home, {}))
            await keyValueDBService.deleteValueFromStore(SAVE_ACTIVATED)
        } catch (error) {
            console.log(error)
        }
    }
}


export function deleteItem(itemId, recurringData, commonData, navigationParams, statusName) {
    return async function (dispatch) {
        try {
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
            console.log(error)
        }
    }
}

