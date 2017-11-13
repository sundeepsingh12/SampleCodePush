'use strict'
import {
    START_FETCHING_BULK_CONFIG,
    STOP_FETCHING_BULK_CONFIG,
    JOB_MASTER,
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS
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
            const jobStatusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobMasterVsStatusList = await bulkService.prepareJobMasterVsStatusList(jobMasterList.value, jobStatusList.value)
            dispatch(setState(STOP_FETCHING_BULK_CONFIG, {
                jobMasterVsStatusList
            }))
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
            dispatch(setState(STOP_FETCHING_BULK_TRANSACTIONS, {
                bulkTransactions
            }))
        } catch (error) {
            console.log(error)
        }
    }
}