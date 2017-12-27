'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { setState } from '../global/globalActions'
import {
    SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR,
    LAST_DATASTORE_SYNC_TIME,
    UPDATE_PROGRESS_BAR,
    SET_DOWNLOADING_STATUS,
    SET_LAST_SYNC_TIME
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import moment from 'moment'
import {
    LAST_SYNCED,
    NEVER_SYNCED
} from '../../lib/AttributeConstants'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

export function getLastSyncTime() {
    return async function (dispatch) {
        try {
            const lastSyncTime = await keyValueDBService.getValueFromStore(LAST_DATASTORE_SYNC_TIME)
            if (lastSyncTime && lastSyncTime.value) {
                let timeDifference = LAST_SYNCED + dataStoreService.getLastSyncTimeInFormat(lastSyncTime.value)
                dispatch(setState(SET_LAST_SYNC_TIME, timeDifference))
            } else {
                dispatch(setState(SET_LAST_SYNC_TIME, NEVER_SYNCED))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function syncDataStore() {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_DOWNLOADING_STATUS, { downLoadingStatus: 1, progressBarStatus: 0 }))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let dataStoreIdVSTitleMap = await dataStoreService.syncDataStore(token)
            let lastSyncTime = await keyValueDBService.getValueFromStore(LAST_DATASTORE_SYNC_TIME)
            lastSyncTime = (lastSyncTime && lastSyncTime.value) ? lastSyncTime.value : null
            for (let datastoreMasterId in dataStoreIdVSTitleMap) {
                dispatch(setState(SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR, { fileName: dataStoreIdVSTitleMap[datastoreMasterId], progressBarStatus: 0 }))
                let currentPageNumber = 0, elements = 0, fetchResults
                do {
                    fetchResults = await dataStoreService.fetchDatastoreAndSaveInDB(token, datastoreMasterId, currentPageNumber, null)
                    elements += fetchResults.numberOfElements
                    currentPageNumber++
                    await dispatch(setState(UPDATE_PROGRESS_BAR, parseInt((elements / fetchResults.totalElements) * 100)))
                }
                while (elements < fetchResults.totalElements)
            }
            await keyValueDBService.validateAndSaveData(LAST_DATASTORE_SYNC_TIME, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            dispatch(setState(SET_DOWNLOADING_STATUS, { downLoadingStatus: 2, progressBarStatus: 0, }))
        } catch (error) {
            dispatch(setState(SET_DOWNLOADING_STATUS, { downLoadingStatus: 3, progressBarStatus: 0, }))
        }
    }
}