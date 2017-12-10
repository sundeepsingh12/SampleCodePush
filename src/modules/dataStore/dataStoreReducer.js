'use strict'

const InitialState = require('./dataStoreInitialState').default
import {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER,
    SHOW_ERROR_MESSAGE,
    SET_SEARCH_TEXT,
    SHOW_DETAILS,
    SET_INITIAL_STATE,
    SAVE_SUCCESSFUL,
    CLEAR_ATTR_MAP_AND_SET_LOADER
} from '../../lib/constants'
const initialState = new InitialState()

export default function dataStoreReducer(state = initialState, action) {
    switch (action.type) {

        case SHOW_LOADER:
            return state.set('loaderRunning', action.payload)
                .set('errorMessage', '')

        case SET_VALIDATIONS:
            return state.set('isScannerEnabled', action.payload.isScannerEnabled)
                .set('isAutoStartScannerEnabled', action.payload.isAutoStartScannerEnabled)
                .set('isMinMaxValidation', action.payload.isMinMaxValidation)
                .set('isSearchEnabled', action.payload.isSearchEnabled)

        case SET_DATA_STORE_ATTR_MAP:
            return state.set('dataStoreAttrValueMap', action.payload.dataStoreAttrValueMap)
                .set('value', action.payload.searchText)
                .set('loaderRunning', false)
                .set('errorMessage', '')

        case SHOW_ERROR_MESSAGE:
            return state.set('errorMessage', action.payload.errorMessage)
                .set('loaderRunning', false)
                .set('dataStoreAttrValueMap', action.payload.dataStoreAttrValueMap)

        case SET_SEARCH_TEXT:
            return state.set('searchText', action.payload)

        case SHOW_DETAILS:
            return state.set('detailsVisibleFor', action.payload)

        case SET_INITIAL_STATE:
            return initialState

        case SAVE_SUCCESSFUL:
            return state.set('isSaveSuccessful', action.payload)

        case CLEAR_ATTR_MAP_AND_SET_LOADER:
            return state.set('loaderRunning', true)
                .set('dataStoreAttrValueMap', {})
                .set('errorMessage', '')
    }
    return state
}
