'use strict'

import InitialState from './postAssignmentInitialState'

const initialState = new InitialState()
import {
    SET_POST_ASSIGNMENT_TRANSACTION_LIST,
    SET_POST_ASSIGNMENT_ERROR,
    SET_POST_SCAN_SUCCESS,
} from '../../lib/constants'


export default function postAssignmentReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case SET_POST_ASSIGNMENT_TRANSACTION_LIST:
            return state.set('jobTransactionMap', action.payload.jobTransactionMap)
                .set('loading', action.payload.loading)
                .set('pendingCount', action.payload.pendingCount)
                .set('scanSuccess', false)
                .set('error', null)
                .set('scanError', action.payload.scanError)
                .set('jobMaster',action.payload.jobMaster)

        case SET_POST_ASSIGNMENT_ERROR:
            return state.set('error', action.payload.error)
                .set('loading', false)
                .set('scanSuccess', false)

        case SET_POST_SCAN_SUCCESS:
            return state.set('scanSuccess', action.payload.scanSuccess)
                .set('loading', false)
                .set('error', null)
                .set('scanError',action.payload.scanError)

    }

    return state
}