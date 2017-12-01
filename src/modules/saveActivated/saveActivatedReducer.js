'use strict'

const InitialState = require('./saveActivatedInitialState').default

const initialState = new InitialState()

const {
    LOADER_ACTIVE,
    POPULATE_DATA,
    SAVE_ACTIVATED_INITIAL_STATE,
    DELETE_ITEM_SAVE_ACTIVATED
} = require('../../lib/constants').default

export default function saveActivatedReducer(state = initialState, action) {
    switch (action.type) {
        case LOADER_ACTIVE:
            return state.set('loading', action.payload)
        case POPULATE_DATA:
            return state.set('commonData', action.payload.commonData)
                .set('headerTitle', action.payload.statusName)
                .set('recurringData', action.payload.differentData)
                .set('isSignOffVisible', action.payload.isSignOffVisible)
                .set('loading', false)

        case SAVE_ACTIVATED_INITIAL_STATE:
            return initialState

        case DELETE_ITEM_SAVE_ACTIVATED:
            return state.set('recurringData', action.payload)
    }

    return state
}
