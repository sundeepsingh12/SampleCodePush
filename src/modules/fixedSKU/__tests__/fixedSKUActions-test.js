'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { fixedSKUDetailsService } from '../../../services/classes/FixedSKUListing'
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
import { fieldAttributeService } from '../../../services/classes/FieldAttribute'
var actions = require('../fixedSKUActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
import {
    IS_LOADER_RUNNING,
    CHANGE_QUANTITY,
    SET_FIXED_SKU,
} from '../../../lib/constants'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('FixedSKU Actions', () => {

    it('should set action type and payload', () => {
        let type = SET_FIXED_SKU
        let payload = {
            id: 1
        }
        expect(actions.actionDispatch(type, payload)).toEqual({
            type: SET_FIXED_SKU,
            payload: payload
        })
    })

    it('should change quantity of individual item', () => {
        const expectedAction = [{
            type: CHANGE_QUANTITY,
            payload: {
                fixedSKUList: { id: 1 },
                totalQuantity: 10
            }
        }]
        let fixedSKUList = {
            id: 1
        }
        let totalQuantity = 10
        let payload = {
            id: 1,
            quantity: 1200
        }
        fixedSKUDetailsService.calculateQuantity = jest.fn()
        fixedSKUDetailsService.calculateQuantity.mockReturnValue({
            fixedSKUList: fixedSKUList,
            totalQuantity: totalQuantity
        })
        const store = mockStore({})
        return store.dispatch(actions.onChangeQuantity(fixedSKUList, totalQuantity, payload))
            .then(() => {
                expect(fixedSKUDetailsService.calculateQuantity).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedAction[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedAction[0].payload)
            })
    })

    it('should fetch fixedSKUList', () => {
        const expectedAction = [{
            type: IS_LOADER_RUNNING,
        }, {
            type: SET_FIXED_SKU,
            payload: {
                fixedSKUList: {},
                isLoaderRunning: false
            }
        }]
        let fieldAttributeMasterId = 12345
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        fixedSKUDetailsService.prepareFixedSKU = jest.fn()
        fixedSKUDetailsService.prepareFixedSKU.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.fetchFixedSKU(fieldAttributeMasterId))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(fixedSKUDetailsService.prepareFixedSKU).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedAction[0].type)
                expect(store.getActions()[1].type).toEqual(expectedAction[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedAction[1].payload)
            })
    })

    it('should save fixedSKUList to form layout state', () => {
        const expectedAction = [{
            type: SET_FIXED_SKU,
            payload: {
                fixedSKUList: {},
                isLoaderRunning: false
            }
        }]
        let parameters = {
            parentObject: {},
            formElement: {},
            nextEditable: {},
            fixedSKUList: {},
            isSaveDisabled: true,
            latestPositionId: 2,
            jobTransactionId: 123
        }
        fixedSKUDetailsService.calculateTotalAmount = jest.fn()
        fixedSKUDetailsService.calculateTotalAmount.mockReturnValue({})
        fieldAttributeService.prepareFieldDataForTransactionSavingInState = jest.fn()
        fieldAttributeService.prepareFieldDataForTransactionSavingInState.mockReturnValue({})
        formLayoutActions.updateFieldDataWithChildData = jest.fn()
        formLayoutActions.updateFieldDataWithChildData.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.onSave(parameters.parentObject, parameters.formElement, parameters.nextEditable, parameters.fixedSKUList, parameters.isSaveDisabled, parameters.latestPositionId, parameters.jobTransactionId))
            .then(() => {
                expect(fixedSKUDetailsService.calculateTotalAmount).toHaveBeenCalled()
                expect(fieldAttributeService.prepareFieldDataForTransactionSavingInState).toHaveBeenCalled()
                expect(formLayoutActions.updateFieldDataWithChildData).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedAction[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedAction[0].payload)
            })
    })
})




