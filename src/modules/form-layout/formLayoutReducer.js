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
    ERROR_MESSAGE
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
    }
    return state;
}