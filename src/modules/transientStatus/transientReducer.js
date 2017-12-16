'use strict'

const InitialState = require('./transientInitialState').default

const initialState = new InitialState()

import {
    ADD_FORM_LAYOUT_STATE,
    LOADER_IS_RUNNING,
    RESET_STATE
}  from '../../lib/constants'

export default function transientStatusReducer(state = initialState, action) {

    switch (action.type) {
        case LOADER_IS_RUNNING:
            return state.set('loaderRunning', action.payload)
        case ADD_FORM_LAYOUT_STATE:
            return state.set('formLayoutStates', action.payload)
                .set('loaderRunning', false)
         case RESET_STATE:
            return initialState
    }

    return state
}
