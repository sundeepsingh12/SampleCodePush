'use strict'

import InitialState from './formLayoutInitialState.js'

const {
    GET_SORTED_ROOT_FIELD_ATTRIBUTES,
    DISABLE_SAVE,
    UPDATE_FIELD_DATA,
    STATUS_NAME,
    TOOGLE_HELP_TEXT,
    BASIC_INFO
  } = require('../../lib/constants').default
  
const {
    SHOW_DATETIME_PICKER,
    HIDE_DATETIME_PICKER,
} = require('../../lib/constants').default

const _onPressVisible= (element,Id)=>{
        element.forEach(element => {
                    if (element.attributeTypeId == Id) {
                      element.isVisible = true;
                    }})
        return element;
    }
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

        case BASIC_INFO : {
            return state.set('statusId',action.payload.statusId)
                        .set('statusName',action.payload.statusName)
                        .set('jobTransactionId',action.payload.jobTransactionId)
                        .set('latestPositionId',action.payload.latestPositionId)
        }

        case TOOGLE_HELP_TEXT : {
            return state.set('formElement',action.payload)
        }
        case SHOW_DATETIME_PICKER:{
            return state.set('formElement',action.payload)
        }
        case HIDE_DATETIME_PICKER :{
            return state.set('formElement',action.payload);
        }
        
                
    }
    return state;
}