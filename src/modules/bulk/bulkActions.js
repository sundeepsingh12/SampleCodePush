'use strict'
import {
    START_FETCHING_BULK_CONFIG,
    STOP_FETCHING_BULK_CONFIG,
    JOB_MASTER,
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM,
    TOGGLE_ALL_JOB_TRANSACTIONS,
    CUSTOMIZATION_APP_MODULE,
    SET_BULK_SEARCH_TEXT,
    CUSTOMIZATION_LIST_MAP,
    SET_BULK_ERROR_MESSAGE
} from '../../lib/constants'
import {
    setState
} from '../global/globalActions'
import {
    bulkService
} from '../../services/classes/Bulk'
import {
    keyValueDBService
} from '../../services/classes/KeyValueDBService'
import {
    BULK_ID
} from '../../lib/AttributeConstants'
import {
    moduleCustomizationService
} from '../../services/classes/ModuleCustomization'
import _ from 'lodash'


export function getJobMasterVsStatusNameList() {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_BULK_CONFIG))
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            if (!jobMasterList || !jobMasterList.value) {
                throw new Error('Job master missing')
            }
            const jobStatusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            if (!jobStatusList || !jobStatusList.value) {
                throw new Error('Job status missing')
            }
            const modulesCustomizationList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            if (!modulesCustomizationList || !modulesCustomizationList.value) {
                throw new Error('Module customization missing')
            }
            const jobMasterVsStatusList = await bulkService.prepareJobMasterVsStatusList(jobMasterList.value, jobStatusList.value, modulesCustomizationList.value)
            dispatch(setState(STOP_FETCHING_BULK_CONFIG, jobMasterVsStatusList))
        } catch (error) {
            dispatch(setState(STOP_FETCHING_BULK_CONFIG, []))
        }
    }
}


export function getBulkJobTransactions(bulkParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_BULK_TRANSACTIONS))
            const bulkTransactions = await bulkService.getJobListingForBulk(bulkParams)
            const modulesCustomizationList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
            const bulkModule = await moduleCustomizationService.getModuleCustomizationForAppModuleId(modulesCustomizationList.value, BULK_ID)
            const bulkModuleRemark = (bulkModule && bulkModule[0])?JSON.parse(bulkModule[0].remark):null
            let selectAll = false,jobMasterManualSelectionConfiguration=null,isManualSelectionAllowed=false,searchSelectionOnLine1Line2 = false
            if(bulkModuleRemark){
                selectAll = bulkModuleRemark.selectAll
                 jobMasterManualSelectionConfiguration =  bulkModuleRemark.jobMasterManualSelectionConfiguration
                 isManualSelectionAllowed = (!jobMasterManualSelectionConfiguration)?false:bulkService.getManualSelection(jobMasterManualSelectionConfiguration, bulkParams.jobMasterId)
                 searchSelectionOnLine1Line2 =  bulkModuleRemark.searchSelectionOnLine1Line2 
                }
           
            let idToSeparatorMap
            if (searchSelectionOnLine1Line2) {
                const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
                idToSeparatorMap = bulkService.getIdSeparatorMap(jobMasterIdCustomizationMap, bulkParams.jobMasterId)
            }
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS, {
                bulkTransactions,
                selectAll,
                isManualSelectionAllowed,
                searchSelectionOnLine1Line2,
                idToSeparatorMap
            }))
        } catch (error) {
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS,{
                bulkTransactions:{}
            }))
        }
    }
}

export function toggleListItemIsChecked(jobTransactionId, allTransactions) {
    return async function (dispatch) {
        try {
            const bulkTransactions = await JSON.parse(JSON.stringify(allTransactions))
            bulkTransactions[jobTransactionId].isChecked = !bulkTransactions[jobTransactionId].isChecked
            const selectedItems = await bulkService.getSelectedTransactionIds(bulkTransactions)
            let displayText = (selectedItems.length == _.size(allTransactions)) ? 'Select None' : 'Select All'
            dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                selectedItems,
                bulkTransactions,
                displayText
            }))
        } catch (error) {
            //Update UI here
        }
    }
}

export function toggleAllItems(allTransactions, selectAllNone) {
    return async function (dispatch) {
        try {
            const bulkTransactions = await JSON.parse(JSON.stringify(allTransactions))
            let selectedItems, displayText = ''
            if (selectAllNone == 'Select All') {
                Object.values(bulkTransactions).forEach(bulkTransaction => bulkTransaction.isChecked = true)
                selectedItems = await bulkService.getSelectedTransaction(bulkTransactions)
                displayText = 'Select None'
            } else {
                Object.values(bulkTransactions).forEach(bulkTransaction => bulkTransaction.isChecked = false)
                selectedItems = []
                displayText = 'Select All'
            }

            dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                selectedItems,
                bulkTransactions,
                displayText
            }))
        } catch (error) {
            //Update UI here 
        }
    }
}
export function setSearchedItem(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap) {
    return async function (dispatch) {
        try {
            let searchResultObject = bulkService.performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap)
            if (!searchResultObject) {
                throw new Error('Could not search')
            }
            if (!searchResultObject.errorMessage && searchResultObject.errorMessage == '') {
                if (searchResultObject.jobTransactionArray && searchResultObject.jobTransactionArray.length == 1) {
                    dispatch(toggleListItemIsChecked(searchResultObject.jobTransactionArray[0].id, bulkTransactions))
                    dispatch(setState(SET_BULK_SEARCH_TEXT, ''))
                } else if (searchResultObject.jobTransactionArray && searchResultObject.jobTransactionArray.length > 1) {
                    dispatch(toggleMultipleTransactions(searchResultObject.jobTransactionArray, bulkTransactions))
                    dispatch(setState(SET_BULK_SEARCH_TEXT, ''))
                }
            } else {
                dispatch(setState(SET_BULK_ERROR_MESSAGE, searchResultObject.errorMessage))
            }
        } catch (error) {
            //Update UI here if needed
        }
    }
}
export function toggleMultipleTransactions(jobTransactionList, allTransactions) {
    return async function (dispatch) {
        try {
            const bulkTransactions = await JSON.parse(JSON.stringify(allTransactions))
            for (let jobTransaction of jobTransactionList) {
                bulkTransactions[jobTransaction.id].isChecked = !bulkTransactions[jobTransaction.id].isChecked
            }
            const selectedItems = await bulkService.getSelectedTransactionIds(bulkTransactions)
            let displayText = (selectedItems.length == _.size(allTransactions)) ? 'Select None' : 'Select All'
            dispatch(setState(TOGGLE_ALL_JOB_TRANSACTIONS, {
                selectedItems,
                bulkTransactions,
                displayText
            }))
        } catch (error) {
            console.log(error)
        }
    }
}