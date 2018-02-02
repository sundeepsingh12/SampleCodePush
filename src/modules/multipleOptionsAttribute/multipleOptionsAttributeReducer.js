'use strict'

import InitialState from './multipleOptionsAttributeInitialState'

import {
    SET_OPTIONS_LIST,
    RESET_STATE,
    SET_OPTION_ATTRIBUTE_ERROR,
    SET_OPTION_SEARCH_INPUT
} from '../../lib/constants'

const initialState = new InitialState()

export default function multipleOptionsAttributeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_OPTIONS_LIST: {
            return state.set('optionsMap', action.payload.optionsMap)
                .set('searchInput', null)
        }
        case SET_OPTION_ATTRIBUTE_ERROR: {
            return state.set('error', action.payload.error)
        }
        case SET_OPTION_SEARCH_INPUT: {
            return state.set('searchInput', action.payload.searchInput)
        }
        case RESET_STATE: {
            return initialState
        }
    }
    return state
}