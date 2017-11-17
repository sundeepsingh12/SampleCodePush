
'use strict'


var actions = require('../selectFromListActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { selectFromListDataService } from '../../../services/classes/SelectFromListService'
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
import { CHECKBOX, RADIOBUTTON } from '../../../lib/AttributeConstants'
import { setState } from '../../global/globalActions'
import * as realm from '../../../repositories/realmdb'
import {jobDataService} from '../../../services/classes/JobData'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
ERROR_MESSAGE
} from '../../../lib/constants'

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

describe('getting DataForRadioMaster Action', () => {
    const fieldAttributeList = [
                {
                attributeTypeId:39,
                id:1,
                jobAttributeMasterId:30311,
                jobMasterId:3212,
                parentId:'123',
                },
                {
                attributeTypeId:40,
                id:2,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                },
                {
                attributeTypeId:41,
                id:3,
                jobAttributeMasterId:30309,
                jobMasterId:3212,
                parentId:1,
                }
            ]
        const  radioMasterDto =  [
                {
                attributeTypeId:40,
                id:2,
                jobAttributeMasterId:30310,
                },
                {
                attributeTypeId:41,
                id:3,
                jobAttributeMasterId:30309,
                },
            
            ]
        const  innerObject =  {
                0:{
                id:0,
                optionKey: "v",
                optionValue:'3',
                isChecked:true
                },
                1:{
                id:1,
                optionKey: "f",
                optionValue:'5',
                },
            
    }
    const parentIdJobDataListMap = {
             0 : [
                {
                attributeTypeId:40,
                id:2,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                value:"v"
                },
            ],
            1 : [
                {
                attributeTypeId:40,
                id:4,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                value:"f"
                },
            ]
    }
        const currentElement = {
                attributeTypeId:39,
                id:1,
                jobAttributeMasterId:30311,
                jobMasterId:3212,
                parentId:'123',
        }
    it('should set data for RadioMaster', () => {
        
        const jobId = '1234' 
        const selectDataForList = {}
        selectDataForList.radioMasterDto = radioMasterDto
        selectDataForList.selectListData = innerObject
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(fieldAttributeList)
        selectFromListDataService.getRadioForMasterDto = jest.fn()
        selectFromListDataService.getRadioForMasterDto.mockReturnValue(radioMasterDto)
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue({})
        jobDataService.getParentIdJobDataListMap = jest.fn()
        jobDataService.getParentIdJobDataListMap.mockReturnValue(parentIdJobDataListMap)
        selectFromListDataService.getListDataForRadioMasterAttr = jest.fn()
        selectFromListDataService.getListDataForRadioMasterAttr.mockReturnValue(innerObject)
        return store.dispatch(actions.gettingDataForRadioMaster(currentElement,jobId))
            .then(() => {
               expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
               expect(setState(SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE, selectDataForList)).toEqual({
                    type: SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE,
                    payload: selectDataForList
                })
            })
    })
    it('should set error throw when mapping mismatch', () => {
        const message = "Field Attributes missing in store"
        const expectedActions = [
            {
                type: ERROR_MESSAGE,
                payload: message
            },
        ]
        
        const jobId = '' 
        const selectDataForList = {}
        selectDataForList.radioMasterDto = radioMasterDto
        selectDataForList.selectListData = innerObject
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(fieldAttributeList)
        selectFromListDataService.getRadioForMasterDto = jest.fn()
        selectFromListDataService.getRadioForMasterDto.mockReturnValue(radioMasterDto)
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue({})
        jobDataService.getParentIdJobDataListMap = jest.fn()
        jobDataService.getParentIdJobDataListMap.mockReturnValue(parentIdJobDataListMap)
        selectFromListDataService.getListDataForRadioMasterAttr = jest.fn()
        selectFromListDataService.getListDataForRadioMasterAttr.mockReturnValue(innerObject)
        return store.dispatch(actions.gettingDataForRadioMaster(currentElement,jobId))
            .then(() => {
               expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

})
describe('Error actions', () => {
    it('should set error message', () => {
        const message = 'Field Attributes missing in store'
        expect(actions._setErrorMessage(message)).toEqual({
            type: ERROR_MESSAGE,
            payload: message
        })
    })
})
