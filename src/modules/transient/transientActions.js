'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { setState } from '../global/globalActions'
const {
    ADD_FORM_LAYOUT_STATE,
    SET_SHOW_JOB_DETAILS,
    LOADER_IS_RUNNING,
    SHOW_CHECKOUT_DETAILS,
    TABLE_JOB_TRANSACTION,
    TABLE_FIELD_DATA,
    TABLE_JOB,
    Home,
    SET_INITIAL_STATE_TRANSIENT_STATUS
} = require('../../lib/constants').default
import CONFIG from '../../lib/config'
import _ from 'lodash'
import { getNextFocusableAndEditableElements } from '../form-layout/formLayoutActions'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import * as realm from '../../repositories/realmdb'
import FieldData from '../../repositories/schema/FieldData';
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface.js'
import { navigateToScene } from '../../modules/global/globalActions'

export function setStateFromNavigationParams(formLayout, transientFormLayoutMap, currentStatus, formElement, jobTransaction, savedJobDetails) {
    return async function (dispatch) {
        console.log('setStateFromNavigationParams', formElement)
        try {
            dispatch(setState(LOADER_IS_RUNNING, true))
            if (formLayout && currentStatus) {
                transientFormLayoutMap[currentStatus.id] = _.cloneDeep(formLayout)
                let isCheckoutVisible = transientStatusService.isAllNextStatusSaveActivated(currentStatus.nextStatusList)
                dispatch(setState(ADD_FORM_LAYOUT_STATE, {
                    formLayoutStates: transientFormLayoutMap,
                    currentStatus,
                    isCheckoutVisible
                }))
            }
            if (formElement) {
                console.log('abc')
                savedJobDetails = transientStatusService.setSavedJobDetails(formElement, jobTransaction.id, jobTransaction.jobId, savedJobDetails)
                dispatch(setState(SET_SHOW_JOB_DETAILS, savedJobDetails))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function deleteTransaction(jobTransactionId, savedJobDetails) {
    return async function (dispatch) {
        try {
            // console.log(jobId)
            // let jobTransactions = await realm.getAll(TABLE_FIELD_DATA)
            // let TransactionData = { ...jobTransactions }
            // let jTD = JSON.parse(JSON.stringify(TransactionData))
            // console.log('abc', jTD)
            await realm.deleteRecordList(TABLE_FIELD_DATA, jobTransactionId, 'jobTransactionId')
            await realm.deleteRecordList(TABLE_JOB, jobTransactionId, 'id')
            await realm.deleteRecordList(TABLE_JOB_TRANSACTION, jobTransactionId, 'jobId')
            // console.log('after delete')

            // jobTransactions = await realm.getAll(TABLE_FIELD_DATA)
            // TransactionData = { ...jobTransactions }
            // jTD = JSON.parse(JSON.stringify(TransactionData))
            // console.log('abc', jTD)

            // console.log('savedJobDetails', savedJobDetails)
            let cloneSavedJobDetails = { ...savedJobDetails }
            delete cloneSavedJobDetails[jobTransactionId]
            // console.log('cloneSavedJobDetails', cloneSavedJobDetails)
            dispatch(setState(SET_SHOW_JOB_DETAILS, cloneSavedJobDetails))

        } catch (error) {
            console.log(error)
        }
    }
}

export function deleteAllTransactions(savedJobDetails) {
    return async function (dispatch) {
        try {
            let jobTransactionIds = Object.keys(savedJobDetails[0])
            // console.log('ids', jobTransactionIds)
            // let fieldDataList = await realm.getAll(TABLE_JOB_TRANSACTION)
            // for (let index in fieldDataList) {
            //     let fieldData = { ...fieldDataList[index] }
            //     let jTD = JSON.parse(JSON.stringify(fieldData))
            //     console.log('abc', jTD)
            // }

            await realm.deleteRecordList(TABLE_FIELD_DATA, jobTransactionIds, 'jobTransactionId')
            await realm.deleteRecordList(TABLE_JOB, jobTransactionIds, 'id')
            await realm.deleteRecordList(TABLE_JOB_TRANSACTION, jobTransactionIds, 'jobId')

            // console.log('after     aaaaaaaaaaA>>>>>>>>>>>>>>>')

            // fieldDataList = await realm.getAll(TABLE_JOB_TRANSACTION)
            // for (let index in fieldDataList) {
            //     let fieldData = { ...fieldDataList[index] }
            //     let jTD = JSON.parse(JSON.stringify(fieldData))
            //     console.log('abc', jTD)
            // }
            // await realm.deleteRecordList(TABLE_JOB, transactionIds, 'id')
            dispatch(setState(SET_SHOW_JOB_DETAILS, {}))
        } catch (error) {
            console.log(error)
        }
    }
}

export function addToSyncList(jobTransactionIdList) {
    return async function (dispatch) {
        try {
            console.log('addToSyncList', jobTransactionIdList)
            for (let jobTransactionId of jobTransactionIdList) {
                await formLayoutEventsInterface.addTransactionsToSyncList(jobTransactionId);
                dispatch(setState(SET_INITIAL_STATE_TRANSIENT_STATUS, {}))
                dispatch(navigateToScene(Home, {}))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function showCheckOutDetails(formLayoutStates, savedJobDetails) {
    return async function (dispatch) {
        try {
            console.log('showCheckOutDetails')
            let details = await transientStatusService.buildDetialsForCheckout(formLayoutStates, savedJobDetails)
            dispatch(setState(SHOW_CHECKOUT_DETAILS, details))
        } catch (error) {
            console.log(error)
        }
    }
}