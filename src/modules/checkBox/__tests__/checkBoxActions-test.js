
'use strict'


var actions = require('../checkBoxActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { checkBoxDataService } from '../../../services/classes/CheckBoxService'
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

describe('checkBoxActions', () => {

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
        checkBoxDataService.setOrRemoveState = jest.fn()
        checkBoxDataService.setOrRemoveState.mockReturnValue({ checkBoxValues: 'testToken' })
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
        checkBoxDataService.checkBoxDoneButtonClicked = jest.fn()
        checkBoxDataService.checkBoxDoneButtonClicked.mockReturnValue({ checkBoxValues: 'testToken' })
        checkBoxDataService.prepareFieldDataForTransactionSavingInState = jest.fn()
        checkBoxDataService.prepareFieldDataForTransactionSavingInState.mockReturnValue({fieldDataListData: 'test'})
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
        checkBoxDataService.getcheckBoxDataList = jest.fn()
        checkBoxDataService.getcheckBoxDataList.mockReturnValue({checkBoxDataList: 'tests'})
        return store.dispatch(actions.getCheckBoxData())
            .then(() => {
                expect(actions.actionDispatch(platform)).toEqual({
                    type: SET_VALUE_IN_CHECKBOX,
                    payload: platform
                })
            })
    })

})

