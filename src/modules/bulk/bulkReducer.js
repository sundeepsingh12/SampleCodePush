'use strict'

const InitialState = require('./bulkInitialState').default

const initialState = new InitialState()
import {
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM,
    TOGGLE_ALL_JOB_TRANSACTIONS,
    RESET_STATE,
    CLEAR_BULK_STATE,
    SET_BULK_SEARCH_TEXT,
    SET_BULK_ERROR_MESSAGE,
    SET_BULK_TRANSACTION_PARAMETERS,
    SET_BULK_PARAMS_FOR_SELECTED_DATA,
    SET_BULK_CHECK_ALERT_VIEW
} from '../../lib/constants'

import {
    SELECT_ALL
} from '../../lib/ContainerConstants'


export default function bulkReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case START_FETCHING_BULK_TRANSACTIONS: {
            return state.set('isLoaderRunning', true)
                .set('isSelectAllVisible', false)
                .set('bulkTransactionList', {})
                .set('selectedItems', {})
                .set('searchText', null)
                .set('checkAlertView',false)
                .set('selectAllNone', SELECT_ALL)
        }
        case SET_BULK_PARAMS_FOR_SELECTED_DATA: {
            return state.set('wantUnselectJob', action.payload)
        }

        case SET_BULK_CHECK_ALERT_VIEW: {
            return state.set('checkAlertView', action.payload)
        }

        case STOP_FETCHING_BULK_TRANSACTIONS:
            return state.set('isLoaderRunning', false)
                .set('bulkTransactionList', action.payload.bulkTransactions)
                .set('isSelectAllVisible', action.payload.selectAll)
                .set('isManualSelectionAllowed', action.payload.isManualSelectionAllowed)
                .set('searchSelectionOnLine1Line2', action.payload.searchSelectionOnLine1Line2)
                .set('idToSeparatorMap', action.payload.idToSeparatorMap)
                .set('nextStatusList', action.payload.nextStatusList)

        case TOGGLE_JOB_TRANSACTION_LIST_ITEM:
            return state.set('selectedItems', action.payload.selectedItems)
                .set('bulkTransactionList', action.payload.bulkTransactions)

        case TOGGLE_ALL_JOB_TRANSACTIONS:
            return state.set('selectedItems', action.payload.selectedItems)
                .set('bulkTransactionList', action.payload.bulkTransactions)
                .set('selectAllNone', action.payload.displayText)
                .set('isSelectAllVisible', action.payload.selectAll)

        case CLEAR_BULK_STATE:
            return state.set('selectedItems', {})
                .set('bulkTransactionList', {})
                .set('selectAllNone', 'Select All')
                .set('searchText', null)
                .set('searchSelectionOnLine1Line2', null)
                .set('idToSeparatorMap', {})
        case RESET_STATE:
            return initialState
        case SET_BULK_SEARCH_TEXT:
            return state.set('searchText', action.payload)
        case SET_BULK_ERROR_MESSAGE:
            return state.set('errorToastMessage', action.payload)
                .set('searchText', '')
        case SET_BULK_TRANSACTION_PARAMETERS: {
            return state.set('selectedItems', action.payload.selectedItems)
                .set('bulkTransactionList', action.payload.bulkTransactions)
                .set('selectAllNone', action.payload.displayText)
                .set('searchText', action.payload.searchText)
                .set('isSelectAllVisible', action.payload.selectAll)
                .set('wantUnselectJob', null)
        }
    }
    return state
}