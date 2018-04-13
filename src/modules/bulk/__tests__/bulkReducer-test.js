'use strict'

import {
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM,
    TOGGLE_ALL_JOB_TRANSACTIONS,
    RESET_STATE,
    CLEAR_BULK_STATE,
    SET_BULK_SEARCH_TEXT,
    SET_BULK_ERROR_MESSAGE
} from '../../../lib/constants'

import bulkReducer from '../bulkReducer'

describe('bulk reducer', () => {

    it('should start fetching bulk transaction listing', () => {
        const action = {
            type: START_FETCHING_BULK_TRANSACTIONS
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(true)
    })

    it('should stop fetching bulk transactions', () => {
        const action = {
            type: STOP_FETCHING_BULK_TRANSACTIONS,
            payload: {
                bulkTransactions: [],
                selectAll: '',
                isManualSelectionAllowed: false,
                searchSelectionOnLine1Line2: true,
                idToSeparatorMap: {}
            }
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(false)
        expect(nextState.bulkTransactionList).toBe(action.payload.bulkTransactions)
        expect(nextState.isSelectAllVisible).toBe(action.payload.selectAll)
        expect(nextState.isManualSelectionAllowed).toBe(action.payload.isManualSelectionAllowed)
        expect(nextState.searchSelectionOnLine1Line2).toBe(action.payload.searchSelectionOnLine1Line2)
        expect(nextState.idToSeparatorMap).toBe(action.payload.idToSeparatorMap)
    })

    it('should toggle job transaction list item', () => {
        const action = {
            type: TOGGLE_JOB_TRANSACTION_LIST_ITEM,
            payload: {
                selectedItems: [],
                bulkTransactions: {}
            }
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.selectedItems).toBe(action.payload.selectedItems)
        expect(nextState.bulkTransactionList).toBe(action.payload.bulkTransactions)
    })
    it('should toggle all job transactions', () => {
        const action = {
            type: TOGGLE_ALL_JOB_TRANSACTIONS,
            payload: {
                selectedItems: [],
                bulkTransactions: {},
                displayText: ''
            }
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.selectedItems).toBe(action.payload.selectedItems)
        expect(nextState.bulkTransactionList).toBe(action.payload.bulkTransactions)
        expect(nextState.selectAllNone).toBe(action.payload.displayText)
    })
    it('should clear bulk state', () => {
        const action = {
            type: CLEAR_BULK_STATE,
            payload: {}
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.selectedItems).toEqual([])
        expect(nextState.bulkTransactionList).toEqual({})
        expect(nextState.selectAllNone).toBe('Select All')
        expect(nextState.searchText).toBe(null)
        expect(nextState.searchSelectionOnLine1Line2).toBe(null)
        expect(nextState.idToSeparatorMap).toEqual({})
    })
    it('should set search text', () => {
        const action = {
            type: SET_BULK_SEARCH_TEXT,
            payload: 'test'
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.searchText).toBe(action.payload)
    })
    it('should set error toast message', () => {
        const action = {
            type: SET_BULK_ERROR_MESSAGE,
            payload: 'test'
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.errorToastMessage).toBe(action.payload)
        expect(nextState.searchText).toBe('')
    })
})