'use strict'
var actions = require('../formLayoutActions')

const {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    IS_LOADING,
    DISABLE_SAVE,
    BASIC_INFO,
    UPDATE_FIELD_DATA,
    TOOGLE_HELP_TEXT,
    Home,
    ERROR_MESSAGE
} = require('../../../lib/constants').default

import {formLayoutService} from '../../../services/classes/formLayout/FormLayout.js'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import {formLayoutEventsInterface} from '../../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const formLayoutObject = {
    1: {
        label : "rr",
        subLabel : "d",
        helpText : "d",
        key : "d",
        required:true,
        hidden:false,
        attributeTypeId:1,
        fieldAttributeMasterId : 1,
        positionId : 0,
        parentId : 0,
        showHelpText : false,
        editable : false,
        focus : false,
        validation : [],
        sequenceMasterId :null,
    },
    2 : {
        label : "ds",
        subLabel : "d",
        helpText : "w",
        key : "dd",
        required:true,
        hidden:true,
        attributeTypeId:1,
        fieldAttributeMasterId : 2,
        positionId : 0,
        parentId : 0,
        showHelpText : true,
        editable : false,
        focus : false,
        validation : [],
        sequenceMasterId : null,
    },
    3 : {
        label : "ds",
        subLabel : "d",
        helpText : "w",
        key : "dd",
        required:true,
        hidden:true,
        attributeTypeId:62,
        fieldAttributeMasterId : 3,
        positionId : 0,
        parentId : 0,
        showHelpText : true,
        editable : false,
        focus : false,
        validation : [],
        sequenceMasterId : 4,
    },
    4   : {
        label : "dt",
        subLabel : "s",
        helpText : "w",
        key : "qd",
        required:true,
        hidden:true,
        attributeTypeId:62,
        fieldAttributeMasterId : 4,
        positionId : 0,
        parentId : 0,
        showHelpText : true,
        editable : false,
        focus : false,
        validation : [],
        sequenceMasterId : 4,
    }
}
const formElement = {
    7831 : {
        label : "ds",
        subLabel : "d",
        helpText : "w",
        key : "dd",
        required:true,
        hidden:true,
        attributeTypeId:62,
        fieldAttributeMasterId : 7831,
        positionId : 0,
        parentId : 0,
        showHelpText : true,
        editable : false,
        focus : false,
        validation : [],
        sequenceMasterId : 4,
    },
    7830 : {
        label : "dt",
        subLabel : "s",
        helpText : "w",
        key : "qd",
        required:true,
        hidden:true,
        attributeTypeId:62,
        fieldAttributeMasterId : 7830,
        positionId : 0,
        parentId : 0,
        showHelpText : true,
        editable : false,
        focus : false,
        validation : [],
        sequenceMasterId : 4,
    }


}

const nextEditable = {
    "1": ['required$$1','required$$2', 'required$$3','']
}
const nextEditables= {
    "1" : ['required$$4','']
}
const latestPositionId = 2;
const isSaveDisabled = true;
const formLayoutMap = getMapFromObject(formLayoutObject);
const formElements = getMapFromObject(formElement)
const formLayoutInitialState = {formLayoutMap,nextEditable,latestPositionId,isSaveDisabled};

describe('formLayout actions for reducer', () => {
    it('should set save to false', () => {
        const isSaveDisabled = false;
        expect(actions._disableSave(isSaveDisabled)).toEqual({
            type: DISABLE_SAVE,
            payload: isSaveDisabled
        })
    })

    it('should set save to true', () => {
        const isSaveDisabled = true;
        expect(actions._disableSave(isSaveDisabled)).toEqual({
            type: DISABLE_SAVE,
            payload: isSaveDisabled
        })
    })

    it('should set save to undefined', () => {
        const isSaveDisabled = undefined;
        expect(actions._disableSave(isSaveDisabled)).toEqual({
            type: DISABLE_SAVE,
            payload: isSaveDisabled
        })
    })

    it('should set basic info',()=>{
        const statusId = 1,statusName = "success",jobTransactionId = 1234,latestPositionId = 2;
        expect(actions._setBasicInfo(statusId,statusName,jobTransactionId,latestPositionId)).toEqual({
            type : BASIC_INFO,
            payload : {
                statusId,
                statusName,
                jobTransactionId,
                latestPositionId
            }
        })
    })

    it('should set form initial state', ()=>{
        expect(actions._setFormList(formLayoutInitialState)).toEqual({
            type : GET_SORTED_ROOT_FIELD_ATTRIBUTES,
            payload : formLayoutInitialState
        });
    })

    it('should update field data', ()=>{
        expect(actions._updateFieldData(formLayoutMap)).toEqual({
            type : UPDATE_FIELD_DATA,
            payload : formLayoutMap
        });
    })

    it('should update field data', ()=>{
        expect(actions._updateFieldData(undefined)).toEqual({
            type : UPDATE_FIELD_DATA,
            payload : undefined
        });
    })

    it('should toogle help text', ()=>{
        expect(actions._toogleHelpText(formLayoutMap)).toEqual({
            type : TOOGLE_HELP_TEXT,
            payload : formLayoutMap
        });
    })

    it('should toogle help text', ()=>{
        expect(actions._toogleHelpText(undefined)).toEqual({
            type : TOOGLE_HELP_TEXT,
            payload : undefined
        });
    })

    it('should toogle loader', ()=>{
        expect(actions._toogleLoader(true)).toEqual({
            type : IS_LOADING,
            payload : true
        });
    })

    it('should toogle loader', ()=>{
        expect(actions._toogleLoader(false)).toEqual({
            type : IS_LOADING,
            payload : false
        });
    })

    it('should toogle loader', ()=>{
        expect(actions._toogleLoader(undefined)).toEqual({
            type : IS_LOADING,
            payload : undefined
        });
    })
})

describe('test form layout events', ()=>{
    const statusId = 1;
    const statusName = 'success'
    const jobTransactionId = 1234
    const expectedActions = [
        {
            type: IS_LOADING,
            payload: true
        },
        {
            type : GET_SORTED_ROOT_FIELD_ATTRIBUTES,
            payload :formLayoutInitialState
        },
        {
            type : BASIC_INFO,
            payload : {
                statusId : 1,
                statusName : 'success',
                jobTransactionId : 1234,
                latestPositionId : 2
            }
        },
        {
            type: IS_LOADING,
            payload: false
        }
    ]
    it('should find root field attributes in sorted order and set initial state of form element', () => {
        formLayoutService.getSequenceWiseRootFieldAttributes = jest.fn()
        formLayoutService.getSequenceWiseRootFieldAttributes.mockReturnValue(formLayoutInitialState);
        const store = mockStore({})
        return store.dispatch(actions.getSortedRootFieldAttributes(statusId,statusName,jobTransactionId))
            .then(() =>{
                expect(formLayoutService.getSequenceWiseRootFieldAttributes).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[2].payload)
                expect(store.getActions()[3].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[3].payload).toEqual(expectedActions[3].payload)
            })
    })

    it('should find next editable and focusable element and update field data db if required', ()=>{
        formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
        formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValue(formLayoutInitialState);
        const store = mockStore({})
        return store.dispatch(actions.getNextFocusableAndEditableElements())
            .then(()=>{
                expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })        

    })
    

    it('should disable save if required', ()=>{
        formLayoutEventsInterface.disableSaveIfRequired = jest.fn();
        formLayoutEventsInterface.disableSaveIfRequired.mockReturnValue(true);
        const store = mockStore({})
        return  store.dispatch(actions.disableSaveIfRequired())
            .then(()=>{
                expect(formLayoutEventsInterface.disableSaveIfRequired).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(DISABLE_SAVE)
                expect(store.getActions()[0].payload).toEqual(true)
            })
    })

    it('should enable save if required', ()=>{
        formLayoutEventsInterface.disableSaveIfRequired = jest.fn();
        formLayoutEventsInterface.disableSaveIfRequired.mockReturnValue(false); // test for false and undefined conditions
        const store = mockStore({})
        return  store.dispatch(actions.disableSaveIfRequired())
            .then(()=>{
                expect(formLayoutEventsInterface.disableSaveIfRequired).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(DISABLE_SAVE)
                expect(store.getActions()[0].payload).toEqual(false)
            })
    })

    it('should update field data',()=>{
        formLayoutEventsInterface.updateFieldData = jest.fn();
        formLayoutEventsInterface.updateFieldData.mockReturnValue(formLayoutMap);
        const store = mockStore({})
        return store.dispatch(actions.updateFieldData(1,"d",formLayoutMap))
            .then(()=>{
                expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(UPDATE_FIELD_DATA)
                expect(store.getActions()[0].payload).toEqual(formLayoutMap);
            })
    })

    it('it should toogle help text', ()=>{
        formLayoutEventsInterface.toogleHelpText = jest.fn();
        formLayoutEventsInterface.toogleHelpText.mockReturnValue(formLayoutMap);
        const store = mockStore({})
        return store.dispatch(actions.toogleHelpText(1,formLayoutMap))
            .then(()=>{
                expect(formLayoutEventsInterface.toogleHelpText).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(TOOGLE_HELP_TEXT)
                expect(store.getActions()[0].payload).toEqual(formLayoutMap)
            })
    })

    it('it should save job transaction in db and add to sync list', ()=>{
        formLayoutEventsInterface.saveDataInDb = jest.fn();
        formLayoutEventsInterface.addTransactionsToSyncList = jest.fn();
        NavigationActions.navigate = jest.fn();
        NavigationActions.navigate.mockReturnValue(Home);
        const store = mockStore({})
        return store.dispatch(actions.saveJobTransaction(formLayoutMap,1234,1))
            .then(()=>{
                expect(formLayoutEventsInterface.saveDataInDb).toHaveBeenCalledTimes(1)
                expect(formLayoutEventsInterface.addTransactionsToSyncList).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(IS_LOADING)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(IS_LOADING)
                expect(store.getActions()[1].payload).toEqual(false)
                // expect(store.getActions()[2].type).toEqual(Home)
            })
    })
})

describe('test form sequence field attribute', ()=>{
    const message = "Cannot read property 'get' of undefined"
    const expectedActions = [
        {
            type: UPDATE_FIELD_DATA,
            payload: formElements
        },
        {
            type : GET_SORTED_ROOT_FIELD_ATTRIBUTES,
            payload :formLayoutInitialState
        },
        {
            type : ERROR_MESSAGE,
            payload : message
        },
        {
            type: IS_LOADING,
            payload: false
        }
    ]
    it('should not get sequence data and throw error', ()=>{
            formLayoutEventsInterface.getSequenceData = jest.fn()
            formLayoutEventsInterface.getSequenceData.mockReturnValue({});
            try {
                actions.setSequenceDataAndNextFocus()
            }catch(error) {
                expect(error.message).toEqual(message)
            }

        })
         it('should get sequence data and  and throw error', ()=>{
            formLayoutEventsInterface.getSequenceData = jest.fn()
            formLayoutEventsInterface.getSequenceData.mockReturnValue(4);
            formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
            formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValue('7831',formElements,nextEditables,isSaveDisabled,'1.0',null,'ON_BLUR');
            const store = mockStore({})
            return store.dispatch(actions.setSequenceDataAndNextFocus('7831',formElements,nextEditables,isSaveDisabled,'4'))
                .then(()=>{
                    console.log("dgss",store.getActions())
                    expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
                    expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
                    expect(store.getActions()[0].type).toEqual(expectedActions[2].type)
                    expect(store.getActions()[0].payload).toEqual(expectedActions[2].payload)
                    expect(store.getActions()[1].type).toEqual(expectedActions[0].type)
                    expect(store.getActions()[1].payload).toEqual(expectedActions[0].payload)

        })})
                 it('should get sequence data and  find next editable and focusable element', ()=>{
            formLayoutEventsInterface.getSequenceData = jest.fn()
            formLayoutEventsInterface.getSequenceData.mockReturnValue(4);
            formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
            formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValue('4',formLayoutMap,nextEditables,isSaveDisabled,'1.0',null,'ON_BLUR');
            const store = mockStore({})
            return store.dispatch(actions.setSequenceDataAndNextFocus('4',formLayoutMap,nextEditable,isSaveDisabled,'4'))
                .then(()=>{
                    console.log("dgss",store.getActions())
                    expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
                    expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
                    expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                    expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)

        })})
})

function getMapFromObject(obj){
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}