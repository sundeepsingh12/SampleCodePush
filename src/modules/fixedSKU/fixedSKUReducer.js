'use strict'

const InitialState = require('./fixedSKUInitialState').default


const {
    IS_LOADER_RUNNING,
    INFLATE_FIXEDSKU_CHILD,
    CHANGE_QUANTITY
} = require('../../lib/constants').default


const initialState = new InitialState()

export default function fixedSKUReducer(state = initialState, action) {
    console.log('abhishek', action.payload)
    switch (action.type) {
        case IS_LOADER_RUNNING:
            return state.set('isLoaderRunning', action.payload)
        case INFLATE_FIXEDSKU_CHILD:
            return state.set('fixedSKUList', action.payload.fixedSKUList)
                .set('isLoaderRunning', action.payload.isLoaderRunning)
        case CHANGE_QUANTITY:
            return state.set('fixedSKUList', action.payload.tempFixedSKUList)
                .set('totalQuantity', action.payload.totalQuantity)
    }
    return state
}
