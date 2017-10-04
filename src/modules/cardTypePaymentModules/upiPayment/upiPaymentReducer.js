'use strict'

const InitialState = require('./upiPaymentInitialState').default
const {
    SET_UPI_PAYMENT_CUSTOMER_CONTACT,
    SET_UPI_PAYMENT_CUSTOMER_NAME,
    SET_UPI_PAYMENT_PARAMETERS,
    SET_UPI_PAYMENT_PAYER_VPA,
} = require('../../../lib/constants').default

const initialState = new InitialState()

export default function upiPaymentReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case SET_UPI_PAYMENT_PARAMETERS:
            return state.set('customerName', action.payload.customerName)
                .set('upiConfigJSON', action.payload.upiConfigJSON)
        case SET_UPI_PAYMENT_PAYER_VPA:
            return state.set('payerVPA', action.payload.payerVPA)
        case SET_UPI_PAYMENT_CUSTOMER_NAME:
            return state.set('customerName', action.payload.customerName)
        case SET_UPI_PAYMENT_CUSTOMER_CONTACT:
            return state.set('customerContact', action.payload.customerContact)
    }

    return state
}