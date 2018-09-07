'use strict'

import InitialState from './sortingInitialState'
import {
    SORTING_SEARCH_VALUE,
    SORTING_ITEM_DETAILS,
    DEFAULT_ERROR_MESSAGE_IN_SORTING,
    SORTING_LOADER,
    RESET_STATE,
    SET_SORTING_BLUETOOTH_CONNECTION,
    SORTING_INITIAL_STATE
} from '../../lib/constants'

const initialState = new InitialState()

export default function sortingReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }
    switch (action.type) {
        case SORTING_LOADER:
            return state.set('loaderRunning', action.payload)
                .set('sortingDetails', {})

        case SORTING_SEARCH_VALUE:
            return state.set('searchRefereneceValue', action.payload)

        case SORTING_ITEM_DETAILS:
            return state.set('sortingDetails', action.payload)
                .set('searchRefereneceValue', '')
                .set('loaderRunning', false)

        case DEFAULT_ERROR_MESSAGE_IN_SORTING:
            return state.set('errorMessage', action.payload)
                .set('loaderRunning', false)
                .set('searchRefereneceValue', '')

        case SET_SORTING_BLUETOOTH_CONNECTION: {
            return state.set('isBluetoothConnected', action.payload.isBluetoothConnected)
        }

        case SORTING_INITIAL_STATE: {
            return initialState
        }

        case RESET_STATE:
            return initialState
    }
    return state
}