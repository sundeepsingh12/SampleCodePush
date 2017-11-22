'use strict'

const InitialState = require('./selectFromListInitialState').default

import {
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,ERROR_MESSAGE,
    SET_DROPDOWN_VALUE,
} from '../../lib/constants'

const initialState = new InitialState()

export default function selectFromListReducer(state = initialState, action) {

    switch (action.type) {
        case SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE:
            return state.set('selectFromListState', action.payload)
        case ERROR_MESSAGE:
            return state.set('errorMessage',action.payload)
        case SET_DROPDOWN_VALUE:
        return state.set('dropdownValue',action.payload)
    }
    return state
}