'use strict'

import InitialState from '../cashTenderingInitialState'

import {
    CHANGE_AMOUNT,
    IS_CASH_TENDERING_LOADER_RUNNING,
    SET_CASH_TENDERING,
    IS_RECEIVE_TOGGLE,
    FETCH_CASH_TENDERING_LIST_RETURN,
    CHANGE_AMOUNT_RETURN,
    RESET_STATE
} from '../../../lib/constants'
import cashTenderingReducer from '../cashTenderingReducer'

const initialState = new InitialState()

describe('Cash Tendering List Reducer', () => {

    it('it starts or ends loader ', () => {
        let loaderRunning = false
        let action = {
            type: IS_CASH_TENDERING_LOADER_RUNNING,
            payload: loaderRunning
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(nextState.isCashTenderingLoaderRunning).toBe(initialState.isCashTenderingLoaderRunning)
    })

    it('it changes Amount and cash Tendering List ', () => {
        let payload = {
            cashTenderingList: {},
            totalAmount: 80,
        }
        let action = {
            type: CHANGE_AMOUNT,
            payload: payload
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(nextState.totalAmount).toBe(80)
        expect(nextState.cashTenderingList).toBe(payload.cashTenderingList)

    })

    it('it changes Amount and cash Tendering List Return  ', () => {
        let payload = {
            cashTenderingList: {},
            totalAmount: 80,
        }
        let action = {
            type: CHANGE_AMOUNT_RETURN,
            payload: payload
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(nextState.totalAmountReturn).toBe(80)
        expect(nextState.cashTenderingListReturn).toBe(payload.cashTenderingList)

    })

    it('it sets cash Tendering List ', () => {
        let payload = {
            cashTenderingList: { id: 1 },
            isCashTenderingLoaderRunning: false,
        }
        let action = {
            type: SET_CASH_TENDERING,
            payload: payload
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(nextState.isCashTenderingLoaderRunning).toBe(false)
        expect(nextState.cashTenderingList).toBe(payload.cashTenderingList)

    })

    it('it sets cash Tendering List ', () => {
        let payload = {
            cashTenderingListReturn: { id: 1 },
            isCashTenderingLoaderRunning: false,
        }
        let action = {
            type: FETCH_CASH_TENDERING_LIST_RETURN,
            payload: payload
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(nextState.isCashTenderingLoaderRunning).toBe(false)
        expect(nextState.cashTenderingListReturn).toBe(payload.cashTenderingListReturn)

    })

    it('it sets receive or return which type of denomiantions are open ', () => {
        let payload = false
        let action = {
            type: IS_RECEIVE_TOGGLE,
            payload: payload
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(nextState.isReceive).toBe(false)

    })

    it('it Reset state ', () => {
        let payload = false
        let action = {
            type: RESET_STATE,
            payload: payload
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(initialState).toBe(initialState)
    })

    it('it sets initial state ', () => {
        let payload = false
        let action = {
            type: "ABCD_LKJH",
            payload: payload
        }
        let nextState = cashTenderingReducer(undefined, action)
        expect(initialState).toBe(initialState)
    })

})