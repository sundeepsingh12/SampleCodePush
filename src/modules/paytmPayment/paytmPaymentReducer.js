'use strict'

const InitialState = require('./paytmPaymentInitialState').default

const initialState = new InitialState()
import {
    SET_PAYTM_LOADER,
    SET_PAYTM_CONFIG_OBJECT,
    SET_CONTACT,
    SET_OTP,
    SET_CHECK_TRANSACTION_VIEW
} from '../../lib/constants'


export default function paytmReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case SET_PAYTM_LOADER:
            return state.set('paytmLoader', action.payload)
        case SET_PAYTM_CONFIG_OBJECT:
            return state.set('paytmLoader', false)
                .set('paytmConfigObject', action.payload.paytmConfigObject)
                .set('contactNumber', action.payload.contactNumber)
                .set('actualAmount', action.payload.actualAmount)
                .set('otp', '')
                .set('showCheckTransaction', null)
        case SET_CONTACT:
            return state.set('contactNumber', action.payload)
        case SET_OTP:
            return state.set('otp', action.payload)
        case SET_CHECK_TRANSACTION_VIEW:
            return state.set('showCheckTransaction', action.payload)
                .set('paytmLoader', false)
    }
    return state
}