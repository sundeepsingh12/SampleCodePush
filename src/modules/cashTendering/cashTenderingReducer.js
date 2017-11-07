'use strict'

const InitialState = require('./cashTenderingInitialState').default

const {
    CHANGE_AMOUNT,
    IS_CASH_TENDERING_LOADER_RUNNING,
    SET_CASH_TENDERING,
    IS_RECEIVE_TOGGLE,
    FETCH_CASH_TENDERING_LIST_RETURN,
    CHANGE_AMOUNT_RETURN,
} = require('../../lib/constants').default

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

        case IS_RECEIVE_TOGGLE:
            return state.set('isReceive', action.payload)

        case FETCH_CASH_TENDERING_LIST_RETURN:
            return state.set('cashTenderingListReturn', action.payload.cashTenderingListReturn)
                .set('isCashTenderingLoaderRunning', action.payload.isCashTenderingLoaderRunning)

    }
    return state
}
