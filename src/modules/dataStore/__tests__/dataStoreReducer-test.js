'use strict'

import dataStoreReducer from '../dataStoreReducer'

import {
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER_DS,
    SHOW_ERROR_MESSAGE,
    SET_SEARCH_TEXT,
    SHOW_DETAILS,
    SET_INITIAL_STATE,
    CLEAR_ATTR_MAP_AND_SET_LOADER,
    DISABLE_AUTO_START_SCANNER,
    SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP,
    SEARCH_DATA_STORE_RESULT
} from '../../../lib/constants'
const InitialState = require('../dataStoreInitialState').default

describe('data Store reducer', () => {

    const resultState = new InitialState()
    it('should set loaderRunning to true and errorMessage to empty', () => {
        const action = {
            type: SHOW_LOADER_DS,
            payload: true
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.loaderRunning).toBe(action.payload)
        expect(nextState.errorMessage).toBe('')
    })

    it('should set dataStoreAttrValueMap, loaderRunning to false, errorMessage to empty and value to search text', () => {
        const action = {
            type: SET_DATA_STORE_ATTR_MAP,
            payload: {
                dataStoreAttrValueMap: {
                    matchKey: 'name',
                    uniqueKey: 'contact',
                    dataStoreAttributeValueMap: {
                        name: 'temp_name',
                        contact: 'temp_contact'
                    }
                }, searchText: 'abc'
            }
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.dataStoreAttrValueMap).toBe(action.payload.dataStoreAttrValueMap)
        expect(nextState.value).toBe(action.payload.searchText)
        expect(nextState.loaderRunning).toBe(false)
        expect(nextState.errorMessage).toBe('')
        expect(nextState.searchText).toBe(action.payload.searchText)
    })

    it('should set errorMessage, loaderRunning to false and dataStoreAttrValueMap to {}', () => {
        const action = {
            type: SHOW_ERROR_MESSAGE,
            payload: {
                errorMessage: 'temp_errorMessage',
                dataStoreAttrValueMap: {}
            }
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.errorMessage).toBe(action.payload.errorMessage)
        expect(nextState.loaderRunning).toBe(false)
        expect(nextState.dataStoreAttrValueMap).toBe(action.payload.dataStoreAttrValueMap)
    })

    it('should set searchText', () => {
        const action = {
            type: SET_SEARCH_TEXT,
            payload: 'testSearchText'
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.searchText).toBe(action.payload)
        expect(nextState.errorMessage).toBe('')
    })

    it('should set detailsVisibleFor, and searchText', () => {
        const action = {
            type: SHOW_DETAILS,
            payload: 1,
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.detailsVisibleFor).toBe(action.payload)
    })

    it('should set initialState', () => {
        const action = {
            type: SET_INITIAL_STATE,
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })

    it('default case', () => {
        const action = {
            type: 'DEFAULT',
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState).toEqual(resultState)
    })

    it('should set errorMessage to empty, loaderRunning to true and dataStoreAttrValueMap to {}', () => {
        const action = {
            type: CLEAR_ATTR_MAP_AND_SET_LOADER,
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.dataStoreAttrValueMap).toEqual({})
        expect(nextState.errorMessage).toBe('')
        expect(nextState.loaderRunning).toBe(true)
    })

    it('should set isAutoStartScannerEnabled', () => {
        const action = {
            type: DISABLE_AUTO_START_SCANNER,
            payload: false
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.isAutoStartScannerEnabled).toBe(action.payload)
    })

    it('should set dataStoreAttrValueMap, cloneDataStoreAttrValueMap, searchText and loaderRunning to false', () => {
        const action = {
            type: SEARCH_DATA_STORE_RESULT,
            payload: {
                dataStoreAttrValueMap: {},
                cloneDataStoreAttrValueMap: {},
                searchText: 'temp'
            }
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.dataStoreAttrValueMap).toBe(action.payload.dataStoreAttrValueMap)
        expect(nextState.cloneDataStoreAttrValueMap).toBe(action.payload.cloneDataStoreAttrValueMap)
        expect(nextState.searchText).toBe(action.payload.searchText)
        expect(nextState.loaderRunning).toBe(false)
    })

    it('should set dataStoreAttrValueMap, isFiltersPresent, isScannerEnabled, isAutoStartScannerEnabled, isMinMaxValidation, isSearchEnabled and loaderRunning to false', () => {
        const action = {
            type: SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP,
            payload: {
                dataStoreAttrValueMap: {},
                isFiltersPresent: false,
                validation: {
                    isScannerEnabled: false,
                    isAutoStartScannerEnabled: false,
                    isSearchEnabled: false,
                    isMinMaxValidation: false,
                }
            }
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.dataStoreAttrValueMap).toBe(action.payload.dataStoreAttrValueMap)
        expect(nextState.isFiltersPresent).toBe(action.payload.isFiltersPresent)
        expect(nextState.isScannerEnabled).toBe(action.payload.validation.isScannerEnabled)
        expect(nextState.isAutoStartScannerEnabled).toBe(action.payload.validation.isAutoStartScannerEnabled)
        expect(nextState.isSearchEnabled).toBe(action.payload.validation.isSearchEnabled)
        expect(nextState.isMinMaxValidation).toBe(action.payload.validation.isMinMaxValidation)
        expect(nextState.loaderRunning).toBe(false)
    })
})
