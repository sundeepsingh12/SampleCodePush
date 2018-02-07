'use strict'

const InitialState = require('./dataStoreFilterInitialState').default
import {
    SHOW_LOADER_DSF,
    DATA_STORE_FILTER_LIST,
    SET_DSF_SEARCH_TEXT,
    SEARCHED_DATA_STORE_FILTER_LIST,
    SET_DSF_INITIAL_STATE,
} from '../../lib/constants'
const initialState = new InitialState()

export default function dataStoreFilterReducer(state = initialState, action) {
    switch (action.type) {

        case SHOW_LOADER_DSF:
            return state.set('isLoaderForDSFRunning', action.payload)

        case DATA_STORE_FILTER_LIST:
            return state.set('dataStoreFilterList', action.payload)
                .set('isLoaderForDSFRunning', false)

        case SET_DSF_SEARCH_TEXT:
            return state.set('DSFSearchText', action.payload)

        case SEARCHED_DATA_STORE_FILTER_LIST:
            return state.set('dataStoreFilterList', action.payload.dataStoreFilterList)
                .set('cloneDataStoreFilterList', action.payload.cloneDataStoreFilterList)
                .set('isLoaderForDSFRunning', false)

        case SET_DSF_INITIAL_STATE:
            return initialState
    }
    return state
}