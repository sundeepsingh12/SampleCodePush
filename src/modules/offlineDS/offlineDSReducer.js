'use strict'

const InitialState = require('./offlineDSInitialState').default
import {
    SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR,
    UPDATE_PROGRESS_BAR,
    SET_DOWNLOADING_STATUS,
    SET_OFFLINEDS_INITIAL_STATE,
    SET_LAST_SYNC_TIME
} from '../../lib/constants'
const initialState = new InitialState()

export default function offlineDSReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR:
            return state.set('progressBarStatus', action.payload.progressBarStatus)
                .set('fileName', action.payload.fileName)

        case UPDATE_PROGRESS_BAR:
            return state.set('progressBarStatus', action.payload)

        case SET_DOWNLOADING_STATUS:
            return state.set('progressBarStatus', action.payload.progressBarStatus)
                .set('downLoadingStatus', action.payload.downLoadingStatus)

        case SET_OFFLINEDS_INITIAL_STATE:
            return initialState

        case SET_LAST_SYNC_TIME:
            return state.set('lastSyncTime', action.payload)

    }
    return state
}
