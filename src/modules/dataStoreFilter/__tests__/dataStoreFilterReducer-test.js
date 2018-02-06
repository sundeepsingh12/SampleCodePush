'use strict'

import dataStoreFilterReducer from '../dataStoreFilterReducer'

import {
    SHOW_LOADER_DSF,
    DATA_STORE_FILTER_LIST,
    SET_DSF_SEARCH_TEXT,
    SEARCHED_DATA_STORE_FILTER_LIST,
    SET_DSF_INITIAL_STATE,
} from '../../../lib/constants'
const InitialState = require('../dataStoreFilterInitialState').default

describe('data Store reducer', () => {

    const resultState = new InitialState()

    it('should set isLoaderForDSFRunning to true', () => {
        const action = {
            type: SHOW_LOADER_DSF,
            payload: true
        }
        let nextState = dataStoreFilterReducer(undefined, action)
        expect(nextState.isLoaderForDSFRunning).toBe(action.payload)
    })

    it('should set dataStoreFilterList and isLoaderForDSFRunning to false', () => {
        const action = {
            type: DATA_STORE_FILTER_LIST,
            payload: {}
        }
        let nextState = dataStoreFilterReducer(undefined, action)
        expect(nextState.dataStoreFilterList).toBe(action.payload)
        expect(nextState.isLoaderForDSFRunning).toBe(false)
    })

    it('should set DSFSearchText', () => {
        const action = {
            type: SET_DSF_SEARCH_TEXT,
            payload: 'temp'
        }
        let nextState = dataStoreFilterReducer(undefined, action)
        expect(nextState.DSFSearchText).toBe(action.payload)
    })

    it('should set dataStoreFilterList, cloneDataStoreFilterList isLoaderForDSFRunning to false', () => {
        const action = {
            type: SEARCHED_DATA_STORE_FILTER_LIST,
            payload: {
                dataStoreFilterList:{},
                cloneDataStoreFilterList:{}
            }
        }
        let nextState = dataStoreFilterReducer(undefined, action)
        expect(nextState.dataStoreFilterList).toBe(action.payload.dataStoreFilterList)
        expect(nextState.cloneDataStoreFilterList).toBe(action.payload.cloneDataStoreFilterList)
        expect(nextState.isLoaderForDSFRunning).toBe(false)
    })

    it('should set initialState', () => {
        const action = {
            type: SET_DSF_INITIAL_STATE,
        }
        let nextState = dataStoreFilterReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })

    it('default case', () => {
        const action = {
            type: 'DEFAULT',
        }
        let nextState = dataStoreFilterReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })
})
