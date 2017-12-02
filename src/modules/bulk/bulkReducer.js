'use strict'

const InitialState = require('./bulkInitialState').default

const initialState = new InitialState()
import {
    START_FETCHING_BULK_CONFIG,
    STOP_FETCHING_BULK_CONFIG,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM,
    RESET_STATE,
    TOGGLE_ALL_JOB_TRANSACTIONS
} from '../../lib/constants'


export default function bulkReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case START_FETCHING_BULK_TRANSACTIONS:
        case START_FETCHING_BULK_CONFIG:
            return state.set('isLoaderRunning',true)    
        
        case STOP_FETCHING_BULK_CONFIG:
            return state.set('isLoaderRunning',false)   
                        .set('bulkConfigList',action.payload) 

        case STOP_FETCHING_BULK_TRANSACTIONS:
            return state.set('isLoaderRunning',false)
                            .set('bulkTransactionList',action.payload.bulkTransactions)
                            .set('isSelectAllVisible',action.payload.selectAll)

        case TOGGLE_JOB_TRANSACTION_LIST_ITEM:
        return state.set('selectedItems',action.payload.selectedItems)
                    .set('bulkTransactionList',action.payload.bulkTransactions)

        case RESET_STATE:
             return state.set('selectedItems',[])
                    .set('bulkTransactionList',{})
    
         case TOGGLE_ALL_JOB_TRANSACTIONS:
                     return state.set('selectedItems',action.payload.selectedItems)
                    .set('bulkTransactionList',action.payload.bulkTransactions)
                    .set('selectAllNone',action.payload.displayText)
    }
    return state
}