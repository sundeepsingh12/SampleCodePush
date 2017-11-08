'use strict'

import InitialState from './newJobInitialState.js'

import {
    NEW_JOB_MASTER,
    NEW_JOB_STATUS
  } from '../../lib/constants'

const initialState = new InitialState();

export default function newJobReducer(state = initialState, action){
    if(!(state instanceof InitialState)) return initialState.mergeDeep(state);

    switch(action.type){

        case NEW_JOB_MASTER :{
            return state.set('jobMasterList',action.payload)
                        .set('statusList',action.payload)
        }

        case NEW_JOB_STATUS : {
            return state.set('statusList',action.payload.nextPendingStatus)
                        .set('negativeId',action.payload.negativeId)
        }
    }
    return state;
}