'use strict'
import {
    SET_LIVE_JOB_LIST,
    TOGGLE_LIVE_JOB_LIST_ITEM,
    START_FETCHING_LIVE_JOB,
    SET_SEARCH,
    SET_LIVE_JOB_TOAST,
    RESET_STATE
} from '../../lib/constants'
import InitialState from './liveJobListingInitialState.js'

const initialState = new InitialState()

export default function liveJobReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LIVE_JOB_LIST:
            return state.set('liveJobList', action.payload)
                .set('selectedItems', [])
                .set('loaderRunning', false)
                .set('liveJobToastMessage', '')
                .set('searchText', '')
        case TOGGLE_LIVE_JOB_LIST_ITEM:
            return state.set('liveJobList', action.payload.jobTransactions)
                .set('selectedItems', action.payload.selectedItems)
                .set('liveJobToastMessage', '')
        case START_FETCHING_LIVE_JOB:
            return state.set('loaderRunning', action.payload)
                .set('liveJobToastMessage', '')
        case SET_SEARCH:
            return state.set('searchText', action.payload)
        case SET_LIVE_JOB_TOAST:
            return state.set('liveJobToastMessage', action.payload)
        case RESET_STATE:
            return initialState
    }
    return state
}