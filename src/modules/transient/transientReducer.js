'use strict'

const InitialState = require('./transientInitialState').default

const initialState = new InitialState()

const {
    ADD_FORM_LAYOUT_STATE,
    SET_SHOW_JOB_DETAILS,
    LOADER_IS_RUNNING,
    SHOW_CHECKOUT_DETAILS,
    SET_INITIAL_STATE_TRANSIENT_STATUS
} = require('../../lib/constants').default

export default function transientStatusReducer(state = initialState, action) {

    switch (action.type) {
        case LOADER_IS_RUNNING:
            return state.set('loaderRunning', action.payload)
        case ADD_FORM_LAYOUT_STATE:
            return state.set('formLayoutStates', action.payload.formLayoutStates)
                .set('currentStatus', action.payload.currentStatus)
                .set('loaderRunning', false)
                .set('isCheckoutVisible', action.payload.isCheckoutVisible)

        case SET_SHOW_JOB_DETAILS:
            return state.set('savedJobDetails', action.payload)
                .set('loaderRunning', false)

        case SHOW_CHECKOUT_DETAILS:
            return state.set('checkoutData', action.payload)

        case SET_INITIAL_STATE_TRANSIENT_STATUS:
            return initialState
    }

    return state
}
