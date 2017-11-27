'use strict'
import {
    SHOW_LIVE_JOB_LIST,
    SET_LIVE_JOB_LIST
} from '../../lib/constants'
import InitialState from './liveJobInitialState.js'

const initialState = new InitialState()

export default function liveJobReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_LIVE_JOB_LIST:
            return state.set('showLiveJobList', action.payload)
        case SET_LIVE_JOB_LIST:
            return state.set('liveJobList', action.payload)
    }
    return state
}