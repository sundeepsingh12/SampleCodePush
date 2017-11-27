'use strict'
import {
    SORTING_SEARCH_VALUE,
    SORTING_ITEM_DETAILS,
    SHOW_LOADER,
    ERROR_MESSAGE
} from '../../../lib/constants'

import sortingReducer from '../sortingReducer'

describe('sortingReducer ', () => {

    it('it should set sorting data', () => {
        const dataList = 'test'
        const action = {
            type: SORTING_ITEM_DETAILS,
            payload: dataList
        }
        let nextState = sortingReducer(undefined, action)
        expect(nextState.sortingDetails).toBe(dataList)
        expect(nextState.searchRefereneceValue).toBe('')
        expect(nextState.loaderRunning).toBe(false)
    })
    it('it should set search value', () => {
        const dataList = '123'
        const action = {
            type: SORTING_SEARCH_VALUE,
            payload: dataList
        }
        let nextState = sortingReducer(undefined, action)
        expect(nextState.searchRefereneceValue).toBe(dataList)
    })
    it('it should show loader', () => {
        const dataList = true
        const details = {}
        const action = {
            type: SHOW_LOADER,
            payload: dataList
        }
        let nextState = sortingReducer(undefined, action)
        expect(nextState.loaderRunning).toBe(dataList)
        expect(nextState.sortingDetails).toEqual(details)
    })
    it('it should show Error-Message', () => {
        const message = 'test'
        const action = {
            type: ERROR_MESSAGE,
            payload: message
        }
        let nextState = sortingReducer(undefined, action)
        expect(nextState.errorMessage).toBe(message)
        expect(nextState.loaderRunning).toBe(false)
        expect(nextState.searchRefereneceValue).toBe('')
    })
})