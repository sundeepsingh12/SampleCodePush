'use strict'

import {
    START_FETCHING_URL,
    END_FETCHING_URL,
    ON_CHANGE_STATE,
    RESET_STATE,
    SCANNER_TEXT
} from '../../../lib/constants'

import customAppReducer from '../customAppReducers'

describe('customAppReducer ', () => {

    it('it should start fetch data from server', () => {
        const dataList = 'test'
        const action = {
            type: START_FETCHING_URL,
            payload: dataList
        }
        let nextState = customAppReducer(undefined, action)
        expect(nextState.customUrl).toBe(action.payload)
        expect(nextState.isLoaderRunning).toBe(true)
    })
    it('it should End fetching data from server', () => {
        const action = {
            type: END_FETCHING_URL,
        }
        let nextState = customAppReducer(undefined, action)
        expect(nextState.isLoaderRunning).toBe(false)
    })
    it('it should set intialstate null', () => {
        const action = {
            type: ON_CHANGE_STATE,
        }
        let nextState = customAppReducer(undefined, action)
        expect(nextState.customUrl).toBe("")
    })
    it('it should set intialstate null when reset_state action is called', () => {
        const action = {
            type: RESET_STATE,
        }
        let nextState = customAppReducer(undefined, action)
        expect(nextState.customUrl).toBe("")
    })
    it('it should set intialstate null', () => {
        const action = {
            type: SCANNER_TEXT,
            payload: 'abc'
        }
        let nextState = customAppReducer(undefined, action)
        expect(nextState.scannerText).toBe("abc")
    })
})