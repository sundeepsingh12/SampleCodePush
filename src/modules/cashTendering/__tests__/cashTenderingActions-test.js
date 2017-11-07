'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { CashTenderingService } from '../../../services/classes/CashTenderingServices'
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
import { fieldAttributeService } from '../../../services/classes/FieldAttribute'
var actions = require('../cashTenderingActions')
import { setState } from '../../global/globalActions'
var formLayoutActions = require('../../form-layout/formLayoutActions')
const {
    CHANGE_AMOUNT,
    IS_CASH_TENDERING_LOADER_RUNNING,
    SET_CASH_TENDERING,
    IS_RECEIVE_TOGGLE,
    FETCH_CASH_TENDERING_LIST_RETURN,
    CHANGE_AMOUNT_RETURN,
} = require('../../../lib/constants').default
jest.mock('react-native-router-flux')
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('cashtendering  onsave', () => {

    it('should set action type and payload', () => {
        let type = IS_RECEIVE_TOGGLE
        let payload = false
        expect(setState(type, payload)).toEqual({
            type: type,
            payload: payload
        })
    })
})

describe('cashtendering  getCashTenderingListReturn', () => {    
    it('should getCashTenderingListReturn', () => {
        let type = IS_RECEIVE_TOGGLE
        let payload = false
        expect(setState(type, payload)).toEqual({
            type: type,
            payload: payload
        })
    })

})

describe('cashtendering  getCashTenderingListReturn', () => {    
    it('should change quantity of individual item', () => {
        const expectedAction = [{
            type: CHANGE_AMOUNT,
            payload: {
                cashtenderingList: { id: 1 },
                totalQuantity: 10
            }
        }]
        let cashtenderingList = {
            id: 1
        }
        let totalQuantity = 10
        let payload = {
            id: 1,
            quantity: 1200
        }
        let isReceive = true
        CashTenderingService.calculateQuantity = jest.fn()
        CashTenderingService.calculateQuantity.mockReturnValue({
            cashtenderingList: cashtenderingList,
            totalQuantity: totalQuantity
        })
        const store = mockStore({})
        return store.dispatch(actions.onChangeQuantity(cashtenderingList, totalQuantity, payload, isReceive))
            .then(() => {
                expect(CashTenderingService.calculateQuantity).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedAction[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedAction[0].payload)
            })
    })
})