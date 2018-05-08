'use strict'

import { jobTransactionService } from '../../services/classes/JobTransaction'
import { NavigationActions } from 'react-navigation'
import { setState, navigateToScene, showToastAndAddUserExceptionLog } from '..//global/globalActions'
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
    START_FETCHING_LIVE_JOB,
    SET_SEARCH,
    TabScreen,
    SET_MESSAGE,
    SET_LIVE_JOB_TOAST,
    HomeTabNavigatorScreen,
    SET_LIVE_JOB_LOADER
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import _ from 'lodash'

export function getJobDetails(jobTransactionId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_MESSAGE, ''))
            dispatch(setState(SET_LIVE_JOB_LOADER, true))
            const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
            const fieldAttributeMasterList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
            const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS)
            const details = await jobTransactionService.prepareParticularStatusTransactionDetails(jobTransactionId, jobAttributeMasterList.value, jobAttributeStatusList.value, fieldAttributeMasterList.value, fieldAttributeStatusList.value, null, null, statusList.value, 'LiveJob')
            dispatch(endFetchingJobDetails(details.jobDataObject.dataList, details.currentStatus, details.jobTransactionDisplay))
        } catch (error) {
            showToastAndAddUserExceptionLog(1201, error.message, 'danger', 1)
            dispatch(setState(SET_LIVE_JOB_LOADER, false))
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
            let serverResponse = await liveJobService.requestServerForApproval(status + '', token, job, liveJobList)
            if (serverResponse.toastMessage && serverResponse.toastMessage != '') {
                dispatch(setState(SET_MESSAGE, serverResponse.toastMessage))
            }
            if (status == 1) {
                dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: HomeTabNavigatorScreen })
                    ]
                }))
            } else if (status == 2 && _.isEmpty(serverResponse.newLiveJobList)) {
                dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }),
                    ]
                }))
            } else {
                dispatch(NavigationActions.reset({
                    index: 1,
                    actions: [
                        NavigationActions.navigate({ routeName: HomeTabNavigatorScreen }),
                        NavigationActions.navigate({ routeName: 'LiveJobs' })
                    ]
                }))
            }

        } catch (error) {
            showToastAndAddUserExceptionLog(1202, error.message, 'danger', 1)
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
            showToastAndAddUserExceptionLog(1203, error.message, 'danger', 1)
            dispatch(setState(START_FETCHING_LIVE_JOB, false))
        }
    }
}
export function toggleLiveJobSelection(jobId, allJobs) {
    return async function (dispatch) {
        try {
            const jobTransactions = await JSON.parse(JSON.stringify(allJobs))
            if (!jobTransactions[jobId]) {
                throw new Error('customisation not present')
            }
            jobTransactions[jobId].isChecked = !jobTransactions[jobId].isChecked
            const selectedItems = await liveJobService.getSelectedJobIds(jobTransactions)
            dispatch(setState(TOGGLE_LIVE_JOB_LIST_ITEM, {
                selectedItems,
                jobTransactions
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1204, error.message, 'danger', 1)
        }
    }
}
export function acceptOrRejectMultiple(status, selectedItems, liveJobList) {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let serverResponseForLive = await liveJobService.requestServerForApprovalForMultiple(status + '', selectedItems, liveJobList, token)
            dispatch(setState(SET_LIVE_JOB_LIST, serverResponseForLive.newLiveJobList))
            dispatch(setState(SET_LIVE_JOB_TOAST, serverResponseForLive.toastMessage))
            if (status == 1) {
                dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'HomeTabNavigatorScreen' }),
                    ]
                }))
            } else if (status == 2 && _.isEmpty(serverResponseForLive.newLiveJobList)) {
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
            showToastAndAddUserExceptionLog(1205, error.message, 'danger', 1)
        }
    }
}
export function deleteExpiredJob(jobId, liveJobList) {
    return async function (dispatch) {
        try {
            let newLiveJobList = await liveJobService.deleteJob([jobId], liveJobList)
            dispatch(setState(SET_LIVE_JOB_LIST, newLiveJobList))
        } catch (error) {
            showToastAndAddUserExceptionLog(1206, error.message, 'danger', 1)
        }
    }
}
export function selectNone(liveJobList) {
    return async function (dispatch) {
        try {
            const allJobs = await JSON.parse(JSON.stringify(liveJobList))
            Object.values(allJobs).forEach(job => job.isChecked = false)
            dispatch(setState(TOGGLE_LIVE_JOB_LIST_ITEM, {
                selectedItems: [],
                jobTransactions: allJobs
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1207, error.message, 'danger', 1)
        }
    }
}
export function selectAll(liveJobList) {
    return async function (dispatch) {
        try {
            const allJobs = await JSON.parse(JSON.stringify(liveJobList))
            Object.values(allJobs).forEach(job => job.isChecked = true)
            let selectedItems = Object.keys(allJobs)
            dispatch(setState(TOGGLE_LIVE_JOB_LIST_ITEM, {
                selectedItems,
                jobTransactions: allJobs
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(1208, error.message, 'danger', 1)
        }
    }
}