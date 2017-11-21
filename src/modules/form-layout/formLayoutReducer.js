'use strict'

import InitialState from './formLayoutInitialState.js'

const {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    STATUS_NAME,
    TOOGLE_HELP_TEXT,
    BASIC_INFO,
    IS_LOADING,
    RESET_STATE,
    ERROR_MESSAGE,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    UPDATE_PAYMENT_AT_END,
    SET_FORM_LAYOUT_STATE
  } = require('../../lib/constants').default
  
const {
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
} = require('../../lib/constants').default

const initialState = new InitialState();

export default function formLayoutReducer(state = initialState, action){
    if(!(state instanceof InitialState)) return initialState.mergeDeep(state);

    switch(action.type){
        /**
         * sets sorted fieldAttributes, nextEditable and isSaveDisabled
         */
        case GET_SORTED_ROOT_FIELD_ATTRIBUTES : {
            return state.set('formElement',action.payload.formLayoutObject)
                        .set('nextEditable',action.payload.nextEditable)
                        .set('isSaveDisabled',action.payload.isSaveDisabled ? true : false) // applied ternary condition to set null, undefined to false
        }

        /**
         * disabled save if all required elements are not filled
         */
        case DISABLE_SAVE : {
            return state.set('isSaveDisabled', action.payload)
        }

        /**
         * set field data of the form element
         */
        case UPDATE_FIELD_DATA : {
            return state.set('formElement',action.payload)
        }

        
        case UPDATE_FIELD_DATA_WITH_CHILD_DATA : {
            return state.set('formElement',action.payload.formElement)
                        .set('latestPositionId',action.payload.latestPositionId)
                        .set('nextEditable',action.payload.nextEditable)
                        .set('isSaveDisabled',action.payload.isSaveDisabled ? true : false)
        }

        case UPDATE_PAYMENT_AT_END : {
            return state.set('paymentAtEnd',action.payload.paymentAtEnd)
        }

        /**
         * set basic info like statusId, statusName, jobTransactionId, latestPositionId
         */
        case BASIC_INFO : {
            return state.set('statusId',action.payload.statusId)
                        .set('statusName',action.payload.statusName)
                        .set('jobTransactionId',action.payload.jobTransactionId)
                        .set('latestPositionId',action.payload.latestPositionId)
        }

        /**
         * toogle's help text, sets to true if previous was false and vice versa
         */
        case TOOGLE_HELP_TEXT : {
            return state.set('formElement',action.payload)
        }
        
        /**
         * for showing loader
         */
        case IS_LOADING : {
            return state.set('isLoading',action.payload);
        }

        /**
         * resets state to initial state
         */
        case RESET_STATE : {
            return initialState;
        }

        /**
         * sets error message
         */
        case ERROR_MESSAGE : {
            return state.set('errorMessage',action.payload);
        }

        /**
         * sets formlayout state when
         * back pressed from TransientStatus container
         */
        case SET_FORM_LAYOUT_STATE : {
            state = action.payload
            return state;
        }
    }
    return state;
}