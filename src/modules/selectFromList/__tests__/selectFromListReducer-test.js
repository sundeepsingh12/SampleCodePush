'use strict'


const {
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
    ERROR_MESSAGE
} = require('../../../lib/constants').default

const InitialState = require('../selectFromListInitialState').default
import selectFromListReducer from '../selectFromListReducer'

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
})