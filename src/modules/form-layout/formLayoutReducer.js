'use strict'

import InitialState from './formLayoutInitialState.js'
import _ from 'lodash'

import {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    TOOGLE_HELP_TEXT,
    BASIC_INFO,
    IS_LOADING,
    RESET_STATE,
    ERROR_MESSAGE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    UPDATE_PAYMENT_AT_END,
    UPDATE_FIELD_DATA_VALIDATION,
    SET_FORM_LAYOUT_STATE,
    CLEAR_FORM_LAYOUT,
    SET_DRAFT,
    SET_UPDATE_DRAFT,
    SET_FORM_TO_INVALID,
    SET_DSF_REVERSE_MAP
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
        }

        case UPDATE_PAYMENT_AT_END: {
            return state.set('paymentAtEnd', action.payload.paymentAtEnd)
        }

        /**
         * set basic info like statusId, statusName, jobTransactionId, latestPositionId
         */
        case BASIC_INFO: {
            return state.set('statusId', action.payload.statusId)
                .set('statusName', action.payload.statusName)
                .set('jobTransactionId', action.payload.jobTransactionId)
                .set('latestPositionId', action.payload.latestPositionId)
                .set('draftStatusId', action.payload.draftStatusId)
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
         * sets error message
         */
        case ERROR_MESSAGE: {
            return state.set('errorMessage', action.payload)
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
            return state.set('currentElement', action.payload.currentElement)
                .set('latestPositionId', action.payload.latestPositionId)
                .set('isSaveDisabled', action.payload.isSaveDisabled)
                .set('statusId', action.payload.statusId)
                .set('jobTransactionId', action.payload.jobTransactionId)
                .set('statusName', action.payload.statusName)
                .set('formElement', action.payload.formElement)
                .set('isLoading', action.payload.isLoading)
                .set('errorMessage', action.payload.errorMessage)
                .set('paymentAtEnd', action.payload.paymentAtEnd)
                .set('dataStoreFilterReverseMap', action.payload.dataStoreFilterReverseMap)
        }
        case SET_DRAFT: {
            return state.set('draftStatusId', action.payload)
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
    }
    return state;
}