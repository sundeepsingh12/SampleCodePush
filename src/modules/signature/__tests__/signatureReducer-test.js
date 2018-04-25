'use strict'
import {
    SET_FIELD_DATA_LIST,
} from '../../../lib/constants'

import signatureReducer from '../signatureReducer'

describe('signature reducer ', () => {

    it('it should set field data list', () => {
        const remarksList = 'test'
        const action = {
            type: SET_FIELD_DATA_LIST,
            payload: remarksList
        }
        let nextState = signatureReducer(undefined, action)
        expect(nextState.fieldDataList).toBe(remarksList)
    })
})