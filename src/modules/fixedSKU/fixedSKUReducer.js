'use strict'

const InitialState = require('./fixedSKUInitialState').default

import {
    IS_LOADER_RUNNING,
    CHANGE_QUANTITY,
    SET_FIXED_SKU,
    RESET_STATE,
    RESET_STATE_FIXED_SKU,
    SET_TOAST_ERROR_MESSAGE
} from '../../lib/constants'

const initialState = new InitialState()

export default function fixedSKUReducer(state = initialState, action) {
    switch (action.type) {
        case IS_LOADER_RUNNING:
            return state.set('isLoaderRunning', action.payload)
        case CHANGE_QUANTITY:
            return state.set('fixedSKUList', action.payload.fixedSKUList)
                .set('totalQuantity', action.payload.totalQuantity)
        case SET_FIXED_SKU:
            return state.set('fixedSKUList', action.payload.fixedSKUList)
                .set('isLoaderRunning', action.payload.isLoaderRunning)
        case RESET_STATE_FIXED_SKU:
        case RESET_STATE:
            return initialState
        case SET_TOAST_ERROR_MESSAGE:
            return state.set('errorMessage', action.payload)
    }
    return state
}
