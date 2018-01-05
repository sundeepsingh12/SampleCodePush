'use strict'

const InitialState = require('./sequenceInitialState').default

const initialState = new InitialState()
import {
    SEQUENCE_LIST_FETCHING_STOP,
    SEQUENCE_LIST_FETCHING_START,
    TOGGLE_RESEQUENCE_BUTTON,
    RESET_STATE,
    PREPARE_UPDATE_LIST,
    CLEAR_SEQUENCE_STATE,
    SET_RUNSHEET_NUMBER_LIST,
    SET_RESPONSE_MESSAGE
} from '../../lib/constants'


export default function sequenceReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case SEQUENCE_LIST_FETCHING_START:
            return state.set('isSequenceScreenLoading',true)

        case SEQUENCE_LIST_FETCHING_STOP :
            return state.set('sequenceList',action.payload.sequenceList)
                        .set('isSequenceScreenLoading',false)

        case PREPARE_UPDATE_LIST:
            return state.set('sequenceList',action.payload.updatedSequenceList)
                        .set('isSequenceScreenLoading',false)
                        .set('unallocatedTransactionCount',action.payload.unallocatedTransactionCount)
                        .set('responseMessage',action.payload.responseMessage)
        
        case RESET_STATE:
        case CLEAR_SEQUENCE_STATE:
            return initialState  
        
        case SET_RUNSHEET_NUMBER_LIST:
            return state.set('runsheetNumberList', action.payload)
                .set('isSequenceScreenLoading', false)

        case SET_RESPONSE_MESSAGE:
            return state.set('responseMessage', action.payload)
                .set('isSequenceScreenLoading', false)        

    }
    return state
}