'use strict'

import InitialState from './jobMasterInitialState'

const initialState = new InitialState()
import {
    SET_JOB_MASTER_LIST
} from '../../lib/constants'


export default function jobMasterReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case SET_JOB_MASTER_LIST:
            return state.set('jobMasterList', action.payload.jobMasterList)
                .set('loading', action.payload.loading)
    }

    return state
}