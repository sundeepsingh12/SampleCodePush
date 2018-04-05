'use strict'

const InitialState = require('./sequenceInitialState').default

const initialState = new InitialState()
import {
    SEQUENCE_LIST_FETCHING_STOP,
    SEQUENCE_LIST_FETCHING_START,
    RESET_STATE,
    PREPARE_UPDATE_LIST,
    SET_RUNSHEET_NUMBER_LIST,
    SET_RESPONSE_MESSAGE,
    CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SEQUENCE_LIST_ITEM_DRAGGED,
    SET_REFERENCE_NO,
    SET_SEQUENCE_LIST_ITEM,
    SET_SEQ_INITIAL_STATE_EXCEPT_RUNSHEET_LIST,
    SET_SEQUENCE_BACK_ENABLED,
} from '../../lib/constants'


export default function sequenceReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case SEQUENCE_LIST_FETCHING_START:
            return state.set('isSequenceScreenLoading', true)

        case SEQUENCE_LIST_FETCHING_STOP:
            return state.set('sequenceList', action.payload.sequenceList)
                .set('isSequenceScreenLoading', false)
                .set('responseMessage', action.payload.responseMessage)
                .set('transactionsWithChangedSeqeunceMap', action.payload.transactionsWithChangedSeqeunceMap)
                .set('jobMasterSeperatorMap', action.payload.jobMasterSeperatorMap)

        case PREPARE_UPDATE_LIST:
            return state.set('sequenceList', action.payload.updatedSequenceList)
                .set('isSequenceScreenLoading', false)
                .set('responseMessage', action.payload.responseMessage)

        case RESET_STATE:
            return initialState

        case SET_RUNSHEET_NUMBER_LIST:
            return state.set('runsheetNumberList', action.payload)
                .set('isSequenceScreenLoading', false)

        case SET_RESPONSE_MESSAGE:
            return state.set('responseMessage', action.payload)
                .set('isSequenceScreenLoading', false)

        case CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP:
            return state.set('transactionsWithChangedSeqeunceMap', {})
                .set('isSequenceScreenLoading', false)
                .set('responseMessage', action.payload)

        case SEQUENCE_LIST_ITEM_DRAGGED:
            return state.set('sequenceList', action.payload.sequenceList)
                .set('transactionsWithChangedSeqeunceMap', action.payload.transactionsWithChangedSeqeunceMap)
                .set('searchText', '')

        case SET_REFERENCE_NO:
            return state.set('searchText', action.payload)

        case SET_SEQUENCE_LIST_ITEM:
            return state.set('currentSequenceListItemSeleceted', action.payload)
                .set('searchText', '')

        case SET_SEQ_INITIAL_STATE_EXCEPT_RUNSHEET_LIST:
            return state.set('sequenceList', [])
                .set('isSequenceScreenLoading', false)
                .set('isResequencingDisabled', false)
                .set('responseMessage', '')
                .set('searchText', '')
                .set('currentSequenceListItemSeleceted', {})
                .set('jobMasterSeperatorMap', {})
                .set('transactionsWithChangedSeqeunceMap', {})

        case SET_SEQUENCE_BACK_ENABLED:
            return state.set('backEnabledFromAppNavigator', action.payload)
    }
    return state
}