'use strict'

import {
    HOME_LOADING,
} from '../../../lib/constants'

import homeReducer from '../homeReducer'

describe('home reducer', () => {
    it('it should set loader',() => {
        const action = {
            type : HOME_LOADING,
            payload: {
                loading : false
            }
        }
        let nextState = homeReducer(undefined,action)
        expect(nextState.loading).toBe(action.payload.loading)
    })
})