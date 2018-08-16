'use strict'

import InitialState from './payByLinkPaymentInitialState'

import {
    SET_PAY_BY_LINK_PARAMETERS,
    SET_LOADER_FOR_PAYBYLINK,
    ON_CHANGE_PAYBYLINK_MOBILE_NO,
    SET_PAY_BY_LINK_MESSAGE,
    CLEAR_STATE_FOR_PAY_BY_LINK
} from '../../../lib/constants'

const initialState = new InitialState()

export default function payByLinkPaymentReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch(action.type) {
        case SET_LOADER_FOR_PAYBYLINK:
        return state.set('payByLinkScreenLoader',action.payload)

        case ON_CHANGE_PAYBYLINK_MOBILE_NO:
        return state.set('customerContact',action.payload)

        case SET_PAY_BY_LINK_MESSAGE:
        return state.set('payByLinkMessage',action.payload)
                    .set('payByLinkScreenLoader',false)

        case SET_PAY_BY_LINK_PARAMETERS:
            return state.set('payByLinkConfigJSON',action.payload.payByLinkConfigJSON)
                        .set('customerContact',action.payload.customerContact)
                        .set('payByLinkScreenLoader',false)
                        .set('payByLinkMessage',null)
        case CLEAR_STATE_FOR_PAY_BY_LINK:
           return initialState
    }

    return state
}





