'use strict'


const {
    SET_VALUE_IN_CHECKBOX,
} = require('../../../lib/constants').default

const InitialState = require('../selectFromListInitialState').default
import selectFromListReducer from '../selectFromListReducer'

describe('checkBox Reducer ', () => {

    it('should set return initial state', () => {
        const action = {
            type: 'DEFAULT',
        }
        const result = new InitialState()
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState).toEqual(result)
    })

    it('should set values of checkBox/RadioButton', () => {
        const payload = {
            id:90,
            code: 123
        }
        
        const action = {
            type: SET_VALUE_IN_CHECKBOX,
            payload: payload
        }
        let nextState = selectFromListReducer(undefined, action)
        expect(nextState.checkBoxValues).toBe(payload)
    })
})