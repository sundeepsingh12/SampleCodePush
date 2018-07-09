'use strict'

import formLayoutReducer from '../formLayoutReducer'
import {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    UPDATE_FIELD_DATA,
    SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
    IS_LOADING,
    RESET_STATE,
    ERROR_MESSAGE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    UPDATE_PAYMENT_AT_END,
    SET_FORM_LAYOUT_STATE,
    CLEAR_FORM_LAYOUT,
    SET_UPDATE_DRAFT,
    SET_FORM_TO_INVALID,
    SET_DSF_REVERSE_MAP,
    SET_MODAL_FIELD_ATTRIBUTE,
    SET_NO_FIELD_ATTRIBUTE_MAPPED,
    SET_FORM_INVALID_AND_FORM_ELEMENT,
    SET_ARRAY_DATA_STORE_FILTER_MAP,
    CLEAR_FORM_LAYOUT_WITH_LOADER
} from '../../../lib/constants'

import InitialState from '../formLayoutInitialState'
import { fieldAttributeMasterService } from '../../../services/classes/FieldAttributeMaster';

describe('test cases for form layout reducer', () => {

    it('test GET_SORTED_ROOT_FIELD_ATTRIBUTES', () => {
        const action = {
            type: GET_SORTED_ROOT_FIELD_ATTRIBUTES,
            payload: {
                formLayoutObject: {},
                isSaveDisabled: true
            }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.formElement).toEqual(action.payload.formLayoutObject)
        expect(nextState.isSaveDisabled).toEqual(action.payload.isSaveDisabled)
    })

    it('test UPDATE_FIELD_DATA', () => {
        const action = {
            type: UPDATE_FIELD_DATA,
            payload: {}
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.formElement).toEqual(action.payload)
    })

    it('test UPDATE_FIELD_DATA_WITH_CHILD_DATA', () => {
        const action = {
            type: UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            payload: {
                formElement: {},
                isSaveDisabled: true,
                latestPositionId: 1,
                modalFieldAttributeMasterId: 1
            }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.formElement).toEqual(action.payload.formElement)
        expect(nextState.isSaveDisabled).toEqual(action.payload.isSaveDisabled)
        expect(nextState.latestPositionId).toEqual(action.payload.latestPositionId)
        expect(nextState.modalFieldAttributeMasterId).toEqual(action.payload.modalFieldAttributeMasterId)
    })
    it('test UPDATE_FIELD_DATA_WITH_CHILD_DATA with false isSaveDisabled', () => {
        const action = {
            type: UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            payload: {
                formElement: {},
                isSaveDisabled: false,
                latestPositionId: 1,
                modalFieldAttributeMasterId: 1
            }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.formElement).toEqual(action.payload.formElement)
        expect(nextState.isSaveDisabled).toEqual(action.payload.isSaveDisabled)
        expect(nextState.latestPositionId).toEqual(action.payload.latestPositionId)
        expect(nextState.modalFieldAttributeMasterId).toEqual(action.payload.modalFieldAttributeMasterId)
    })

    it('test UPDATE_PAYMENT_AT_END', () => {
        const action = {
            type: UPDATE_PAYMENT_AT_END,
            payload: { paymentAtEnd: {} }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.paymentAtEnd).toEqual(action.payload.paymentAtEnd)
    })

    it('test SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT', () => {
        const action = {
            type: SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
            payload: {
                formLayoutObject: {},
                isSaveDisabled: true,
                latestPositionId: 1,
                statusId: 1,
                statusName: '',
                jobTransactionId: 1,
                fieldAttributeMasterParentIdMap: {},
                noFieldAttributeMappedWithStatus: true,
                isLoading: false
            }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.formElement).toEqual(action.payload.formLayoutObject)
        expect(nextState.isSaveDisabled).toEqual(action.payload.isSaveDisabled)
        expect(nextState.latestPositionId).toEqual(action.payload.latestPositionId)
        expect(nextState.statusId).toEqual(action.payload.statusId)
        expect(nextState.statusName).toEqual(action.payload.statusName)
        expect(nextState.jobTransactionId).toEqual(action.payload.jobTransactionId)
        expect(nextState.fieldAttributeMasterParentIdMap).toEqual(action.payload.fieldAttributeMasterParentIdMap)
        expect(nextState.noFieldAttributeMappedWithStatus).toEqual(action.payload.noFieldAttributeMappedWithStatus)
        expect(nextState.isLoading).toEqual(action.payload.isLoading)
    })

    it('test IS_LOADING', () => {
        const action = {
            type: IS_LOADING,
            payload: true
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(action.payload)
    })

    it('test ERROR_MESSAGE', () => {
        const action = {
            type: ERROR_MESSAGE,
            payload: ''
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(false)
        expect(nextState.errorMessage).toEqual(action.payload)
    })

    it('test SET_FORM_LAYOUT_STATE', () => {
        const editableFormLayoutState = {
            formElement: {},
            isSaveDisabled: true,
            latestPositionId: 1,
            statusId: 1,
            jobTransactionId: 1,
            isLoading: false
        }
        const action = {
            type: SET_FORM_LAYOUT_STATE,
            payload: {
                editableFormLayoutState,
                statusName: '',
            }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.formElement).toEqual(action.payload.editableFormLayoutState.formElement)
        expect(nextState.isSaveDisabled).toEqual(action.payload.editableFormLayoutState.isSaveDisabled)
        expect(nextState.latestPositionId).toEqual(action.payload.editableFormLayoutState.latestPositionId)
        expect(nextState.statusId).toEqual(action.payload.editableFormLayoutState.statusId)
        expect(nextState.statusName).toEqual(action.payload.statusName)
        expect(nextState.jobTransactionId).toEqual(action.payload.editableFormLayoutState.jobTransactionId)
        expect(nextState.isLoading).toEqual(action.payload.editableFormLayoutState.isLoading)
    })

    it('test SET_UPDATE_DRAFT', () => {
        const action = {
            type: SET_UPDATE_DRAFT,
            payload: true
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.updateDraft).toEqual(action.payload)
    })
    it('test CLEAR_FORM_LAYOUT_WITH_LOADER', () => {
        const action = {
            type: CLEAR_FORM_LAYOUT_WITH_LOADER,
            payload: true
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(action.payload)
    })
    it('test CLEAR_FORM_LAYOUT', () => {
        const action = {
            type: CLEAR_FORM_LAYOUT,
            payload: false
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(action.payload)
    })
    it('test RESET_STATE', () => {
        const action = {
            type: RESET_STATE,
            payload: false
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(action.payload)
    })
    it('test null state', () => {
        const action = {
            type: 'NULL',
            payload: false
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(action.payload)
    })

    it('test SET_FORM_TO_INVALID', () => {
        const action = {
            type: SET_FORM_TO_INVALID,
            payload: {
                isLoading: true,
                isFormValid: true
            }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(action.payload.isLoading)
        expect(nextState.isFormValid).toEqual(action.payload.isFormValid)
    })

    it('test SET_DSF_REVERSE_MAP', () => {
        const action = {
            type: SET_DSF_REVERSE_MAP,
            payload: {}
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.dataStoreFilterReverseMap).toEqual(action.payload)
    })

    it('test SET_MODAL_FIELD_ATTRIBUTE', () => {
        const action = {
            type: SET_MODAL_FIELD_ATTRIBUTE,
            payload: 1
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.modalFieldAttributeMasterId).toEqual(action.payload)
    })

    it('test SET_NO_FIELD_ATTRIBUTE_MAPPED', () => {
        const action = {
            type: SET_NO_FIELD_ATTRIBUTE_MAPPED,
            payload: true
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.noFieldAttributeMappedWithStatus).toEqual(action.payload)
    })

    it('test SET_ARRAY_DATA_STORE_FILTER_MAP', () => {
        const action = {
            type: SET_ARRAY_DATA_STORE_FILTER_MAP,
            payload: {}
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.arrayReverseDataStoreFilterMap).toEqual(action.payload)
    })

    it('test SET_FORM_INVALID_AND_FORM_ELEMENT', () => {
        const action = {
            type: SET_FORM_INVALID_AND_FORM_ELEMENT,
            payload: {
                isLoading: true,
                isFormValid: true,
                formElement: {}
            }
        }
        let nextState = formLayoutReducer(undefined, action)
        expect(nextState.isLoading).toEqual(action.payload.isLoading)
        expect(nextState.isFormValid).toEqual(action.payload.isFormValid)
        expect(nextState.formElement).toEqual(action.payload.formElement)
    })
})
