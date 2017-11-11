'use strict'

const InitialState = require('./sequenceInitialState').default

const initialState = new InitialState()
import {
    SEQUENCE_LIST_FETCHING_STOP,
    SEQUENCE_LIST_FETCHING_START,
    TOGGLE_RESEQUENCE_BUTTON
} from '../../lib/constants'


export default function sequenceReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case SEQUENCE_LIST_FETCHING_START:
            return state.set('isSequenceScreenLoading',true)

        case SEQUENCE_LIST_FETCHING_STOP :
            return state.set('sequenceList',action.payload.sequenceList)
                        .set('isSequenceScreenLoading',false)

        case TOGGLE_RESEQUENCE_BUTTON:
            return state.set('isResequencingDisabled',action.payload.isResequencingDisabled)
                        .set('isSequenceScreenLoading',action.payload.isSequenceScreenLoading)


    }
    return state
}