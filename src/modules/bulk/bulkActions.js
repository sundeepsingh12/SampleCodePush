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
    CUSTOMIZATION_APP_MODULE
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
            console.log(error)
              dispatch(setState(STOP_FETCHING_BULK_CONFIG,[]))
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
            const selectAll = (bulkModule[0].remark) ? JSON.parse(bulkModule[0].remark).selectAll : false
            console.log('selectAll', selectAll)
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS, {
                bulkTransactions,
                selectAll
            }))
        } catch (error) {
            console.log(error)
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS))
        }
    }
}

export function toggleListItemIsChecked(jobTransactionId, allTransactions) {
    return async function (dispatch) {
        try {
            const bulkTransactions = await JSON.parse(JSON.stringify(allTransactions))
            bulkTransactions[jobTransactionId].isChecked = !bulkTransactions[jobTransactionId].isChecked
            const selectedItems = await bulkService.getSelectedTransaction(bulkTransactions)
            // dispatch(setState(TOGGLE_JOB_TRANSACTION_LIST_ITEM, {
            //     selectedItems,
            //     bulkTransactions
            // }))
            let displayText = (selectedItems.length==_.size(allTransactions))?'Select None':'Select All'
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
            console.log(error)
        }
    }
}