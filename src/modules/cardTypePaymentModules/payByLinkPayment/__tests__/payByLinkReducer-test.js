'use strict'

import {
    SET_PAY_BY_LINK_PARAMETERS,
    SET_LOADER_FOR_PAYBYLINK,
    ON_CHANGE_PAYBYLINK_MOBILE_NO,
    SET_PAY_BY_LINK_MESSAGE,
    CLEAR_STATE_FOR_PAY_BY_LINK
} from '../../../../lib/constants'

import payByLinkReducer from '../payByLinkPaymentReducer'

describe('payByLinkReducer ', () => {

    it('it should set Loader for payByLink', () => {
        const dataList = 'test'
        const action = {
            type: SET_LOADER_FOR_PAYBYLINK,
            payload: true
        }
        let nextState = payByLinkReducer(undefined, action)
        expect(nextState.payByLinkScreenLoader).toBe(true)
    })
    it('it should set customer contact', () => {
        const action = {
            type: ON_CHANGE_PAYBYLINK_MOBILE_NO,
            payload: 2321242332
        }
        let nextState = payByLinkReducer(undefined, action)
        expect(nextState.customerContact).toBe(2321242332)
    })
    it('it should set payByLink message ', () => {
        const action = {
            type: SET_PAY_BY_LINK_MESSAGE,
            payload: 'sms sent successfully'
        }
        let nextState = payByLinkReducer(undefined, action)
        expect(nextState.payByLinkMessage).toBe('sms sent successfully')
    })
    it('it should return intialState in case of action not present in reducer', () => {
        const action = {
            type: 'STATELESS_STATE',
        }
        let nextState = payByLinkReducer(undefined, action)
        expect(nextState.payByLinkMessage).toBe(null)
    })
    it('it should set intialState', () => {
        const action = {
            type: CLEAR_STATE_FOR_PAY_BY_LINK,
        }
        let nextState = payByLinkReducer(undefined, action)
        expect(nextState.payByLinkMessage).toBe(null)
    })
    it('it should set all parameters of payByLink', () => {
        let payLoadData = {
            payByLinkConfigJSON: { apiPassword : '==SDYVB5357V', secretKey: 'advu673v673'},
            customerContact: 34246543
        }
        const action = {
            type: SET_PAY_BY_LINK_PARAMETERS,
            payload: payLoadData
        }
        let nextState = payByLinkReducer(undefined, action)
        expect(nextState.payByLinkConfigJSON).toBe(payLoadData.payByLinkConfigJSON)
    })
})