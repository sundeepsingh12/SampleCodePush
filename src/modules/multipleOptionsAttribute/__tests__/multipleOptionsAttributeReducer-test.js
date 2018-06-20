'use strict'

import {
    SET_OPTIONS_LIST,
    RESET_STATE,
    SET_OPTION_ATTRIBUTE_ERROR,
    SET_OPTION_SEARCH_INPUT,
    SET_ADV_DROPDOWN_MESSAGE_OBJECT,
    SET_ERROR_AND_ADV_DROPDOWN_MESSAGE_NULL
} from '../../../lib/constants'

import multipleOptionsAttributeReducer from '../multipleOptionsAttributeReducer'

describe('SET_OPTIONS_LIST', () => {
    it('should set options list', () => {
        const action = {
            type: SET_OPTIONS_LIST,
            payload: {
                optionsMap: {
                    1: {
                        value: 'xyz',
                        code: 'xyz'
                    }
                }
            }
        }
        let nextState = multipleOptionsAttributeReducer(undefined, action)
        expect(nextState.optionsMap).toBe(action.payload.optionsMap)
        expect(nextState.searchInput).toBe(null)
    })
})

describe('SET_OPTION_ATTRIBUTE_ERROR', () => {
    it('should set option error', () => {
        const action = {
            type: SET_OPTION_ATTRIBUTE_ERROR,
            payload: {
                error: 'test error'
            }
        }
        let nextState = multipleOptionsAttributeReducer(undefined, action)
        expect(nextState.error).toBe(action.payload.error)
    })
})

describe('SET_OPTION_SEARCH_INPUT', () => {
    it('should set option search input', () => {
        const action = {
            type: SET_OPTION_SEARCH_INPUT,
            payload: {
                searchInput: 'test search'
            }
        }
        let nextState = multipleOptionsAttributeReducer(undefined, action)
        expect(nextState.searchInput).toBe(action.payload.searchInput)
    })
})

describe('SET_ADV_DROPDOWN_MESSAGE_OBJECT', () => {
    it('should set advance dropdown object', () => {
        const action = {
            type: SET_ADV_DROPDOWN_MESSAGE_OBJECT,
            payload: {
                value: 'test value',
                code: 'test code'
            }
        }
        let nextState = multipleOptionsAttributeReducer(undefined, action)
        expect(nextState.advanceDropdownMessageObject).toBe(action.payload)
    })
})

describe('SET_ERROR_AND_ADV_DROPDOWN_MESSAGE_NULL', () => {
    it('should set advance dropdown error and dropdown message', () => {
        const action = {
            type: SET_ERROR_AND_ADV_DROPDOWN_MESSAGE_NULL
        }
        let nextState = multipleOptionsAttributeReducer(undefined, action)
        expect(nextState.error).toBe(null)
        expect(nextState.advanceDropdownMessageObject).toEqual({})
    })
})

describe('RESET_STATE', () => {
    it('should reset state to initial state', () => {
        const action = {
            type: RESET_STATE
        }
        let nextState = multipleOptionsAttributeReducer(undefined, action)
        expect(nextState.optionsMap).toEqual({})
        expect(nextState.error).toBe(null)
        expect(nextState.searchInput).toBe(null)
        expect(nextState.advanceDropdownMessageObject).toEqual({})
    })
})

describe('undefined case ', () => {
    it('should return state without any change', () => {
        const action = {
            type: 'XYZ'
        }
        let nextState = multipleOptionsAttributeReducer(undefined, action)
        expect(nextState.optionsMap).toEqual({})
        expect(nextState.error).toBe(null)
        expect(nextState.searchInput).toBe(null)
        expect(nextState.advanceDropdownMessageObject).toEqual({})
    })
})