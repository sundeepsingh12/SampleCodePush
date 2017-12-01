'use strict'

import saveActivatedReducer from '../saveActivatedReducer'

const {
    LOADER_ACTIVE,
    POPULATE_DATA,
    SAVE_ACTIVATED_INITIAL_STATE
} = require('../../../lib/constants').default
const InitialState = require('../saveActivatedInitialState').default

describe('data Store reducer', () => {

    const resultState = new InitialState()
    it('should set loading to true', () => {
        const action = {
            type: LOADER_ACTIVE,
            payload: true
        }
        let nextState = saveActivatedReducer(undefined, action)
        expect(nextState.loading).toBe(action.payload)
    })

    it('should set initial state', () => {
        const action = {
            type: SAVE_ACTIVATED_INITIAL_STATE,
            payload: resultState
        }
        let nextState = saveActivatedReducer(undefined, action)
        expect(nextState).toEqual(action.payload)
    })

    it('should populate data', () => {
        const action = {
            type: POPULATE_DATA,
            payload: {
                commonData: {
                    commonData: {
                        id: 1
                    },
                    amount: 0
                },
                statusName: 'temo',
                differentData: [{
                    '123': {
                        id: 123
                    }
                }],
                isSignOffVisible: false
            }
        }
        let nextState = saveActivatedReducer(undefined, action)
        expect(nextState.commonData).toBe(action.payload.commonData)
        expect(nextState.headerTitle).toBe(action.payload.statusName)
        expect(nextState.recurringData).toBe(action.payload.differentData)
        expect(nextState.isSignOffVisible).toBe(action.payload.isSignOffVisible)
        expect(nextState.loading).toBe(false)
    })

    it('default case', () => {
        const action = {
            type: 'DEFAULT'
        }
        let nextState = saveActivatedReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })
})
