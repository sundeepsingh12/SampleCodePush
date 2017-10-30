'use strict'

const InitialState = require('./selectFromListInitialState').default

const {
    SET_VALUE_IN_CHECKBOX,
} = require('../../lib/constants').default

const initialState = new InitialState()

export default function jobDetailsReducer(state = initialState, action) {

    switch (action.type) {
        case SET_VALUE_IN_CHECKBOX:
            console.log("InReducer",action.payload)
            return state.set('checkBoxValues', action.payload)
    }
    return state
}