'use strict'
var actions = require('../formLayoutActions')

import {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    IS_LOADING,
    BASIC_INFO,
    UPDATE_FIELD_DATA,
    Home,
    CLEAR_FORM_LAYOUT_WITH_LOADER,
    SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
    SET_FORM_LAYOUT_STATE,
    ADD_FORM_LAYOUT_STATE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    SET_FORM_INVALID_AND_FORM_ELEMENT,
    SET_LANDING_TAB
} from '../../../lib/constants'

import { formLayoutService } from '../../../services/classes/formLayout/FormLayout.js'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import { formLayoutEventsInterface } from '../../../services/classes/formLayout/FormLayoutEventInterface.js'
import { NavigationActions } from 'react-navigation'
import { draftService } from '../../../services/classes/DraftService.js'
import { fieldValidationService } from '../../../services/classes/FieldValidation'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../../services/classes/DataStoreService'
import moment from 'moment';
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
const fieldAttributeMasterParentIdMap = {
    7830: {
        id: 7831,
        attributeTypeId: 62,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
    }
}
const latestPositionId = 2;
const isSaveDisabled = true;
const formLayoutInitialState = { formLayoutObject, latestPositionId, isSaveDisabled, fieldAttributeMasterParentIdMap };
const navigationFormLayoutState = formLayoutInitialState

describe('test form layout events', () => {
    const statusId = 1;
    const statusName = 'success'
    const jobTransactionId = 1234
    const expectedActions = [
        {
            type: CLEAR_FORM_LAYOUT_WITH_LOADER,
        },
        {
            type: SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
        },
        {
            type: GET_SORTED_ROOT_FIELD_ATTRIBUTES,
            payload: { formLayoutObject: formLayoutInitialState, isSaveDisabled }
        },
        {
            type: UPDATE_FIELD_DATA,
            payload: formElement
        },
        {
            type: UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            payload: {
                modalFieldAttributeMasterId: null,
                formElement,
                latestPositionId: 2,
                isSaveDisabled: false
            }
        }
    ]
    it('should find root field attributes in sorted order and set initial state of form element', () => {
        formLayoutService.getSequenceWiseRootFieldAttributes = jest.fn()
        formLayoutService.getSequenceWiseRootFieldAttributes.mockReturnValue(formLayoutInitialState);
        formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
        formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValueOnce({ formLayoutObject, isSaveDisabled: true })
        const store = mockStore({})
        return store.dispatch(actions.getSortedRootFieldAttributes(statusId, statusName, jobTransactionId, 1, jobTransactionId))
            .then(() => {
                expect(formLayoutService.getSequenceWiseRootFieldAttributes).toHaveBeenCalledTimes(1)
                expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual({
                    statusId, statusName, jobTransactionId, fieldAttributeMasterParentIdMap,
                    noFieldAttributeMappedWithStatus: undefined,
                    formLayoutObject: formLayoutObject,
                    isSaveDisabled: true,
                    latestPositionId: 2,
                    isLoading: false,
                    jobAndFieldAttributesList: undefined,
                    sequenceWiseFieldAttributeMasterIds: undefined
                })
            })
    })


    it('should set sequenceData and next Focus', () => {
        const currentElement = {
            fieldAttributeMasterId: 7830
        }
        const formLayoutState = { formElement }
        formLayoutEventsInterface.getSequenceData = jest.fn()
        formLayoutEventsInterface.getSequenceData.mockReturnValue(4);
        const store = mockStore({})
        return store.dispatch(actions.setSequenceDataAndNextFocus(currentElement, formLayoutState, 4, jobTransactionId))
            .then(() => {
                expect(formLayoutEventsInterface.getSequenceData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[3].payload)
            })

    })


    it('should find next editable and focusable element', () => {
        formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn()
        draftService.saveDraftInDb = jest.fn()
        formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValue({ formLayoutObject: formLayoutInitialState, isSaveDisabled });
        const store = mockStore({})
        const formLayoutState = {
            formElement: formLayoutObject,
            isSaveDisabled,
            updateDraft: true
        }
        return store.dispatch(actions.getNextFocusableAndEditableElements(7830, formLayoutState, null, null, jobTransactionId))
            .then(() => {
                expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
                expect(draftService.saveDraftInDb).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[2].payload)
            })

    })


    it('should update field data and save draft in db', () => {
        const formLayoutState = {
            formElement,
            updateDraft: true
        }
        formLayoutEventsInterface.updateFieldData = jest.fn();
        formLayoutEventsInterface.updateFieldData.mockReturnValue(formElement);
        draftService.saveDraftInDb = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.updateFieldData(1, "d", formLayoutState))
            .then(() => {
                expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(UPDATE_FIELD_DATA)
                expect(store.getActions()[0].payload).toEqual(formElement);
                expect(draftService.saveDraftInDb).toHaveBeenCalledTimes(1)
            })
    })
    it('should update field data and not save draft in db', () => {
        const formLayoutState = {
            formElement,
            updateDraft: false
        }
        formLayoutEventsInterface.updateFieldData = jest.fn();
        formLayoutEventsInterface.updateFieldData.mockReturnValue(formElement);
        draftService.saveDraftInDb = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.updateFieldData(1, "d", formLayoutState))
            .then(() => {
                expect(formLayoutEventsInterface.updateFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(UPDATE_FIELD_DATA)
                expect(store.getActions()[0].payload).toEqual(formElement);
                expect(draftService.saveDraftInDb).toHaveBeenCalledTimes(0)
            })
    })
    it('should update field data with child data', () => {
        const formLayoutState = {
            formElement,
            updateDraft: false,
            jobMasterId: 123,
            isSaveDisabled: false,
            fieldAttributeMasterParentIdMap,
            jobAndFieldAttributesList: {}
        }
        const jobTransaction = {
            id: 123
        }
        const fieldDataListObject = {
            latestPositionId: 2,
            fieldDataList: []
        }
        fieldValidationService.fieldValidations = jest.fn()
        fieldValidationService.fieldValidations.mockReturnValueOnce(true)
        formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn();
        formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValueOnce({ formLayoutObject: formElement, latestPositionId: 2, isSaveDisabled: false });
        draftService.saveDraftInDb = jest.fn()
        const store = mockStore({})
        store.dispatch(actions.updateFieldDataWithChildData(7831, formLayoutState, "d", fieldDataListObject, jobTransaction, true, "d", null))
        expect(fieldValidationService.fieldValidations).toHaveBeenCalledTimes(1)
        expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
        expect(store.getActions()[0].type).toEqual(expectedActions[4].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[4].payload)
        expect(draftService.saveDraftInDb).toHaveBeenCalledTimes(0)
    })

    it('should update field data with child data and update draft', () => {
        const formLayoutState = {
            formElement,
            updateDraft: true,
            jobMasterId: 123,
            isSaveDisabled: false,
            fieldAttributeMasterParentIdMap,
            jobAndFieldAttributesList: {}
        }
        const jobTransaction = {
            id: 123
        }
        const fieldDataListObject = {
            latestPositionId: 2,
            fieldDataList: []
        }
        fieldValidationService.fieldValidations = jest.fn()
        fieldValidationService.fieldValidations.mockReturnValueOnce(true)
        formLayoutEventsInterface.findNextFocusableAndEditableElement = jest.fn();
        formLayoutEventsInterface.findNextFocusableAndEditableElement.mockReturnValueOnce({ formLayoutObject: formElement, latestPositionId: 2, isSaveDisabled: false });
        draftService.saveDraftInDb = jest.fn()
        const store = mockStore({})
        store.dispatch(actions.updateFieldDataWithChildData(7831, formLayoutState, "d", fieldDataListObject, jobTransaction, true, "d", null))
        expect(fieldValidationService.fieldValidations).toHaveBeenCalledTimes(1)
        expect(formLayoutEventsInterface.findNextFocusableAndEditableElement).toHaveBeenCalledTimes(1)
        expect(store.getActions()[0].type).toEqual(expectedActions[4].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[4].payload)
        expect(draftService.saveDraftInDb).toHaveBeenCalledTimes(1)
    })


    it('it should not save job Transaction and autoLogout', () => {
        const userData = {
            value: {
                company: {
                    autoLogoutFromDevice: true
                },
                lastLoginTime: '2018-05-12'
            }
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: true
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userData)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)

        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: false
            }
        })
        NavigationActions.navigate = jest.fn();
        NavigationActions.navigate.mockReturnValue(Home);
        const store = mockStore({})
        return store.dispatch(actions.saveJobTransaction(formElement, 1234))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(7)
            })
    })
    it('it should save job Transaction with invalid form Data', () => {
        const userData = {
            value: null
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: true
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: false
            }
        })
        formLayoutService.isFormValid = jest.fn();
        formLayoutService.isFormValid.mockReturnValue({ isFormValid: false, formElement });
        const store = mockStore({})
        return store.dispatch(actions.saveJobTransaction(formElement, 1234))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(6)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(3)
                expect(formLayoutService.isFormValid).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(IS_LOADING)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(SET_FORM_INVALID_AND_FORM_ELEMENT)
                expect(store.getActions()[1].payload).toEqual({
                    isLoading: false,
                    formElement,
                    isFormValid: false
                })


            })
    })
    it('it should save job Transaction with valid form Data and navigate to tabScreen with landingTabId', () => {
        const userData = {
            value: null
        }
        const taskListScreenDetails = { jobDetailsScreenKey: '123', pageObjectAdditionalParams: JSON.stringify({}) }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        formLayoutService.saveAndNavigate = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: true
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)

        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: false
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value:
                [{
                    id: 1,
                    statusName: 'pending'
                }]
        })
        formLayoutService.saveAndNavigate.mockReturnValueOnce({ routeName: 'TabScreen', routeParam: {} })
        formLayoutService.isFormValid = jest.fn();
        formLayoutService.isFormValid.mockReturnValue({ isFormValid: true, formElement });
        const store = mockStore({})
        return store.dispatch(actions.saveJobTransaction(formElement, 1234, null, jobTransactionId, navigationFormLayoutState, false, null, taskListScreenDetails))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(10)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(3)
                expect(formLayoutService.isFormValid).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(IS_LOADING)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(IS_LOADING)
                expect(store.getActions()[1].payload).toEqual(false)
                expect(store.getActions()[2].type).toEqual(SET_LANDING_TAB)
                expect(store.getActions()[2].payload).toEqual({ "landingTabId": null })

            })
    })
    it('it should save job Transaction with valid form Data and navigate to tabScreen without landingTabId', () => {
        const userData = {
            value: null
        }
        const taskListScreenDetails = null
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        formLayoutService.saveAndNavigate = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: true
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)

        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: false
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value:
                [{
                    id: 1,
                    statusName: 'pending'
                }]
        })
        formLayoutService.saveAndNavigate.mockReturnValueOnce({ routeName: 'TabScreen', routeParam: {} })
        formLayoutService.isFormValid = jest.fn();
        formLayoutService.isFormValid.mockReturnValue({ isFormValid: true, formElement });
        const store = mockStore({})
        return store.dispatch(actions.saveJobTransaction(formElement, 1234, null, jobTransactionId, navigationFormLayoutState, false, null, taskListScreenDetails))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(8)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(3)
                expect(formLayoutService.isFormValid).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(IS_LOADING)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(IS_LOADING)
                expect(store.getActions()[1].payload).toEqual(false)

            })
    })
    it('it should save job Transaction with valid form Data and navigate to transient', () => {
        const userData = {
            value: null
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        formLayoutService.saveAndNavigate = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: true
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)

        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: {
                transactionSaving: false
            }
        })
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value:
                [{
                    id: 1,
                    statusName: 'pending'
                }]
        })
        const routeParam = {
            currentStatus: { nextStatusList: [1], id: 123, statusName: 'pending' }, formElement, jobTransaction: { id: 1 },
            jobMasterId: 123,

        }
        formLayoutService.saveAndNavigate.mockReturnValueOnce({ routeName: 'Transient', routeParam })
        formLayoutService.isFormValid = jest.fn();
        formLayoutService.isFormValid.mockReturnValue({ isFormValid: true, formElement });
        const store = mockStore({})
        const data = {
            "123": undefined,
            "fieldAttributeMasterParentIdMap":
            {
                "7830":
                {
                    "attributeTypeId": 62,
                    "id": 7831,
                    "parentId": 0,
                    "positionId": 0,
                    "showHelpText": true
                }
            }, "formLayoutObject": formLayoutObject,
            "isSaveDisabled": true,
            "latestPositionId": 2
        }
        return store.dispatch(actions.saveJobTransaction(formElement, 1234, null, jobTransactionId, navigationFormLayoutState, false))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(8)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(3)
                expect(formLayoutService.isFormValid).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(IS_LOADING)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(IS_LOADING)
                expect(store.getActions()[1].payload).toEqual(false)
                expect(store.getActions()[2].type).toEqual(ADD_FORM_LAYOUT_STATE)
                expect(store.getActions()[2].payload).toEqual(data)

            })
    })
    it('should run validation on field attribute and update data', () => {
        const formLayoutState = {
            formElement,
            updateDraft: false
        }
        const currentElement = { fieldAttributeMasterId: 7831 }
        fieldValidationService.fieldValidations = jest.fn();
        fieldValidationService.fieldValidations.mockReturnValue(false);
        formLayoutService.checkUniqueValidation = jest.fn()
        formLayoutService.checkUniqueValidation.mockReturnValueOnce(true)
        const store = mockStore({})
        return store.dispatch(actions.fieldValidations(currentElement, formLayoutState, 'After', jobTransactionId))
            .then(() => {
                expect(fieldValidationService.fieldValidations).toHaveBeenCalledTimes(1)
                expect(formLayoutService.checkUniqueValidation).toHaveBeenCalledTimes(1)
            })
    })
    it('should check unique validation and save', () => {
        const formLayoutState = {
            formElement,
            updateDraft: false,
            latestPositionId: 2
        }
        const fieldAttribute = { fieldAttributeMasterId: 7831 }
        const data = formElement
        data[7831].alertMessage = "This value is already in use"
        data[7831].displayValue = 'A'
        data[7831].value = null
        dataStoreService.checkForUniqueValidation = jest.fn();
        dataStoreService.checkForUniqueValidation.mockReturnValue(true);
        const store = mockStore({})
        return store.dispatch(actions.checkUniqueValidationThenSave(fieldAttribute, formLayoutState, 'A', jobTransactionId))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(GET_SORTED_ROOT_FIELD_ATTRIBUTES)
                expect(store.getActions()[0].payload).toEqual({
                    formLayoutObject: data,
                    isSaveDisabled: true
                })
                expect(dataStoreService.checkForUniqueValidation).toHaveBeenCalledTimes(1)
            })
    })
    it('should check unique validation and update fieldData with childData', () => {
        const formLayoutState = {
            formElement,
            updateDraft: false,
            latestPositionId: 2
        }
        const fieldAttribute = { fieldAttributeMasterId: 7831 }

        dataStoreService.checkForUniqueValidation = jest.fn();
        dataStoreService.checkForUniqueValidation.mockReturnValue(false);

        const store = mockStore({})
        return store.dispatch(actions.checkUniqueValidationThenSave(fieldAttribute, formLayoutState, 'A', jobTransactionId))
            .then(() => {
                expect(dataStoreService.checkForUniqueValidation).toHaveBeenCalledTimes(1)
            })
    })
    it('should restore draft or redirect to formLayout', () => {

        const store = mockStore({})
        return store.dispatch(actions.restoreDraftOrRedirectToFormLayout(true, null, 123, 'pending', jobTransactionId))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_FORM_LAYOUT_STATE)
                expect(store.getActions()[0].payload).toEqual({
                    editableFormLayoutState: true,
                    statusName: 'pending'
                })
            })
    })
})

describe('test cases for restore draft and navigate to formLayout', () => {
    beforeEach(() => {
        draftService.getFormLayoutStateFromDraft = jest.fn()
    })
    it('should restore draft and navigate to formLayout', () => {
        const store = mockStore({})
        const jobTransaction = {
            id: 1233,
        }
        const draft = {
            jobMasterId: 123,
            referenceNumber: 'Fareye123'
        }
        draftService.getFormLayoutStateFromDraft.mockReturnValueOnce({
            formLayoutState: { statusName: 'pending', jobTransactionId: 123, statusId: 123 },
            navigationFormLayoutStatesForRestore: { statusName: 'pending', jobTransactionId: 123, statusId: 121 }
        })
        return store.dispatch(actions.restoreDraftAndNavigateToFormLayout(null, jobTransaction, draft))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_FORM_LAYOUT_STATE)
                expect(store.getActions()[0].payload).toEqual({
                    editableFormLayoutState: { statusName: 'pending', jobTransactionId: 123, statusId: 123 },
                    statusName: 'pending'
                })
                expect(store.getActions()[1].type).toEqual(ADD_FORM_LAYOUT_STATE)
                expect(store.getActions()[1].payload).toEqual({ statusName: 'pending', jobTransactionId: 123, statusId: 121 })
            })
    })
})
function getMapFromObject(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}