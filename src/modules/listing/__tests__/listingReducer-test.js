'use strict'

import listingReducer from '../listingReducer'
import {
    JOB_LISTING_START,
    JOB_LISTING_END,
    RESET_STATE
} from '../../../lib/constants'

import InitialState from '../listingInitialState'

describe('test cases for listing reducer', () => {
    it('test JOB_LISTING_START', () => {
        const action = {
            type: JOB_LISTING_START,
        }
        let nextState = listingReducer(undefined, action)
        expect(nextState.isRefreshing).toEqual(true)
    })

    it('test JOB_LISTING_END', () => {
        const action = {
            type: JOB_LISTING_END,
            payload: {
                jobTransactionCustomizationList: {},
                statusNextStatusListMap: {}
            }
        }
        let nextState = listingReducer(undefined, action)
        expect(nextState.isRefreshing).toEqual(false)
        expect(nextState.jobTransactionCustomizationList).toEqual(action.payload.jobTransactionCustomizationList)
        expect(nextState.statusNextStatusListMap).toEqual(action.payload.statusNextStatusListMap)
    })

    it('test RESET_STATE', () => {
        const action = {
            type: RESET_STATE
        }
        let nextState = listingReducer(undefined, action)
        expect(nextState.isRefreshing).toEqual(false)
        expect(nextState.jobTransactionCustomizationList).toEqual([])
        expect(nextState.statusNextStatusListMap).toEqual({})
    })

    it('set initial state', () => {
        const action = {
            type: null
        }
        let nextState = listingReducer(undefined, action)
        expect(nextState.isRefreshing).toEqual(false)
        expect(nextState.jobTransactionCustomizationList).toEqual([])
        expect(nextState.statusNextStatusListMap).toEqual({})
    })
})
