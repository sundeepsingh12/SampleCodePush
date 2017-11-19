'use strict'

const InitialState = require('./sequenceInitialState').default

const initialState = new InitialState()
import {
    SEQUENCE_LIST_FETCHING_STOP,
    SEQUENCE_LIST_FETCHING_START,
    TOGGLE_RESEQUENCE_BUTTON,
    RESET_STATE
} from '../../lib/constants'


export default function sequenceReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case SEQUENCE_LIST_FETCHING_START:
            return state.set('isSequenceScreenLoading',true)

        case SEQUENCE_LIST_FETCHING_STOP :
            return state.set('sequenceList',action.payload.sequenceList)
                        .set('isSequenceScreenLoading',false)
                        .set('unallocatedTransactionCount',action.payload.unallocatedTransactionCount)
        case RESET_STATE:
            return initialState                

    }
    return state
}