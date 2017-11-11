'use strict'
const {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS
  } = require('../../lib/constants').default
import InitialState from './arrayInitialState.js'

const initialState = new InitialState()

export default function arrayReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ARRAY_CHILD_LIST:
            return state.set('childElementsTemplate', action.payload.childElementsTemplate)
                .set('arrayElements', action.payload.arrayRowDTO.arrayElements)
                .set('lastRowId', action.payload.arrayRowDTO.lastRowId)
                .set('isSaveDisabled', action.payload.arrayRowDTO.isSaveDisabled)
        case SET_NEW_ARRAY_ROW:
            return state.set('arrayElements', action.payload.arrayElements)
                .set('lastRowId', action.payload.lastRowId)
                .set('isSaveDisabled', action.payload.isSaveDisabled)
        case SET_ARRAY_ELEMENTS:
            return state.set('arrayElements', action.payload.newArrayElements)
                .set('isSaveDisabled', action.payload.isSaveDisabled)
    }
    return state
}