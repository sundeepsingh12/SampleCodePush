'use strict'
import {
    END_LIVEJOB_DETAILD_FETCHING,
    SET_MESSAGE,
    RESET_STATE,
    SET_LIVE_JOB_LOADER
} from '../../lib/constants'
import InitialState from './liveJobInitialState.js'

const initialState = new InitialState()

export default function liveJobReducer(state = initialState, action) {
    switch (action.type) {
        case END_LIVEJOB_DETAILD_FETCHING:
            return state.set('jobDataList', action.payload.jobDataList)
                .set('jobTransaction', action.payload.jobTransaction)
                .set('currentStatus', action.payload.currentStatus)
                .set('toastMessage', '')
                .set('isLoading', false)

        case SET_MESSAGE:
            return state.set('toastMessage', action.payload)
                        .set('isLoading', false)

        case SET_LIVE_JOB_LOADER:
            return state.set('isLoading', action.payload)
        case RESET_STATE:
            return initialState

    }
    return state
}

