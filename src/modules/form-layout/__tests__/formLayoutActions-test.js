'use strict'
var actions = require('../formLayoutActions')

import {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    IS_LOADING,
    BASIC_INFO,
    UPDATE_FIELD_DATA,
    Home,
    ERROR_MESSAGE,
    SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT
} from '../../../lib/constants'

import { formLayoutService } from '../../../services/classes/formLayout/FormLayout.js'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { formLayoutEventsInterface } from '../../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import { draftService } from '../../../services/classes/DraftService.js'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const formLayoutObject = {
    1: {
        label: "rr",
        subLabel: "d",
        helpText: "d",
        key: "d",
        required: true,
        hidden: false,
        attributeTypeId: 1,
        fieldAttributeMasterId: 1,
        positionId: 0,
        parentId: 0,
        showHelpText: false,
        editable: false,
        focus: false,
        validation: [],
        sequenceMasterId: null,
    },
    2: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "dd",
        required: true,
        hidden: true,
        attributeTypeId: 1,
        fieldAttributeMasterId: 2,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        sequenceMasterId: null,
    },
    3: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "dd",
        required: true,
        hidden: true,
        attributeTypeId: 62,
        fieldAttributeMasterId: 3,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        sequenceMasterId: 4,
    },
    4: {
        label: "dt",
        subLabel: "s",
        helpText: "w",
        key: "qd",
        required: true,
        hidden: true,
        attributeTypeId: 62,
        fieldAttributeMasterId: 4,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        sequenceMasterId: 4,
    }
}
const formElement = {
    7831: {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "dd",
        required: true,
        hidden: true,
        attributeTypeId: 62,
        fieldAttributeMasterId: 7831,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        sequenceMasterId: 4,
    },
    7830: {
        label: "dt",
        subLabel: "s",
        helpText: "w",
        key: "qd",
        required: true,
        hidden: true,
        attributeTypeId: 62,
        fieldAttributeMasterId: 7830,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: [],
        sequenceMasterId: 4,
    }


}

const latestPositionId = 2;
const isSaveDisabled = true;
const formLayoutMap = getMapFromObject(formLayoutObject);
const formElements = getMapFromObject(formElement)
const formLayoutInitialState = { formLayoutMap, latestPositionId, isSaveDisabled };


describe('test form layout events', () => {
    const statusId = 1;
    const statusName = 'success'
    const jobTransactionId = 1234
    const expectedActions = [
        {
            type: IS_LOADING,
            payload: true
        },
        {
            type: SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
            payload: formLayoutInitialState
        },
        {
            type: GET_SORTED_ROOT_FIELD_ATTRIBUTES,
            payload: { formLayoutObject: formLayoutInitialState, isSaveDisabled }
        }
    ]
    it('should find root field attributes in sorted order and set initial state of form element', () => {
        formLayoutService.getSequenceWiseRootFieldAttributes = jest.fn()
        formLayoutService.getSequenceWiseRootFieldAttributes.mockReturnValue(formLayoutInitialState);
        const store = mockStore({})
        return store.dispatch(actions.getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, 1, jobTransactionId))
            .then(() => {
                expect(formLayoutService.getSequenceWiseRootFieldAttributes).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)

            })
    })

    it('should find next editable and focusable element', () => {
        formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
        formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValue({ formLayoutObject: formLayoutInitialState, isSaveDisabled });
        const store = mockStore({})
        const formLayoutState = {
            formElement: formLayoutMap,
            isSaveDisabled,
            fieldAttributeMasterParentIdMap: {}
        }
        return store.dispatch(actions.getNextFocusableAndEditableElements(7830, formLayoutState, null, null, jobTransactionId))
            .then(() => {
                expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[2].payload)
            })

    })


    it('should update field data and save draft in db', () => {
        const formLayoutState = {
            formElement: formLayoutMap,
            updateDraft: true
        }
        formLayoutEventsInterface.updateFieldData = jest.fn();
        formLayoutEventsInterface.updateFieldData.mockReturnValue(formLayoutMap);
        draftService.saveDraftInDb = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.updateFieldData(1, "d", formLayoutState))
            .then(() => {
                expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(UPDATE_FIELD_DATA)
                expect(store.getActions()[0].payload).toEqual(formLayoutMap);
                expect(draftService.saveDraftInDb).toHaveBeenCalledTimes(1)
            })
    })
    it('should update field data and not save draft in db', () => {
        const formLayoutState = {
            formElement: formLayoutMap,
            updateDraft: false
        }
        formLayoutEventsInterface.updateFieldData = jest.fn();
        formLayoutEventsInterface.updateFieldData.mockReturnValue(formLayoutMap);
        draftService.saveDraftInDb = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.updateFieldData(1, "d", formLayoutState))
            .then(() => {
                expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(UPDATE_FIELD_DATA)
                expect(store.getActions()[0].payload).toEqual(formLayoutMap);
                expect(draftService.saveDraftInDb).toHaveBeenCalledTimes(0)
            })
    })

    // it('it should save job transaction in db and add to sync list', () => {
    //     formLayoutEventsInterface.saveDataInDb = jest.fn();
    //     formLayoutEventsInterface.addTransactionsToSyncList = jest.fn();
    //     NavigationActions.navigate = jest.fn();
    //     NavigationActions.navigate.mockReturnValue(Home);
    //     const store = mockStore({})
    //     return store.dispatch(actions.saveJobTransaction(formLayoutMap, 1234, 1))
    //         .then(() => {
    //             expect(formLayoutEventsInterface.saveDataInDb).toHaveBeenCalledTimes(1)
    //             expect(formLayoutEventsInterface.addTransactionsToSyncList).toHaveBeenCalledTimes(1)
    //             expect(store.getActions()[0].type).toEqual(IS_LOADING)
    //             expect(store.getActions()[0].payload).toEqual(true)
    //             expect(store.getActions()[1].type).toEqual(IS_LOADING)
    //             expect(store.getActions()[1].payload).toEqual(false)
    //             // expect(store.getActions()[2].type).toEqual(Home)
    //         })
    // })
})

// describe('test form sequence field attribute', () => {
//     const message = "Cannot read property 'get' of undefined"
//     const expectedActions = [
//         {
//             type: UPDATE_FIELD_DATA,
//             payload: formElements
//         },
//         {
//             type: GET_SORTED_ROOT_FIELD_ATTRIBUTES,
//             payload: formLayoutInitialState
//         },
//         {
//             type: ERROR_MESSAGE,
//             payload: message
//         },
//         {
//             type: IS_LOADING,
//             payload: false
//         }
//     ]
//     it('should not get sequence data and throw error', () => {
//         formLayoutEventsInterface.getSequenceData = jest.fn()
//         formLayoutEventsInterface.getSequenceData.mockReturnValue({});
//         try {
//             actions.setSequenceDataAndNextFocus()
//         } catch (error) {
//             expect(error.message).toEqual(message)
//         }

//     })
//     it('should get sequence data and  and throw error', () => {
//         formLayoutEventsInterface.getSequenceData = jest.fn()
//         formLayoutEventsInterface.getSequenceData.mockReturnValue(4);
//         formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
//         formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValue('7831', formElements, nextEditables, isSaveDisabled, '1.0', null, 'ON_BLUR');
//         const store = mockStore({})
//         return store.dispatch(actions.setSequenceDataAndNextFocus('7831', formElements, nextEditables, isSaveDisabled, '4'))
//             .then(() => {
//                 expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
//                 expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
//                 expect(store.getActions()[0].type).toEqual(expectedActions[2].type)
//                 expect(store.getActions()[0].payload).toEqual(expectedActions[2].payload)
//                 expect(store.getActions()[1].type).toEqual(expectedActions[0].type)
//                 expect(store.getActions()[1].payload).toEqual(expectedActions[0].payload)

//             })
//     })
//     it('should get sequence data and  find next editable and focusable element', () => {
//         formLayoutEventsInterface.getSequenceData = jest.fn()
//         formLayoutEventsInterface.getSequenceData.mockReturnValue(4);
//         formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
//         formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValue('4', formLayoutMap, nextEditables, isSaveDisabled, '1.0', null, 'ON_BLUR');
//         const store = mockStore({})
//         return store.dispatch(actions.setSequenceDataAndNextFocus('4', formLayoutMap, nextEditable, isSaveDisabled, '4'))
//             .then(() => {
//                 expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
//                 expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
//                 expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
//                 expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)

//             })
//     })
// })

function getMapFromObject(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}