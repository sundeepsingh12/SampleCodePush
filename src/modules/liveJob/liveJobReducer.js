'use strict'
import {
    END_LIVEJOB_DETAILD_FETCHING,
    SET_MESSAGE
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

        case SET_MESSAGE:
            return state.set('toastMessage', action.payload)
    }
    return state
}

