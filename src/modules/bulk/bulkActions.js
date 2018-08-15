'use strict'
import {
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_ALL_JOB_TRANSACTIONS,
    CUSTOMIZATION_LIST_MAP,
    SET_BULK_ERROR_MESSAGE,
    SET_BULK_TRANSACTION_PARAMETERS,
    SET_BULK_PARAMS_FOR_SELECTED_DATA
} from '../../lib/constants'
import {
    setState,
    showToastAndAddUserExceptionLog
} from '../global/globalActions'
import {
    SELECT_ALL,
    SELECT_NONE,
} from '../../lib/ContainerConstants'
import _ from 'lodash'
import { jobStatusService } from '../../services/classes/JobStatus';
import { bulkService } from '../../services/classes/Bulk'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'

/**
 * This action sets job transaction,manual selection,selectAll and search on line1 or lin2 parameters
 * @param {*} bulkParams 
 */
export function getBulkJobTransactions(bulkParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_BULK_TRANSACTIONS));
            let cloneBulkParams = JSON.parse(JSON.stringify(bulkParams))
            cloneBulkParams.pageObject.additionalParams = JSON.parse(cloneBulkParams.pageObject.additionalParams)
            cloneBulkParams.pageObject.jobMasterIds = JSON.parse(cloneBulkParams.pageObject.jobMasterIds)
            const data = await bulkService.getJobListingForBulk(cloneBulkParams);
            const bulkTransactions = data.idJobTransactionCustomizationListMap
            const statusList = data.statusList
            const currentStatus = jobStatusService.getJobStatusForJobStatusId(statusList ? statusList : null, cloneBulkParams.pageObject.additionalParams.statusId)
            let selectAll = cloneBulkParams.pageObject.additionalParams.selectAll ? true : false
            if (cloneBulkParams.pageObject.additionalParams.bulkJobSimilarityConf && (cloneBulkParams.pageObject.additionalParams.bulkJobSimilarityConf.lineOneEnabled || cloneBulkParams.pageObject.additionalParams.bulkJobSimilarityConf.lineTwoEnabled || cloneBulkParams.pageObject.additionalParams.bulkJobSimilarityConf.circleLineOneEnabled || cloneBulkParams.pageObject.additionalParams.bulkJobSimilarityConf.circleLineTwoEnabled)) {
                selectAll = false
            }
            let isManualSelectionAllowed = cloneBulkParams.pageObject.manualSelection || cloneBulkParams.pageObject.groupId ? true : false
            let searchSelectionOnLine1Line2 = cloneBulkParams.pageObject.additionalParams.searchSelectionOnLine1Line2 || cloneBulkParams.pageObject.groupId ? true : false
            let idToSeparatorMap
            if (searchSelectionOnLine1Line2) { // If search selection on line1line2 is allowed
                const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
                idToSeparatorMap = bulkService.getIdSeparatorMap(jobMasterIdCustomizationMap, cloneBulkParams.pageObject.jobMasterIds[0])
            }
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS, {
                bulkTransactions,
                selectAll,
                isManualSelectionAllowed,
                searchSelectionOnLine1Line2,
                idToSeparatorMap,
                nextStatusList: currentStatus.nextStatusList ? currentStatus.nextStatusList : []
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(2801, error.message, 'danger', 1)
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS, {
                bulkTransactions: {}
            }))
        }
    }
}

/**
 * This action toggles all transactions ie SelectAll <-> SelectNone and changes ui accordingly
 * @param {*} allTransactions 
 * @param {*} selectAllNone 
 * @param {*} selectedItems 
 */
export function toggleAllItems(allTransactions, selectAllNone, selectedItems, pageObject, searchText) {
    return function (dispatch) {
        try {
            const bulkTransactions = JSON.parse(JSON.stringify(allTransactions))
            const cloneSelectedItems = JSON.parse(JSON.stringify(selectedItems))
            const clonePageObject = JSON.parse(JSON.stringify(pageObject))
            let enabledJobs = 0
            let bulkJobSimilarityConfig = bulkService.getBulkJobSimilarityConfig(clonePageObject)
            for (let index in bulkTransactions) {
                if (!bulkTransactions[index].disabled && (bulkJobSimilarityConfig || bulkService.performFilterBeforeSelectAll(bulkTransactions[index], searchText))) {
                    bulkTransactions[index].isChecked = selectAllNone == SELECT_ALL;
                    selectAllNone == SELECT_ALL ? cloneSelectedItems[bulkTransactions[index].id] = bulkService.getSelectedTransactionObject(bulkTransactions[index]) : delete cloneSelectedItems[bulkTransactions[index].id]
                    enabledJobs++
                }
                if (selectAllNone == SELECT_NONE) {
                    bulkTransactions[index].disabled = false
                }
            }
            let { displayText, selectAll } = bulkService.getDisplayTextAndSelectAll(bulkJobSimilarityConfig, cloneSelectedItems, enabledJobs, bulkTransactions, clonePageObject)
            dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                selectedItems: cloneSelectedItems, bulkTransactions, displayText, selectAll
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(2802, error.message, 'danger', 1)
        }
    }
}

/**
 * This action performs search on reference number,runsheet number, line1, line2, circleline1, circleline2.
 * If search found then toggles transaction else show error
 * @param {*} searchValue 
 * @param {*} bulkTransactions 
 * @param {*} searchSelectionOnLine1Line2 
 * @param {*} idToSeparatorMap 
 * @param {*} selectedItems 
 */
export function setSearchedItem(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, selectedItems, pageObject, checkAlertView) {
    return function (dispatch) {
        try {
            let cloneBulkTransactions = JSON.parse(JSON.stringify(bulkTransactions))
            let cloneSelectedItems = JSON.parse(JSON.stringify(selectedItems))
            let searchResultObject = bulkService.performSearch(searchValue, cloneBulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, cloneSelectedItems, pageObject)
            if (!searchResultObject.errorMessage && searchResultObject.errorMessage == '') { // If after search there is any error
                if (!checkAlertView && !_.isEmpty(searchResultObject.isTransactionSelected)) {
                    dispatch(setState(SET_BULK_PARAMS_FOR_SELECTED_DATA, { cloneSelectedItems, cloneBulkTransactions, displayText: searchResultObject.displayText, selectAll: searchResultObject.selectAll, referenceNumber: searchResultObject.isTransactionSelected }))
                } else {
                    dispatch(setState(SET_BULK_TRANSACTION_PARAMETERS, {
                        selectedItems: cloneSelectedItems,
                        bulkTransactions: cloneBulkTransactions,
                        displayText: searchResultObject.displayText,
                        searchText: '',
                        selectAll: searchResultObject.selectAll
                    }))
                }
            } else {
                dispatch(setState(SET_BULK_ERROR_MESSAGE, searchResultObject.errorMessage))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2803, error.message, 'danger', 1)
        }
    }
}

/**
 * This action toggles the selected transaction list
 * @param {*} jobTransactionList 
 * @param {*} allTransactions 
 * @param {*} selectedItems 
 */
export function toggleMultipleTransactions(jobTransactionList, allTransactions, selectedItems, pageObject, checkAlertView) {
    return function (dispatch) {
        try {
            let bulkTransactions = JSON.parse(JSON.stringify(allTransactions))
            let cloneSelectedItems = JSON.parse(JSON.stringify(selectedItems))
            let clonePageObject = JSON.parse(JSON.stringify(pageObject))
            let bulkJobSimilarityConfig = bulkService.getBulkJobSimilarityConfig(clonePageObject)
            let numberOfEnabledItems = 0, isTransactionSelected = false
            for (let jobTransaction of jobTransactionList) {
                isTransactionSelected = bulkTransactions[jobTransaction.id].isChecked
                if (bulkJobSimilarityConfig) {
                    numberOfEnabledItems = bulkService.setEnabledTransactions(bulkTransactions, jobTransaction, bulkJobSimilarityConfig, selectedItems)
                }
                if (!bulkTransactions[jobTransaction.id].disabled) {
                    bulkTransactions[jobTransaction.id].isChecked = !bulkTransactions[jobTransaction.id].isChecked
                    bulkTransactions[jobTransaction.id].isChecked ? cloneSelectedItems[jobTransaction.id] = bulkService.getSelectedTransactionObject(bulkTransactions[jobTransaction.id]) : delete cloneSelectedItems[jobTransaction.id]
                }
            }
            let { displayText, selectAll } = bulkService.getDisplayTextAndSelectAll(bulkJobSimilarityConfig, cloneSelectedItems, numberOfEnabledItems, bulkTransactions, clonePageObject)
            if (!checkAlertView && isTransactionSelected) {
                dispatch(setState(SET_BULK_PARAMS_FOR_SELECTED_DATA, { cloneSelectedItems, cloneBulkTransactions: bulkTransactions, displayText, selectAll, referenceNumber: jobTransactionList[0].referenceNumber }))
            } else {
                dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                    selectedItems: cloneSelectedItems,
                    bulkTransactions,
                    displayText,
                    selectAll
                }))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(2804, error.message, 'danger', 1)
        }
    }
}