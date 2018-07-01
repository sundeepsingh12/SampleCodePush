'use strict'
import {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_ERROR_MSG,
    CLEAR_ARRAY_STATE,
    SET_ARRAY_ISLOADING
} from '../../lib/constants'
import InitialState from './arrayInitialState.js'

const initialState = new InitialState()

export default function arrayReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ARRAY_CHILD_LIST:
            return state.set('childElementsTemplate', action.payload.childElementsTemplate)
                .set('arrayElements', action.payload.arrayRowDTO.arrayElements)
                .set('lastRowId', action.payload.arrayRowDTO.lastRowId)
                .set('isSaveDisabled', action.payload.arrayRowDTO.isSaveDisabled)
                .set('errorMessage', '')
                .set('arrayMainObject', action.payload.arrayMainObject)
                .set('isLoading', false)
                .set('sequenceWiseMasterIds',action.payload.sequenceWiseMasterIds)
        case SET_NEW_ARRAY_ROW:
            return state.set('arrayElements', action.payload.arrayElements)
                .set('lastRowId', action.payload.lastRowId)
                .set('isSaveDisabled', action.payload.isSaveDisabled)
                .set('errorMessage', '')
        case SET_ARRAY_ELEMENTS:
            return state.set('arrayElements', action.payload.newArrayElements)
                .set('isSaveDisabled', action.payload.isSaveDisabled)
                .set('errorMessage', '')
        case SET_ERROR_MSG:
            return state.set('errorMessage', action.payload)
                .set('isLoading', false)
        case SET_ARRAY_ISLOADING:
            return state.set('isLoading', action.payload)
        case CLEAR_ARRAY_STATE: {
            return initialState
        }
    }
    return state
}