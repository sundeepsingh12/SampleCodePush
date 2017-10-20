'use strict'

const {
    IS_LOADER_RUNNING,
    CHANGE_QUANTITY,
    SET_FIXED_SKU
} = require('../../../lib/constants').default
import fixedSKUReducer from '../fixedSKUReducer'

describe('FixedSKU reducer', () => {
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
                id: 1
            }
        }
        let nextState = fixedSKUReducer(undefined, action)
        expect(nextState.fixedSKUList).toBe(action.payload)
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
})