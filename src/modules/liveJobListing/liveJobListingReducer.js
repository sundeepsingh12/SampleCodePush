'use strict'
import {
    SET_LIVE_JOB_LIST,
    TOGGLE_LIVE_JOB_LIST_ITEM,
    START_FETCHING_LIVE_JOB,
    SET_SEARCH
} from '../../lib/constants'
import InitialState from './liveJobListingInitialState.js'

const initialState = new InitialState()

export default function liveJobReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LIVE_JOB_LIST:
            return state.set('liveJobList', action.payload)
                .set('selectedItems', [])
                .set('loaderRunning', false)
        case TOGGLE_LIVE_JOB_LIST_ITEM:
            return state.set('liveJobList', action.payload.jobTransactions)
                .set('selectedItems', action.payload.selectedItems)
        case START_FETCHING_LIVE_JOB:
            return state.set('loaderRunning', action.payload)
        case SET_SEARCH:
            return state.set('searchText', action.payload)
    }
    return state
}