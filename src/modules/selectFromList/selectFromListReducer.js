'use strict'

const InitialState = require('./selectFromListInitialState').default

import {
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
    ERROR_MESSAGE,
    INPUT_TEXT_VALUE,
    SELECTFROMLIST_ITEMS_LENGTH,
    SET_FILTERED_DATA_SELECTFROMLIST,
    RESET_STATE
} from '../../lib/constants'

const initialState = new InitialState()

export default function selectFromListReducer(state = initialState, action) {
    switch (action.type) {
        case SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE:
            return state.set('selectFromListState', action.payload)
        case ERROR_MESSAGE:
            return state.set('errorMessage', action.payload)
        case INPUT_TEXT_VALUE:
            return state.set('searchBarInputText', action.payload)
        case SELECTFROMLIST_ITEMS_LENGTH:
            return state.set('totalItemsInSelectFromList', action.payload)
        case SET_FILTERED_DATA_SELECTFROMLIST:
            return state.set('filteredDataSelectFromList', action.payload)
        case RESET_STATE:
            return initialState
    }
    return state
}