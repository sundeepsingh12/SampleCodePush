'use strict'

import InitialState from './formLayoutInitialState.js'
import _ from 'lodash'

import {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    TOOGLE_HELP_TEXT,
    SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT,
    IS_LOADING,
    RESET_STATE,
    ERROR_MESSAGE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    UPDATE_PAYMENT_AT_END,
    UPDATE_FIELD_DATA_VALIDATION,
    SET_FORM_LAYOUT_STATE,
    CLEAR_FORM_LAYOUT,
    SET_UPDATE_DRAFT,
    SET_FORM_TO_INVALID,
    SET_DSF_REVERSE_MAP,
    SET_MODAL_FIELD_ATTRIBUTE,
    SET_NO_FIELD_ATTRIBUTE_MAPPED,
    SET_FORM_INVALID_AND_FORM_ELEMENT,
    SET_ARRAY_DATA_STORE_FILTER_MAP,
} from '../../lib/constants'

const initialState = new InitialState();

export default function formLayoutReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

    switch (action.type) {
        /**
         * sets sorted fieldAttributes, nextEditable and isSaveDisabled
         */
        case GET_SORTED_ROOT_FIELD_ATTRIBUTES: {
            return state.set('formElement', action.payload.formLayoutObject)
                .set('isSaveDisabled', action.payload.isSaveDisabled) // applied ternary condition to set null, undefined to false
                .set('updateDraft', true)
        }

        /**
         * disabled save if all required elements are not filled
         */
        case DISABLE_SAVE: {
            return state.set('isSaveDisabled', action.payload)
        }

        /**
         * set field data of the form element
         */
        case UPDATE_FIELD_DATA: {
            return state.set('formElement', action.payload)
                .set('updateDraft', true)
        }


        case UPDATE_FIELD_DATA_WITH_CHILD_DATA: {
            return state.set('formElement', action.payload.formElement)
                .set('latestPositionId', action.payload.latestPositionId)
                .set('isSaveDisabled', action.payload.isSaveDisabled ? true : false)
                .set('updateDraft', true)
                .set('modalFieldAttributeMasterId', action.payload.modalFieldAttributeMasterId)
        }

        case UPDATE_PAYMENT_AT_END: {
            return state.set('paymentAtEnd', action.payload.paymentAtEnd)
        }

        /**
         * set basic info like statusId, statusName, jobTransactionId, latestPositionId etc
         */
        case SET_FIELD_ATTRIBUTE_AND_INITIAL_SETUP_FOR_FORMLAYOUT: {
            return state.set('statusId', action.payload.statusId)
                .set('statusName', action.payload.statusName)
                .set('jobTransactionId', action.payload.jobTransactionId)
                .set('latestPositionId', action.payload.latestPositionId)
                .set('fieldAttributeMasterParentIdMap', action.payload.fieldAttributeMasterParentIdMap)
                .set('noFieldAttributeMappedWithStatus', action.payload.noFieldAttributeMappedWithStatus)
                .set('formElement', action.payload.formLayoutObject)
                .set('isSaveDisabled', action.payload.isSaveDisabled)
                .set('isLoading', action.payload.isLoading)
                .set('jobAndFieldAttributesList', action.payload.jobAndFieldAttributesList)
        }

        /**
         * toogle's help text, sets to true if previous was false and vice versa
         */
        case TOOGLE_HELP_TEXT: {
            return state.set('formElement', action.payload)
        }

        /**
         * for showing loader
         */
        case IS_LOADING: {
            return state.set('isLoading', action.payload)
        }

        /**
         * resets state to initial state
         */
        case CLEAR_FORM_LAYOUT:
        case RESET_STATE: {
            return initialState
        }

        /**
         * sets error message and isLoading to false
         */
        case ERROR_MESSAGE: {
            return state.set('errorMessage', action.payload)
                .set('isLoading', false)
        }

        case UPDATE_FIELD_DATA_VALIDATION: {
            return state.set('formElement', action.payload.formElement)
                .set('errorMessage', action.payload.message)
                .set('currentElement', action.payload.currentElement)
        }

        /**
         * sets formlayout state when
         * back pressed from TransientStatus container
         */
        case SET_FORM_LAYOUT_STATE: {
            return state.set('currentElement', action.payload.editableFormLayoutState.currentElement)
                .set('latestPositionId', action.payload.editableFormLayoutState.latestPositionId)
                .set('isSaveDisabled', action.payload.editableFormLayoutState.isSaveDisabled)
                .set('statusId', action.payload.editableFormLayoutState.statusId)
                .set('jobTransactionId', action.payload.editableFormLayoutState.jobTransactionId)
                .set('statusName', action.payload.statusName)
                .set('formElement', action.payload.editableFormLayoutState.formElement)
                .set('isLoading', action.payload.editableFormLayoutState.isLoading)
                .set('errorMessage', action.payload.editableFormLayoutState.errorMessage)
                .set('paymentAtEnd', action.payload.editableFormLayoutState.paymentAtEnd)
                .set('dataStoreFilterReverseMap', action.payload.editableFormLayoutState.dataStoreFilterReverseMap)
        }

        case SET_UPDATE_DRAFT: {
            return state.set('updateDraft', action.payload)
        }

        case SET_FORM_TO_INVALID: {
            return state.set('isLoading', action.payload.isLoading)
                .set('isFormValid', action.payload.isFormValid)
        }

        case SET_DSF_REVERSE_MAP:
            return state.set('dataStoreFilterReverseMap', action.payload)

        case SET_MODAL_FIELD_ATTRIBUTE: {
            return state.set('modalFieldAttributeMasterId', action.payload)
        }
        case SET_NO_FIELD_ATTRIBUTE_MAPPED: {
            return state.set('noFieldAttributeMappedWithStatus', action.payload)
        }
        case SET_FORM_INVALID_AND_FORM_ELEMENT: {
            return state.set('isLoading', action.payload.isLoading)
                .set('isFormValid', action.payload.isFormValid)
                .set('formElement', action.payload.formElement)
        }

        case SET_ARRAY_DATA_STORE_FILTER_MAP: {
            return state.set('arrayReverseDataStoreFilterMap', action.payload)
        }
    }
    return state;
}