'use strict'

import InitialState from './payByLinkPaymentInitialState'

import {
    SET_PAY_BY_LINK_PARAMETERS
} from '../../../lib/constants'

const initialState = new InitialState()

export default function payByLinkPaymentReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch(action.type) {
        case SET_PAY_BY_LINK_PARAMETERS:
            return state.set('payByLinkConfigJSON',action.payload.payByLinkConfigJSON)
                        .set('customerContact',action.payload.customerContact)
    }

    return state
}





