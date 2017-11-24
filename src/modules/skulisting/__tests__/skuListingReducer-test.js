'use strict'
import {
    SKU_LIST_FETCHING_START,
    SKU_LIST_FETCHING_STOP,
    UPDATE_SKU_ACTUAL_QUANTITY
} from '../../../lib/constants'

import skuListingReducer from '../skuListingReducer'

describe('sku listing reducer', () => {

    it('should start fetching sku list', () => {
        const action = {
            type: SKU_LIST_FETCHING_START
        }
        let nextState = skuListingReducer(undefined, action)
        expect(nextState.skuListingLoading).toBe(true)
    })

    it('should stop fetching sku list', () => {
        const action = {
            type: SKU_LIST_FETCHING_STOP,
            payload: {
                skuListItems: {},
                skuObjectValidation: {},
                skuArrayChildAttributes: {},
                skuObjectAttributeId: 19865
            }
        }
        let nextState = skuListingReducer(undefined, action)
        expect(nextState.skuListingLoading).toBe(false)
        expect(nextState.skuListItems).toBe(action.payload.skuListItems)
        expect(nextState.skuObjectValidation).toBe(action.payload.skuObjectValidation)
        expect(nextState.skuObjectAttributeId).toBe(action.payload.skuObjectAttributeId)
        expect(nextState.skuChildItems).toBe(action.payload.skuArrayChildAttributes)

    })

    it('should update sku actual quantity', () => {
        const action = {
            type: UPDATE_SKU_ACTUAL_QUANTITY,
            payload: {
                skuListItems: {},
                skuRootChildElements: {}
            }
        }
        let nextState = skuListingReducer(undefined, action)
        expect(nextState.skuListItems).toBe(action.payload.skuListItems)
        expect(nextState.skuChildItems).toBe(action.payload.skuRootChildElements)

    })
})