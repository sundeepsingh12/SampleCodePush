'use strict'

const InitialState = require('./selectFromListInitialState').default

const {
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
} = require('../../lib/constants').default

const initialState = new InitialState()

export default function selectFromListReducer(state = initialState, action) {

    switch (action.type) {
        case SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE:
            return state.set('selectFromListState', action.payload)
    }
    return state
}