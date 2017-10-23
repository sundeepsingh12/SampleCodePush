'use strict'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
var actions = require('../signatureActions')
const {
    SET_FIELD_DATA_LIST,
    SAVE_SIGNATURE,
    USER,
    FormLayout
} = require('../../../lib/constants').default
import { signatureService } from '../../../services/classes/SignatureRemarks'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
jest.mock('react-native-router-flux')

describe('signature actions', () => {
    it('should set field data list', () => {
        const fieldDataList = 'this is field data list object'
        expect(actions.setFieldDataList(fieldDataList)).toEqual({
            type: SET_FIELD_DATA_LIST,
            payload: fieldDataList
        })
    })
    it('filters remarks list and set in field data list', () => {
        const remarksList= [
            {
                label: 'hi',
                value: 'hello'
            }
        ]
        const expectedActions = [
            {
                type: SET_FIELD_DATA_LIST,
                payload: remarksList
            },
        ]
        signatureService.filterRemarksList = jest.fn()
        signatureService.filterRemarksList.mockReturnValue(remarksList)
        const store = mockStore({})
        return store.dispatch(actions.getRemarksList(remarksList))
            .then(() => {
                expect(signatureService.filterRemarksList).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
}
)    