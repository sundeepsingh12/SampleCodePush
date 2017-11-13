'use strict'

const InitialState = require('./bulkInitialState').default

const initialState = new InitialState()
import {
    START_FETCHING_BULK_CONFIG,
    STOP_FETCHING_BULK_CONFIG,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS
} from '../../lib/constants'


export default function bulkReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case START_FETCHING_BULK_TRANSACTIONS:
        case START_FETCHING_BULK_CONFIG:
            return state.set('isLoaderRunning',true)    
        
        case STOP_FETCHING_BULK_CONFIG:
            return state.set('isLoaderRunning',false)   
                        .set('bulkConfigList',action.payload.jobMasterVsStatusList) 

        case STOP_FETCHING_BULK_TRANSACTIONS:
            return state.set('isLoaderRunning',false)
                            .set('bulktTransactionList',action.payload.bulkTransactions)
    
    }
    return state
}