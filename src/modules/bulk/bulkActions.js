'use strict'
import {
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_ALL_JOB_TRANSACTIONS,
    CUSTOMIZATION_LIST_MAP,
    SET_BULK_ERROR_MESSAGE,
    SET_BULK_TRANSACTION_PARAMETERS,
    SET_BULK_PARAMS_FOR_SELECTED_DATA,
    JOB_LISTING_END,
    START_BULK_LOADER,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM,
    JOB_MASTER
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
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'

/**
 * This action sets job transaction,manual selection,selectAll and search on line1 or lin2 parameters
 * @param {*} bulkParams 
 */
export function getBulkJobTransactions(bulkParams, jobTransactionList, updatedTransactionListIds) {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_BULK_TRANSACTIONS));
            let cloneBulkParams = JSON.parse(JSON.stringify(bulkParams))
            let jobTransactionCustomizationList = JSON.parse(JSON.stringify(jobTransactionList))
            cloneBulkParams.pageObject.additionalParams = JSON.parse(cloneBulkParams.pageObject.additionalParams)
            cloneBulkParams.pageObject.jobMasterIds = JSON.parse(cloneBulkParams.pageObject.jobMasterIds)
            if (_.isEmpty(jobTransactionCustomizationList) || !_.isEmpty(updatedTransactionListIds) && !_.isEmpty(updatedTransactionListIds[cloneBulkParams.pageObject.jobMasterIds[0]]) && bulkService.checkForJobMasterIdsOfUpdatedJobs(updatedTransactionListIds[cloneBulkParams.pageObject.jobMasterIds[0]], cloneBulkParams.pageObject.additionalParams.statusId, jobTransactionCustomizationList[cloneBulkParams.pageObject.jobMasterIds[0]])) {
                let jobIdList = !_.isEmpty(jobTransactionCustomizationList) ? Object.values(updatedTransactionListIds) : null
                jobTransactionCustomizationList = await transactionCustomizationService.fetchUpdatedTransactionList(jobIdList, jobTransactionCustomizationList);
                dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList }));
            }
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobMaster = jobMasterList ? jobMasterList.value.filter(jobmaster => jobmaster.id == cloneBulkParams.pageObject.jobMasterIds[0])[0] : null
            const groupId = jobMaster.enableMultipartAssignment && cloneBulkParams.pageObject.groupId ? cloneBulkParams.pageObject.groupId : null
            const bulkTransactionMap =  _.pickBy(jobTransactionCustomizationList[cloneBulkParams.pageObject.jobMasterIds[0]], function(value, key) {
                return (value.statusId == cloneBulkParams.pageObject.additionalParams.statusId && value.groupId == groupId && value.jobId > 0)
            })
            const statusListArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const currentStatus = jobStatusService.getJobStatusForJobStatusId(statusListArray && statusListArray.value ? statusListArray.value : null, cloneBulkParams.pageObject.additionalParams.statusId)
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
                bulkTransactionMap,
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

export function getBulkUpdatedJobTransactions(updatedTransactionListIds, jobTransactionCustomizationList, pageObject) {
    return async function (dispatch) {
        try {
            dispatch(setState(START_BULK_LOADER))
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobMaster = jobMasterList ? jobMasterList.value.filter(jobmaster => jobmaster.id == pageObject.jobMasterIds[0])[0] : null
            const groupId = jobMaster.enableMultipartAssignment && pageObject.groupId ? pageObject.groupId : null
            jobTransactionCustomizationList = await transactionCustomizationService.fetchUpdatedTransactionList(Object.values(updatedTransactionListIds), jobTransactionCustomizationList);
            dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList }));
            const bulkTransactionMap =  _.pickBy(jobTransactionCustomizationList[pageObject.jobMasterIds[0]], function(value, key) {
                return value.statusId == pageObject.additionalParams.statusId && value.groupId == groupId && value.jobId > 0 
            })
            dispatch(setState(TOGGLE_JOB_TRANSACTION_LIST_ITEM, bulkTransactionMap))
        } catch (error) {
            showToastAndAddUserExceptionLog(2805, error.message, 'danger', 1)
        }
}
}

/**
 * This action toggles all transactions ie SelectAll <-> SelectNone and changes ui accordingly
 * @param {*} allTransactions 
 * @param {*} selectAllNone 
 * @param {*} selectedItems 
 */
export function toggleAllItems(selectedItems, selectAllNone, pageObject, searchText, bulkTransactionLength) {
    return function (dispatch) {
        try {
            const cloneSelectedItems = JSON.parse(JSON.stringify(selectedItems))
            let clonePageObject = JSON.parse(JSON.stringify(pageObject))
            let enabledJobs = 0
            let bulkJobSimilarityConfig = bulkService.getBulkJobSimilarityConfig(clonePageObject)
            for (let index in cloneSelectedItems) {
                if (!cloneSelectedItems[index].disabled && (bulkJobSimilarityConfig || bulkService.performFilterBeforeSelectAll(cloneSelectedItems[index], searchText))) {
                    cloneSelectedItems[index].isChecked = selectAllNone == SELECT_ALL;
                    enabledJobs++
                }
                if (selectAllNone == SELECT_NONE) {
                    enabledJobs = 0
                    cloneSelectedItems[index].disabled = false
                }
            }
            let { displayText, selectAll } = bulkService.getDisplayTextAndSelectAll(bulkJobSimilarityConfig, enabledJobs, enabledJobs, bulkTransactionLength, clonePageObject)
            dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, { selectedItems: cloneSelectedItems, displayText, selectAll }))
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
export function setSearchedItem(searchValue, selectedItems, searchSelectionOnLine1Line2, idToSeparatorMap, selectedTransactionLength, pageObject, checkAlertView) {
    return function (dispatch) {
        try {
            let cloneSelectedItems = JSON.parse(JSON.stringify(selectedItems))
            let searchResultObject = bulkService.performSearch(searchValue, cloneSelectedItems, searchSelectionOnLine1Line2, idToSeparatorMap, selectedTransactionLength, pageObject)
            if (!searchResultObject.errorMessage && searchResultObject.errorMessage == '') { // If after search there is any error
                if (!checkAlertView && !_.isEmpty(searchResultObject.isTransactionSelected)) {
                    dispatch(setState(SET_BULK_PARAMS_FOR_SELECTED_DATA, { cloneSelectedItems, displayText: searchResultObject.displayText, selectAll: searchResultObject.selectAll, referenceNumber: searchResultObject.isTransactionSelected }))
                } else {
                    dispatch(setState(SET_BULK_TRANSACTION_PARAMETERS, {
                        selectedItems: cloneSelectedItems,
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
export function toggleMultipleTransactions(jobTransactionList, selectedItems, selectedTransactionLength, pageObject, checkAlertView, bulkTransactionLength) {
    return function (dispatch) {
        try {
            let cloneSelectedItems = (selectedItems) ?  JSON.parse(JSON.stringify(selectedItems)) : null
            let clonePageObject = JSON.parse(JSON.stringify(pageObject))
            let bulkJobSimilarityConfig = bulkService.getBulkJobSimilarityConfig(clonePageObject)
            let numberOfEnabledItems = 0
            for (let jobTransaction of jobTransactionList) {
                if (bulkJobSimilarityConfig) {
                    numberOfEnabledItems = bulkService.setEnabledTransactions(cloneSelectedItems, jobTransaction, bulkJobSimilarityConfig, selectedTransactionLength)
                }
                if (!cloneSelectedItems[jobTransaction.jobId].disabled) {
                    cloneSelectedItems[jobTransaction.jobId].isChecked = !cloneSelectedItems[jobTransaction.jobId].isChecked
                    selectedTransactionLength = cloneSelectedItems[jobTransaction.jobId].isChecked ? selectedTransactionLength + 1 : selectedTransactionLength - 1 
                }
            }
            let { displayText, selectAll } = bulkService.getDisplayTextAndSelectAll(bulkJobSimilarityConfig, selectedTransactionLength, numberOfEnabledItems, bulkTransactionLength, clonePageObject)
                dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                    selectedItems: cloneSelectedItems,
                    displayText,
                    selectAll
                }))
        } catch (error) {
            showToastAndAddUserExceptionLog(2804, error.message, 'danger', 1)
        }
    }
}