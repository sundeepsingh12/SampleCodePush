'use strict'
import _ from 'underscore'

const InitialState = require('./skuListingInitialState').default

const initialState = new InitialState()
const {
    SKU_LIST_FETCHING_STOP,
    SKU_LIST_FETCHING_START,
    SHOW_SEARCH_BAR,
    SKU_CODE_CHANGE,
    UPDATE_SKU_ACTUAL_QUANTITY
} = require('../../lib/constants').default


export default function skuListingReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case SKU_LIST_FETCHING_START :
            return state.set('skuListingLoading',true)

        case SKU_LIST_FETCHING_STOP :
            return state.set('skuListItems',action.payload.skuListItems)
                        .set('skuListingLoading',false)
                        .set('skuObjectValidation',action.payload.skuObjectValidation)
                        .set('skuChildItems',action.payload.skuArrayChildAttributes)
                        .set('skuObjectAttributeId',action.payload.skuObjectAttributeId)

        case  SHOW_SEARCH_BAR :
            return state.set('isSearchBarVisible',action.payload)     
        
        case SKU_CODE_CHANGE:
         return state.set('skuSearchTerm',action.payload)

        case UPDATE_SKU_ACTUAL_QUANTITY:
          return state.set('skuListItems',action.payload.skuListItems)
                      .set('skuChildItems',action.payload.skuRootChildElements)                    
    
    }
    return state
}