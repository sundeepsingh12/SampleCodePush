'use strict'

import {
    START_FETCHING_BULK_CONFIG,
    STOP_FETCHING_BULK_CONFIG,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM
} from '../../../lib/constants'

import bulkReducer from '../bulkReducer'

describe('bulk reducer',()=>{

    it('should start fetching bulk config list',()=>{
          const action = {
            type: START_FETCHING_BULK_CONFIG
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(true)
    })

    it('should start fetching bulk transaction listing',() => {
        const action = {
            type: START_FETCHING_BULK_TRANSACTIONS
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(true)
    })

    it('should stop fetching bulk config',() => {
         const action = {
            type: STOP_FETCHING_BULK_CONFIG,
            payload:{}
        }
        let nextState = bulkReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(false)
        expect(nextState.bulkConfigList).toBe(action.payload)
    })

    it('should stop fetching bulk transactions',() => {
        const action = {
            type: STOP_FETCHING_BULK_TRANSACTIONS,
            payload:{}
        }
        let nextState = bulkReducer(undefined, action)
         expect(nextState.isLoaderRunning).toBe(false)
         expect(nextState.bulkTransactionList).toBe(action.payload)

    })

    it('should toggle job transaction list item',() => {
        const action = {
            type: TOGGLE_JOB_TRANSACTION_LIST_ITEM,
            payload:{
                selectedItems:[],
                bulkTransactions:{}
            }
        }
        let nextState = bulkReducer(undefined, action)
         expect(nextState.selectedItems).toBe(action.payload.selectedItems)
         expect(nextState.bulkTransactionList).toBe(action.payload.bulkTransactions)
    })
})