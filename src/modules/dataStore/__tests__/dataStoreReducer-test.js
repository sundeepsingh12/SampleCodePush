'use strict'

import dataStoreReducer from '../dataStoreReducer'

const {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER,
    SHOW_ERROR_MESSAGE,
    SET_SEARCH_TEXT,
    SHOW_DETAILS
} = require('../../../lib/constants').default

describe('data Store reducer', () => {

    it('should set loaderRunning to true and errorMessage to empty', () => {
        const action = {
            type: SHOW_LOADER,
            payload: true
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.loaderRunning).toBe(action.payload)
        expect(nextState.errorMessage).toBe('')
    })

    it('should set all Validations', () => {
        const action = {
            type: SET_VALIDATIONS,
            payload: {
                isScannerEnabled: true,
                isAutoStartScannerEnabled: false,
                isAllowFromField: true,
                isSearchEnabled: false
            }
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.isScannerEnabled).toBe(action.payload.isScannerEnabled)
        expect(nextState.isAutoStartScannerEnabled).toBe(action.payload.isAutoStartScannerEnabled)
        expect(nextState.isAllowFromField).toBe(action.payload.isAllowFromField)
        expect(nextState.isSearchEnabled).toBe(action.payload.isSearchEnabled)
    })

    it('should set dataStoreAttrValueMap, loaderRunning to false and errorMessage to empty', () => {
        const action = {
            type: SET_DATA_STORE_ATTR_MAP,
            payload: {
                matchKey: 'name',
                uniqueKey: 'contact',
                dataStoreAttributeValueMap: {
                    name: 'temp_name',
                    contact: 'temp_contact'
                }
            }
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.dataStoreAttrValueMap).toBe(action.payload)
        expect(nextState.loaderRunning).toBe(false)
        expect(nextState.errorMessage).toBe('')
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
    })

    it('should set detailsVisibleFor, and searchText', () => {
        const action = {
            type: SHOW_DETAILS,
            payload: {
                itemId: 1,
                searchText: 'temp_searchText'
            }
        }
        let nextState = dataStoreReducer(undefined, action)
        expect(nextState.detailsVisibleFor).toBe(action.payload.itemId)
        expect(nextState.searchText).toBe(action.payload.searchText)
    })
})
