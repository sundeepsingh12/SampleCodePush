'use strict'

import {
    HOME_LOADING,
} from '../../../lib/constants'

import homeReducer from '../homeReducer'

describe('home reducer', () => {
    it('it should set loader and set newJobModules',() => {
        const action = {
            type : HOME_LOADING,
            payload: {
                loading : false,
                newJobModules:{
                    id:1
                }
            }
        }
        let nextState = homeReducer(undefined,action)
        expect(nextState.moduleLoading).toBe(action.payload.loading)
        expect(nextState.newJobModules).toBe(action.payload.newJobModules)
    })
})