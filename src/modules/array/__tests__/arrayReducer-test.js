'use strict'
import {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_ERROR_MSG,
    CLEAR_ARRAY_STATE
} from '../../../lib/constants'

import arrayReducer from '../arrayReducer'

describe('array reducer ', () => {

    it('it should set array child data list', () => {
        const childList = {
            childElementsTemplate: 'test',
            arrayRowDTO: {
                arrayElements: '',
                lastRowId: 1,
                isSaveDisabled: true
            }
        }
        const action = {
            type: SET_ARRAY_CHILD_LIST,
            payload: childList
        }
        let nextState = arrayReducer(undefined, action)
        expect(nextState.childElementsTemplate).toBe(childList.childElementsTemplate)
        expect(nextState.arrayElements).toBe(childList.arrayRowDTO.arrayElements)
        expect(nextState.lastRowId).toBe(childList.arrayRowDTO.lastRowId)
        expect(nextState.isSaveDisabled).toBe(childList.arrayRowDTO.isSaveDisabled)
        expect(nextState.errorMessage).toBe('')
    })
    it('it should set new array elements', () => {
        const arrayElements = ''
        const lastRowId = 1
        const isSaveDisabled = true
        const action = {
            type: SET_NEW_ARRAY_ROW,
            payload: { arrayElements, lastRowId, isSaveDisabled }
        }
        let nextState = arrayReducer(undefined, action)
        expect(nextState.arrayElements).toBe(arrayElements)
        expect(nextState.lastRowId).toBe(lastRowId)
        expect(nextState.isSaveDisabled).toBe(isSaveDisabled)
        expect(nextState.errorMessage).toBe('')
    })
    it('it should set array elements and isSaveDisabled', () => {
        const newArrayElements = 'test'
        const isSaveDisabled = true
        const action = {
            type: SET_ARRAY_ELEMENTS,
            payload: {
                newArrayElements, isSaveDisabled
            }
        }
        let nextState = arrayReducer(undefined, action)
        expect(nextState.arrayElements).toBe(newArrayElements)
        expect(nextState.isSaveDisabled).toBe(isSaveDisabled)
        expect(nextState.errorMessage).toBe('')
    })
    it('it should return initial state', () => {
        const initialState = {
            isSaveDisabled: true,
            arrayElements: {},
            isLoading: false,
            lastRowId: 0,
            childElementsTemplate: {},
            errorMessage: ''
        }
        const action = CLEAR_ARRAY_STATE
        let nextState = arrayReducer(undefined, action)
        expect(nextState.arrayElements).toEqual(initialState.arrayElements)
        expect(nextState.lastRowId).toBe(initialState.lastRowId)
        expect(nextState.isSaveDisabled).toBe(initialState.isSaveDisabled)
        expect(nextState.isLoading).toBe(initialState.isLoading)
        expect(nextState.childElementsTemplate).toEqual(initialState.childElementsTemplate)
        expect(nextState.errorMessage).toBe(initialState.errorMessage)
    })
    it('it should set error message', () => {
        const errorMessage = 'test'
        const action = {
            type: SET_ERROR_MSG,
            payload: errorMessage
        }
        let nextState = arrayReducer(undefined, action)
        expect(nextState.errorMessage).toBe(errorMessage)
    })
})
