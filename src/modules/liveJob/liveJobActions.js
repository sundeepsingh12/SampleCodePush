'use strict'

import { jobTransactionService } from '../../services/classes/JobTransaction'
import { NavigationActions } from 'react-navigation'
import { setState, navigateToScene } from '..//global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { liveJobService } from '../../services/classes/LiveJobService'
import * as realm from '../../repositories/realmdb'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_SUMMARY,
    JOB_MASTER,
    END_LIVEJOB_DETAILD_FETCHING,
    SET_LIVE_JOB_LIST,
    TOGGLE_LIVE_JOB_LIST_ITEM,
    START_FETCHING_LIVE_JOB
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import _ from 'lodash'

export function getJobDetails(jobTransactionId) {
    return async function (dispatch) {
        try {
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
            const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS)
            const details = await jobTransactionService.prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList.value, jobAttributeStatusList.value, fieldAttributeMasterList.value, fieldAttributeStatusList.value, null, null, statusList.value, 'LiveJob')
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.currentStatus, details.jobTransactionDisplay))
        } catch (error) {
            console.log(error)
        }
    }
}
export function endFetchingJobDetails(jobDataList, currentStatus, jobTransaction) {
    return {
        type: END_LIVEJOB_DETAILD_FETCHING,
        payload: {
            jobDataList,
            jobTransaction,
            currentStatus,
        }
    }
}
export function acceptOrRejectJob(status, job, liveJobList) {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let newLiveJobList = await liveJobService.requestServerForApproval(status + '', token, job, liveJobList)
            if (status == 1) {
                dispatch(NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'HomeTabNavigatorScreen' }),
                        NavigationActions.navigate({ routeName: 'TabScreen' })
                    ]
                }))
            } else if (status == 2 && _.isEmpty(newLiveJobList)) {
                dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'HomeTabNavigatorScreen' }),
                    ]
                }))
            } else {
                dispatch(NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: 'HomeTabNavigatorScreen' }),
                        NavigationActions.navigate({ routeName: 'LiveJobs' })
                    ]
                }))
            }

        } catch (error) {
            console.log(error)
        }
    }
}
export function fetchAllLiveJobsList() {
    return async function (dispatch) {
        try {
            dispatch(setState(START_FETCHING_LIVE_JOB, true))
            let liveJobList = await liveJobService.getLiveJobList()
            dispatch(setState(SET_LIVE_JOB_LIST, liveJobList))
        } catch (error) {
            console.log(error)
        }
    }
}
export function toggleLiveJobSelection(jobId, allJobs) {
    return async function (dispatch) {
        try {
            const jobTransactions = await JSON.parse(JSON.stringify(allJobs))
            jobTransactions[jobId].jobTransactionCustomization.isChecked = !jobTransactions[jobId].jobTransactionCustomization.isChecked
            const selectedItems = await liveJobService.getSelectedJobIds(jobTransactions)
            dispatch(setState(TOGGLE_LIVE_JOB_LIST_ITEM, {
                selectedItems,
                jobTransactions
            }))
        } catch (error) {
            console.log(error)
        }
    }
}
export function acceptOrRejectMultiple(status, selectedItems, liveJobList) {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let newLiveJobList = await liveJobService.requestServerForApprovalForMultiple(status + '', selectedItems, liveJobList, token)
            dispatch(setState(SET_LIVE_JOB_LIST, newLiveJobList))
        } catch (error) {

        }
    }
}
export function deleteExpiredJob(jobId, liveJobList) {
    return async function (dispatch) {
        try {
            let newLiveJobList = await liveJobService.deleteJob([jobId], liveJobList)
            dispatch(setState(SET_LIVE_JOB_LIST, newLiveJobList))
        } catch (error) {

        }
    }
}