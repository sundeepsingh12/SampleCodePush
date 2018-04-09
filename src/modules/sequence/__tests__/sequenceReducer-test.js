'use strict'
import {
    SEQUENCE_LIST_FETCHING_START,
    SEQUENCE_LIST_FETCHING_STOP,
    SET_SEQUENCE_LIST_ITEM,
    SET_REFERENCE_NO,
    SEQUENCE_LIST_ITEM_DRAGGED,
    CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
    SET_RESPONSE_MESSAGE,
    SET_RUNSHEET_NUMBER_LIST,
    PREPARE_UPDATE_LIST,
    RESET_STATE
} from '../../../lib/constants'

import sequenceReducer from '../sequenceReducer'
const InitialState = require('../sequenceInitialState').default
describe('sequenceReducer', () => {
    const resultState = new InitialState()
    it('should start fetching sequence list', () => {
        const action = {
            type: SEQUENCE_LIST_FETCHING_START
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.isSequenceScreenLoading).toBe(true)
    })

    it('should stop fetching sequence list', () => {
        const action = {
            type: SEQUENCE_LIST_FETCHING_STOP,
            payload: {
                sequenceList: {},
                jobMasterSeperatorMap: { id: 1 },
                transactionsWithChangedSeqeunceMap: { id: 1 }
            }
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.sequenceList).toBe(action.payload.sequenceList)
        expect(nextState.isSequenceScreenLoading).toBe(false)
        expect(nextState.jobMasterSeperatorMap).toBe(action.payload.jobMasterSeperatorMap)
        expect(nextState.transactionsWithChangedSeqeunceMap).toBe(action.payload.transactionsWithChangedSeqeunceMap)
    })

    it('should set sequence list item when it is pressed', () => {
        const action = {
            type: SET_SEQUENCE_LIST_ITEM,
            payload: {
                id: 1
            }
        }

        let nextState = sequenceReducer(undefined, action)
        expect(nextState.currentSequenceListItemSeleceted).toBe(action.payload)
    })

    it('should set searchText', () => {
        const action = {
            type: SET_REFERENCE_NO,
            payload: 'abc'
        }

        let nextState = sequenceReducer(undefined, action)
        expect(nextState.searchText).toBe(action.payload)
    })

    it('should set sequenceList, transactionsWithChangedSeqeunceMap, searchText', () => {
        const action = {
            type: SEQUENCE_LIST_ITEM_DRAGGED,
            payload: {
                sequenceList: [{ id: 1 }],
                transactionsWithChangedSeqeunceMap: { 1: { id: 1 } }
            }
        }

        let nextState = sequenceReducer(undefined, action)
        expect(nextState.sequenceList).toBe(action.payload.sequenceList)
        expect(nextState.transactionsWithChangedSeqeunceMap).toBe(action.payload.transactionsWithChangedSeqeunceMap)
        expect(nextState.searchText).toBe('')
    })

    it('should set isSequenceScreenLoading, transactionsWithChangedSeqeunceMap, responseMessage', () => {
        const action = {
            type: CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP,
            payload: 'temp'
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.transactionsWithChangedSeqeunceMap).toEqual({})
        expect(nextState.isSequenceScreenLoading).toBe(false)
        expect(nextState.responseMessage).toBe(action.payload)
    })

    it('should set isSequenceScreenLoading, responseMessage', () => {
        const action = {
            type: SET_RESPONSE_MESSAGE,
            payload: 'temp'
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.isSequenceScreenLoading).toBe(false)
        expect(nextState.responseMessage).toBe(action.payload)
    })


    it('should set runsheetNumberList, isSequenceScreenLoading', () => {
        const action = {
            type: SET_RUNSHEET_NUMBER_LIST,
            payload: [{
                id: 1
            }]
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.isSequenceScreenLoading).toBe(false)
        expect(nextState.runsheetNumberList).toBe(action.payload)
    })

    it('should set sequenceList, isSequenceScreenLoading, responseMessage', () => {
        const action = {
            type: PREPARE_UPDATE_LIST,
            payload: {
                updatedSequenceList: [{ id: 1 }],
                responseMessage: 'temp'
            }
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState.sequenceList).toEqual(action.payload.updatedSequenceList)
        expect(nextState.isSequenceScreenLoading).toBe(false)
        expect(nextState.responseMessage).toBe(action.payload.responseMessage)
    })

    it('default case', () => {
        const action = {
            type: 'DEFAULT',
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })

    it('should set initialState', () => {
        const action = {
            type: RESET_STATE,
        }
        let nextState = sequenceReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })
})