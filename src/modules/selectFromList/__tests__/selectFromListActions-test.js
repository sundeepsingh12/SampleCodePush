
'use strict'


var actions = require('../selectFromListActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { selectFromListDataService } from '../../../services/classes/selectFromListService'
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
import { CHECKBOX, RADIOBUTTON } from '../../../lib/AttributeConstants'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
jest.mock('react-native-router-flux')

const {
SET_VALUE_IN_CHECKBOX
} = require('../../../lib/constants').default

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('selectFromListActions', () => {

    it('should dispatch action', () => {
        let platform = {
            id: 80,
            code: 122,
        }
        expect(actions.actionDispatch(platform)).toEqual({
            type: SET_VALUE_IN_CHECKBOX,
            payload: platform
        })
    })

    it('should set or remove values from state', () => {
        let platform = {
            id: 80,
            code: 122,
        }
        const store = mockStore({})
        selectFromListDataService.setOrRemoveState = jest.fn()
        selectFromListDataService.setOrRemoveState.mockReturnValue({ checkBoxValues: 'testToken' })
        return store.dispatch(actions.setOrRemoveStates())
            .then(() => {
                expect(actions.actionDispatch(platform)).toEqual({
                    type: SET_VALUE_IN_CHECKBOX,
                    payload: platform
                })
            })
    })

    it('should set or remove values from state after DONE button clicked', () => {
        let platform = {
            id: 80,
            code: 122,
        }
        const store = mockStore({})
        selectFromListDataService.checkBoxDoneButtonClicked = jest.fn()
        selectFromListDataService.checkBoxDoneButtonClicked.mockReturnValue({ checkBoxValues: 'testToken' })
        selectFromListDataService.prepareFieldDataForTransactionSavingInState = jest.fn()
        selectFromListDataService.prepareFieldDataForTransactionSavingInState.mockReturnValue({fieldDataListData: 'test'})
        return store.dispatch(actions.checkBoxButtonDone())
            .then(() => {
                expect(actions.actionDispatch(platform)).toEqual({
                    type: SET_VALUE_IN_CHECKBOX,
                    payload: platform
                })
            })
    })

it('should set all checkBoxData', () => {
        let platform = {
            id: 80,
            code: 122,
        }
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({wholeDataFromMaster: 'testToken' })
        selectFromListDataService.getcheckBoxDataList = jest.fn()
        selectFromListDataService.getcheckBoxDataList.mockReturnValue({checkBoxDataList: 'tests'})
        return store.dispatch(actions.getCheckBoxData())
            .then(() => {
                expect(actions.actionDispatch(platform)).toEqual({
                    type: SET_VALUE_IN_CHECKBOX,
                    payload: platform
                })
            })
    })

})

