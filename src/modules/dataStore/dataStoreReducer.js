'use strict'

const InitialState = require('./dataStoreInitialState').default
import {
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER_DS,
    SHOW_ERROR_MESSAGE,
    SET_SEARCH_TEXT,
    SHOW_DETAILS,
    SET_INITIAL_STATE,
    CLEAR_ATTR_MAP_AND_SET_LOADER,
    DISABLE_AUTO_START_SCANNER,
    SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP,
    SEARCH_DATA_STORE_RESULT
} from '../../lib/constants'
const initialState = new InitialState()

export default function dataStoreReducer(state = initialState, action) {
    switch (action.type) {

        case SHOW_LOADER_DS:
            return state.set('loaderRunning', action.payload)
                .set('errorMessage', '')

        case SET_DATA_STORE_ATTR_MAP:
            return state.set('dataStoreAttrValueMap', action.payload.dataStoreAttrValueMap)
                .set('value', action.payload.searchText)
                .set('loaderRunning', false)
                .set('errorMessage', '')
                .set('searchText', action.payload.searchText)

        case SHOW_ERROR_MESSAGE:
            return state.set('errorMessage', action.payload.errorMessage)
                .set('loaderRunning', false)
                .set('dataStoreAttrValueMap', action.payload.dataStoreAttrValueMap)

        case SET_SEARCH_TEXT:
            return state.set('searchText', action.payload)
                .set('errorMessage', '')

        case SHOW_DETAILS:
            return state.set('detailsVisibleFor', action.payload)

        case SET_INITIAL_STATE:
            return initialState

        case CLEAR_ATTR_MAP_AND_SET_LOADER:
            return state.set('loaderRunning', true)
                .set('dataStoreAttrValueMap', {})
                .set('errorMessage', '')

        case DISABLE_AUTO_START_SCANNER:
            return state.set('isAutoStartScannerEnabled', action.payload)

        case SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP:
            return state.set('dataStoreAttrValueMap', action.payload.dataStoreAttrValueMap)
                .set('isFiltersPresent', action.payload.isFiltersPresent)
                .set('isScannerEnabled', action.payload.validation.isScannerEnabled)
                .set('isAutoStartScannerEnabled', action.payload.validation.isAutoStartScannerEnabled)
                .set('isMinMaxValidation', action.payload.validation.isMinMaxValidation)
                .set('isSearchEnabled', action.payload.validation.isSearchEnabled)
                .set('loaderRunning', false)

        case SEARCH_DATA_STORE_RESULT:
            return state.set('dataStoreAttrValueMap', action.payload.dataStoreAttrValueMap)
                .set('cloneDataStoreAttrValueMap', action.payload.cloneDataStoreAttrValueMap)
                .set('searchText', action.payload.searchText)
                .set('loaderRunning', false)
    }
    return state
}