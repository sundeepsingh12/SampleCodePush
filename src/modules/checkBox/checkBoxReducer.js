'use strict'

const InitialState = require('./checkBoxInitialState').default

const {
    SET_VALUE_IN_CHECKBOX,
    SET_OR_REMOVE_FROM_STATE_ARRAY,
    CHECKBOX_BUTTON_CLICKED,
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
    HANDLE_TIME_PICKED,
} = require('../../lib/constants').default

const initialState = new InitialState()

export default function jobDetailsReducer(state = initialState, action) {

    switch (action.type) {
        case SET_VALUE_IN_CHECKBOX:
            console.log("InReducer")
            console.log(action.payload)
            return state.set('checkBoxValues', action.payload)

        case SET_OR_REMOVE_FROM_STATE_ARRAY:
            console.log("SET_OR_REMOVE_FROM_STATE_ARRAY")
            return state.set('checkBoxValues', action.payload)

        case CHECKBOX_BUTTON_CLICKED:
            return state.set('checkBoxValues', Object.values(action.payload))

        case SHOW_DATETIME_PICKER:
            return state.set('isComponentVisible',true)

        case HIDE_DATETIME_PICKER :
            return state.set('isComponentVisible',false)
                
        case HANDLE_TIME_PICKED:
            return state.set('value',action.payload)
                        .set('isComponentVisible',false)
    }
    return state
}