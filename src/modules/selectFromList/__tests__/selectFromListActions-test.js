
'use strict'


var actions = require('../selectFromListActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { selectFromListDataService } from '../../../services/classes/SelectFromListService'
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
import { CHECKBOX, RADIOBUTTON } from '../../../lib/AttributeConstants'
import { setState } from '../../global/globalActions'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const {
SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE
} = require('../../../lib/constants').default

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('selectFromListActions', () => {

    it('should dispatch action', () => {
        let platform = {
            id: 80,
            code: 4322,
        }
        expect(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, platform)).toEqual({
            type: SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
            payload: platform
        })
    })
})

describe('selectFromListActions  setOrRemoveStates', () => {

    it('should set or remove values from state', () => {
        let platform = {
            id: 830,
            code: 122,
        }
        const store = mockStore({})
        selectFromListDataService.setOrRemoveState = jest.fn()
        selectFromListDataService.setOrRemoveState.mockReturnValue({ selectFromListState: 'testToken' })
        return store.dispatch(actions.setOrRemoveStates())
            .then(() => {
                expect(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, platform)).toEqual({
                    type: SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
                    payload: platform
                })
            })
    })
})

describe('selectFromListActions  selectFromListButton', () => {

    it('should set or remove values from state after DONE button clicked', () => {
        let platform = {
            id: 8990,
            code: 32,
        }
        const store = mockStore({})
        selectFromListDataService.selectFromListDoneButtonClicked = jest.fn()
        selectFromListDataService.selectFromListDoneButtonClicked.mockReturnValue({ selectFromListState: 'testToken' })
        selectFromListDataService.prepareFieldDataForTransactionSavingInState = jest.fn()
        selectFromListDataService.prepareFieldDataForTransactionSavingInState.mockReturnValue({ fieldDataListData: 'test' })
        return store.dispatch(actions.selectFromListButton())
            .then(() => {
                expect(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, platform)).toEqual({
                    type: SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
                    payload: platform
                })
            })
    })
})

describe('selectFromListActions  gettingDataSelectFromList', () => {
    it('should set all selectFromListData', () => {
        let platform = {
            id: 4580,
            code: 12,
        }
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({ wholeDataFromMaster: 'testToken' })
        selectFromListDataService.getListSelectFromListAttribute = jest.fn()
        selectFromListDataService.getListSelectFromListAttribute.mockReturnValue({ selectFromListData: 'tests' })
        return store.dispatch(actions.gettingDataSelectFromList())
            .then(() => {
                expect(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, platform)).toEqual({
                    type: SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
                    payload: platform
                })
            })
    })

})

