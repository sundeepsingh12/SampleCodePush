'use strict'
import {
    START_FETCHING_BULK_CONFIG,
    STOP_FETCHING_BULK_CONFIG,
    JOB_MASTER,
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM
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


export function getJobMasterVsStatusNameList() {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_BULK_CONFIG))
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            if(!jobMasterList || !jobMasterList.value){
                throw new Error('Job master missing')
            }
            const jobStatusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            if(!jobStatusList || !jobStatusList.value){
                throw new Error('Job status missing')
            }
            const jobMasterVsStatusList = await bulkService.prepareJobMasterVsStatusList(jobMasterList.value, jobStatusList.value)
            dispatch(setState(STOP_FETCHING_BULK_CONFIG,jobMasterVsStatusList))
        } catch (error) {
            console.log(error)
        }
    }
}


export function getBulkJobTransactions(bulkParams) {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_BULK_TRANSACTIONS))
            const bulkTransactions = await bulkService.getJobListingForBulk(bulkParams)
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS,bulkTransactions))
        } catch (error) {
            console.log(error)
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS))
        }
    }
}

export function toggleListItemIsChecked(jobTransactionId,allTransactions){
        return async function(dispatch){
            try{
                const bulkTransactions = await JSON.parse(JSON.stringify(allTransactions))
                bulkTransactions[jobTransactionId].isChecked = !bulkTransactions[jobTransactionId].isChecked
                const selectedItems = await bulkService.getSelectedTransactionIds(bulkTransactions)
                console.log('selectedItems',selectedItems)
                dispatch(setState(TOGGLE_JOB_TRANSACTION_LIST_ITEM,{
                    selectedItems,
                    bulkTransactions
                }))
            }catch(error){
                console.log(error)
            }
        }
}