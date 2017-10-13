'use strict'
const {
    SET_REMARKS_VALIDATION,
    SET_FIELD_DATA_LIST
} = require('../../lib/constants').default

const InitialState = require('./signatureInitialState').default

const initialState = new InitialState()

export default function signatureReducer(state = initialState, action) {
    console.log('====' + action.payload)
    switch (action.type) {

        case SET_FIELD_DATA_LIST:
            return state.set('fieldDataList', action.payload)
    }
    return state
}