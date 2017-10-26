'use strict'

const InitialState = require('./fixedSKUInitialState').default

const {
    IS_LOADER_RUNNING,
    CHANGE_QUANTITY,
    SET_FIXED_SKU
} = require('../../lib/constants').default

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
    }
    return state
}