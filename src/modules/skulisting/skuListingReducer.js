'use strict'

const InitialState = require('./skuListingInitialState').default

const initialState = new InitialState()
import {
    SKU_LIST_FETCHING_STOP,
    SKU_LIST_FETCHING_START,
    SHOW_SEARCH_BAR,
    SKU_CODE_CHANGE,
    UPDATE_SKU_ACTUAL_QUANTITY,
    RESET_STATE,
    UPDATE_SKU_LIST_ITEMS,
    SET_SKU_CODE,
} from '../../lib/constants'


export default function skuListingReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case SKU_LIST_FETCHING_START:
            return state.set('skuListingLoading', action.payload)

        case SKU_LIST_FETCHING_STOP:
            return state.set('skuListItems', action.payload.skuListItems)
                .set('skuListingLoading', false)
                .set('skuObjectValidation', action.payload.skuObjectValidation)
                .set('skuChildItems', action.payload.skuArrayChildAttributes)
                .set('skuObjectAttributeId', action.payload.skuObjectAttributeId)
                .set('skuObjectAttributeKey', action.payload.skuObjectAttributeKey)
                .set('skuValidationForImageAndReason', action.payload.skuValidationForImageAndReason)
                .set('reasonsList', action.payload.reasonsList)
                .set('isSearchBarVisible', action.payload.skuCodeMap)
                
        case SKU_CODE_CHANGE:
            return state.set('skuSearchTerm', action.payload)

        case UPDATE_SKU_ACTUAL_QUANTITY:
            return state.set('skuListItems', action.payload.skuListItems)
                .set('skuChildItems', action.payload.skuRootChildElements)
                .set('searchText', '')

        case UPDATE_SKU_LIST_ITEMS:
            return state.set('skuListItems', action.payload)

        case RESET_STATE:
            return initialState

        case SET_SKU_CODE:
            return state.set('searchText', action.payload)

    }
    return state
}