'use strict'


const {
    SET_VALUE_IN_CHECKBOX,
} = require('../../../lib/constants').default

const InitialState = require('../checkBoxInitialState').default
import checkBoxReducer from '../checkBoxReducer'

describe('checkBox Reducer ', () => {

    it('should set return initial state', () => {
        const action = {
            type: 'DEFAULT',
        }
        const result = new InitialState()
        let nextState = checkBoxReducer(undefined, action)
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
        let nextState = checkBoxReducer(undefined, action)
        expect(nextState.checkBoxValues).toBe(payload)
    })
})