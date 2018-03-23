'use strict'

import InitialState from './cashTenderingInitialState'
import {
    CHANGE_AMOUNT,
    IS_CASH_TENDERING_LOADER_RUNNING,
    SET_CASH_TENDERING,
    IS_RECEIVE_TOGGLE,
    FETCH_CASH_TENDERING_LIST_RETURN,
    CHANGE_AMOUNT_RETURN,
    RESET_STATE
} from '../../lib/constants'

const initialState = new InitialState()

export default function cashTenderingReducer(state = initialState, action) {
    switch (action.type) {

        case IS_CASH_TENDERING_LOADER_RUNNING:
            return state.set('isCashTenderingLoaderRunning', action.payload)

        case CHANGE_AMOUNT:
            return state.set('cashTenderingList', action.payload.cashTenderingList)
                .set('totalAmount', action.payload.totalAmount)

        case CHANGE_AMOUNT_RETURN:
            return state.set('cashTenderingListReturn', action.payload.cashTenderingList)
                .set('totalAmountReturn', action.payload.totalAmount)

        case SET_CASH_TENDERING:
            return state.set('cashTenderingList', action.payload.cashTenderingList)
                .set('isCashTenderingLoaderRunning', action.payload.isCashTenderingLoaderRunning)
                .set('totalAmount', 0)
                .set('totalAmountReturn', 0)
                .set('isReceive', true)

        case IS_RECEIVE_TOGGLE:
            return state.set('isReceive', action.payload)

        case FETCH_CASH_TENDERING_LIST_RETURN:
            return state.set('cashTenderingListReturn', action.payload.cashTenderingListReturn)
                .set('isCashTenderingLoaderRunning', action.payload.isCashTenderingLoaderRunning)

        case RESET_STATE:
            return initialState

    }
    return state
}
