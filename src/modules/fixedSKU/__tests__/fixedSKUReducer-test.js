'use strict'

import {
    IS_LOADER_RUNNING,
    CHANGE_QUANTITY,
    SET_FIXED_SKU,
    SET_TOAST_ERROR_MESSAGE,
    RESET_STATE
} from '../../../lib/constants'

import fixedSKUReducer from '../fixedSKUReducer'
const InitialState = require('../fixedSKUInitialState').default

describe('FixedSKU reducer', () => {

    it('should set return initial state', () => {
        const action = {
            type: 'DEFAULT',
        }
        const result = new InitialState()
        let nextState = fixedSKUReducer(undefined, action)
        expect(nextState).toEqual(result)
    })

    it('should set loader', () => {
        const action = {
            type: IS_LOADER_RUNNING,
            payload: true
        }
        let nextState = fixedSKUReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(true)
    })

    it('should set fixedSKUList', () => {
        const action = {
            type: SET_FIXED_SKU,
            payload: {
                fixedSKUList: { id: 1 },
                isLoaderRunning: false
            }
        }
        let nextState = fixedSKUReducer(undefined, action)
        expect(nextState.fixedSKUList).toBe(action.payload.fixedSKUList)
        expect(nextState.isLoaderRunning).toBe(action.payload.isLoaderRunning)
    })

    it('should set fixedSKUList and totalQuantity', () => {
        const action = {
            type: CHANGE_QUANTITY,
            payload: {
                fixedSKUList: {
                    id: 1
                }, totalQuantity: 10
            }
        }
        let nextState = fixedSKUReducer(undefined, action)
        expect(nextState.fixedSKUList).toBe(action.payload.fixedSKUList)
        expect(nextState.totalQuantity).toBe(action.payload.totalQuantity)
    })

    it('should set errorMessage', () => {
        const action = {
            type: SET_TOAST_ERROR_MESSAGE,
            payload: 'temp'
        }
        let nextState = fixedSKUReducer(undefined, action)
        expect(nextState.errorMessage).toBe(action.payload)
    })

    it('should set initial state', () => {
        const action = {
            type: RESET_STATE,
        }
        const result = new InitialState()
        let nextState = fixedSKUReducer(undefined, action)
        expect(nextState).toEqual(result)
    })
})