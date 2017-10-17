'use strict'

const InitialState = require('./dateTimePickerInitialState').default

const initialState = new InitialState()
const {
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
    HANDLE_TIME_PICKED,

} = require('../../lib/constants').default

export default function timePickerReducers(state = initialState, action) {

    switch (action.type) {
        case SHOW_DATETIME_PICKER:
            return state.set('isComponentVisible',true)

        case HIDE_DATETIME_PICKER :
            return state.set('isComponentVisible',false)
                
        case HANDLE_TIME_PICKED:
            return state.set('value',action.payload.time)
                        .set('isComponentVisible',false)
    }
    return state
}