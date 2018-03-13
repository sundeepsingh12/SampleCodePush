'use strict'
import {
    JOB_MASTER,
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM,
    TOGGLE_ALL_JOB_TRANSACTIONS,
    CUSTOMIZATION_APP_MODULE,
    SET_BULK_SEARCH_TEXT,
    CUSTOMIZATION_LIST_MAP,
    SET_BULK_ERROR_MESSAGE,
    SET_BULK_TRANSACTION_PARAMETERS,
    BulkListing
} from '../../lib/constants'
import {
    setState,
    navigateToScene
} from '../global/globalActions'
import {
    BULK_ID
} from '../../lib/AttributeConstants'
import {
    SELECT_ALL,
    SELECT_NONE,
    COULD_NOT_SEARCH
} from '../../lib/ContainerConstants'
import _ from 'lodash'
import { jobStatusService } from '../../services/classes/JobStatus';
import { moduleCustomizationService } from '../../services/classes/ModuleCustomization'
import { bulkService } from '../../services/classes/Bulk'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'

/**
 * This action sets job transaction,manual selection,selectAll and search on line1 or lin2 parameters
 * @param {*} bulkParams 
 */
export function getBulkJobTransactions(bulkParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_BULK_TRANSACTIONS))
            const bulkTransactions = await bulkService.getJobListingForBulk(bulkParams)
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const currentStatus = jobStatusService.getJobStatusForJobStatusId(statusList ? statusList.value : null, bulkParams.pageObject.additionalParams.statusId)
            const modulesCustomizationList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            let selectAll = bulkParams.pageObject.additionalParams.selectAll ? true : false
            let isManualSelectionAllowed = bulkParams.pageObject.manualSelection ? true : false
            let searchSelectionOnLine1Line2 = bulkParams.pageObject.additionalParams.searchSelectionOnLine1Line2 ? true : false
            let idToSeparatorMap
            if (searchSelectionOnLine1Line2) { // If search selection on line1line2 is allowed
                const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
                idToSeparatorMap = bulkService.getIdSeparatorMap(jobMasterIdCustomizationMap, bulkParams.pageObject.jobMasterIds[0])
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
            console.log(error)
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
export function toggleAllItems(allTransactions, selectAllNone, selectedItems) {
    return async function (dispatch) {
        try {
            const bulkTransactions = _.cloneDeep(allTransactions)
            const cloneSelectedItems = _.cloneDeep(selectedItems)
            let displayText = '';
            for (let index in bulkTransactions) {
                bulkTransactions[index].isChecked = selectAllNone == SELECT_ALL;
                selectAllNone == SELECT_ALL ? cloneSelectedItems[bulkTransactions[index].id] = bulkService.getSelectedTransactionObject(bulkTransactions[index]) : delete cloneSelectedItems[bulkTransactions[index].id]
            }
            displayText = _.size(cloneSelectedItems) == _.size(allTransactions) ? SELECT_NONE : SELECT_ALL
            dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                selectedItems: cloneSelectedItems,
                bulkTransactions,
                displayText
            }))
        } catch (error) {
            //Update UI here 
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
export function setSearchedItem(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, selectedItems) {
    return function (dispatch) {
        try {
            let cloneBulkTransactions = _.cloneDeep(bulkTransactions)
            let cloneSelectedItems = _.cloneDeep(selectedItems)
            let searchResultObject = bulkService.performSearch(searchValue, cloneBulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, cloneSelectedItems)
            if (!searchResultObject.errorMessage && searchResultObject.errorMessage == '') { // If after search there is any error
                let displayText = (_.size(cloneSelectedItems) == _.size(cloneBulkTransactions)) ? SELECT_NONE : SELECT_ALL
                dispatch(setState(SET_BULK_TRANSACTION_PARAMETERS, {
                    selectedItems: cloneSelectedItems,
                    bulkTransactions: cloneBulkTransactions,
                    displayText,
                    searchText: ''
                }))
            } else {
                dispatch(setState(SET_BULK_ERROR_MESSAGE, searchResultObject.errorMessage))
            }
        } catch (error) {
            console.log(error)
            //Update UI here if needed
        }
    }
}

/**
 * This action toggles the selected transaction list
 * @param {*} jobTransactionList 
 * @param {*} allTransactions 
 * @param {*} selectedItems 
 */
export function toggleMultipleTransactions(jobTransactionList, allTransactions, selectedItems) {
    return function (dispatch) {
        try {
            let bulkTransactions = _.cloneDeep(allTransactions)
            let cloneSelectedItems = _.cloneDeep(selectedItems)
            for (let jobTransaction of jobTransactionList) {
                bulkTransactions[jobTransaction.id].isChecked = !bulkTransactions[jobTransaction.id].isChecked
                bulkTransactions[jobTransaction.id].isChecked ? cloneSelectedItems[jobTransaction.id] = bulkService.getSelectedTransactionObject(bulkTransactions[jobTransaction.id]) : delete cloneSelectedItems[jobTransaction.id]
            }
            let displayText = _.size(cloneSelectedItems) == _.size(bulkTransactions) ? SELECT_NONE : SELECT_ALL
            console.log('displayText', displayText)
            dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                selectedItems: cloneSelectedItems,
                bulkTransactions,
                displayText
            }))
        } catch (error) {
            console.log(error)
        }
    }
}