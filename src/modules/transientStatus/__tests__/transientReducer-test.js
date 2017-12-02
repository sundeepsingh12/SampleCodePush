'use strict'

import transientReducer from '../transientReducer'

import {
    ADD_FORM_LAYOUT_STATE,
    LOADER_IS_RUNNING,
} from '../../../lib/constants'
const InitialState = require('../transientInitialState').default

describe('transient reducer', () => {

    const resultState = new InitialState()
    it('should set loaderRunning to true', () => {
        const action = {
            type: LOADER_IS_RUNNING,
            payload: true
        }
        let nextState = transientReducer(undefined, action)
        expect(nextState.loaderRunning).toBe(action.payload)
    })

    it('should set formLayoutStates and loaderRunning to false', () => {
        const action = {
            type: ADD_FORM_LAYOUT_STATE,
            payload: {
                '123': {
                    id: 123
                }
            }
        }
        let nextState = transientReducer(undefined, action)
        expect(nextState.formLayoutStates).toBe(action.payload)
        expect(nextState.loaderRunning).toBe(false)
    })

    it('default case', () => {
        const action = {
            type: 'DEFAULT'
        }
        let nextState = transientReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })
})
