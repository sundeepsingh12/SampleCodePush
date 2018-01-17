'use strict'


import {
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
    ERROR_MESSAGE,
    INPUT_TEXT_VALUE,
    SELECTFROMLIST_ITEMS_LENGTH,
    SET_FILTERED_DATA_SELECTFROMLIST,
    RESET_STATE
} from '../../../lib/constants'

const InitialState = require('../selectFromListInitialState').default
import selectFromListReducer from '../selectFromListReducer'
const initialState = new InitialState()

describe('selectFromList Reducer ', () => {

    let selectFromListValues = {
        1: {
            isChecked: false,
            id: 1,
            attributeTypeId: 8,
        },
        2: {
            isChecked: false,
            id: 2,
            attributeTypeId: 8,
        },
        3: {
            isChecked: false,
            id: 3,
            attributeTypeId: 8,
        }
    }

    it('should set return initial state', () => {
        const action = {
            type: 'DEFAULT',
        }
        const result = new InitialState()
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState).toEqual(result)
    })

    it('should set return initial state', () => {
        const action = {
            type: 'DEFAULT',
            payload: selectFromListValues,
        }
        const result = new InitialState()
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState).toEqual(result)
    })

    it('should set values of checkBox/RadioButton', () => {
        const payload = {
            id: 90,
            code: 123
        }

        const action = {
            type: SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
            payload: payload
        }
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState.selectFromListState).toBe(payload)
    })

    it('it should set field data list', () => {
        const message = 'mapping of radioForMaster error'
        const action = {
            type: ERROR_MESSAGE,
            payload: message
        }
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState.errorMessage).toBe(message)
    })

    it('it should set input text value', () => {
        const message = 'mapping of radioForMaster error'
        const action = {
            type: INPUT_TEXT_VALUE,
            payload: message
        }
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState.searchBarInputText).toBe(message)
    })

    it('it should set length of the selectFromList Data in boolean form ', () => {
        const message = 0
        const action = {
            type: SELECTFROMLIST_ITEMS_LENGTH,
            payload: message
        }
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState.totalItemsInSelectFromList).toBe(message)
    })

    it('it should set filtered Data in selectfrom list', () => {
        const payload = {
            id: 90,
            code: 123
        }
        const action = {
            type: SET_FILTERED_DATA_SELECTFROMLIST,
            payload: payload
        }
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState.filteredDataSelectFromList).toBe(payload)
    })

    it('it reset the state', () => {
        const action = {
            type: RESET_STATE,
        }
        let nextState = selectFromListReducer(undefined, action)
        expect(initialState).toBe(initialState)
    })
})