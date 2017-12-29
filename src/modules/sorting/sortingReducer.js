'use strict'

import InitialState from './sortingInitialState' 
import {
    SORTING_SEARCH_VALUE,
    SORTING_ITEM_DETAILS,
    ERROR_MESSAGE,
    SORTING_LOADER,
    RESET_STATE
} from '../../lib/constants'

const initialState = new InitialState()

export default function sortingReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)
   switch (action.type) {
       case SORTING_LOADER:
           return state.set('loaderRunning', action.payload)
                       .set('sortingDetails',{})
       case SORTING_SEARCH_VALUE:
           return state.set('searchRefereneceValue', action.payload)
       case SORTING_ITEM_DETAILS:
           return state.set('sortingDetails', action.payload)
                       .set('searchRefereneceValue','')
                       .set('loaderRunning', false)
       case ERROR_MESSAGE:
           return state.set('errorMessage',action.payload)
                       .set('loaderRunning', false)
                       .set('searchRefereneceValue','')
        case RESET_STATE:
            return initialState               
   }
   return state
}