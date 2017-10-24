'use strict'

import InitialState from './formLayoutInitialState.js'

const {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    STATUS_NAME,
    TOOGLE_HELP_TEXT,
    BASIC_INFO,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA,
    UPDATE_PAYMENT_AT_END
  } = require('../../lib/constants').default
  


const initialState = new InitialState();

export default function formLayoutReducer(state = initialState, action){
    console.log('inside form layout reducer');
    if(!(state instanceof InitialState)) return initialState.mergeDeep(state);

    switch(action.type){
        case GET_SORTED_ROOT_FIELD_ATTRIBUTES : {
            console.log(action.payload);
            return state.set('formElement',action.payload.formLayoutObject)
                        .set('nextEditable',action.payload.nextEditable)
                        .set('isSaveDisabled',action.payload.isSaveDisabled ? true : false)
        }

        case DISABLE_SAVE : {
            return state.set('isSaveDisabled', action.payload)
        }

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

        case BASIC_INFO : {
            return state.set('statusId',action.payload.statusId)
                        .set('statusName',action.payload.statusName)
                        .set('jobTransactionId',action.payload.jobTransactionId)
                        .set('latestPositionId',action.payload.latestPositionId)
        }

        case TOOGLE_HELP_TEXT : {
            return state.set('formElement',action.payload)
        }
        case UPDATE_FIELD_DATA_WITH_CHILD_DATA : {
            return state.set('formElement',action.payload.formElement)
                        .set('latestPositionId',action.payload.latestPositionId)
                        .set('nextEditable',action.payload.nextEditable)
                        .set('isSaveDisabled',action.payload.isSaveDisabled ? true : false)
        }
    }
    return state;
}