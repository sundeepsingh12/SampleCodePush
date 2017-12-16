'use strict'

const InitialState = require('./offlineDSInitialState').default
import {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER,
    SHOW_ERROR_MESSAGE,
    SET_SEARCH_TEXT,
    SHOW_DETAILS,
    SET_INITIAL_STATE,
    SAVE_SUCCESSFUL,
    CLEAR_ATTR_MAP_AND_SET_LOADER,
    DISABLE_AUTO_START_SCANNER
} from '../../lib/constants'
const initialState = new InitialState()

export default function offlineDSReducer(state = initialState, action) {
    switch (action.type) {

    }
    return state
}
