'use strict'

import InitialState from './qrCodeInitialState.js'
import {
    SCANNING
  } from '../../lib/constants'

const initialState = new InitialState();

export default function qrCodeReducer(state = initialState, action){
    if(!(state instanceof InitialState)) return initialState.mergeDeep(state);

    switch(action.type){

        case SCANNING :{
            return state.set('scanning',action.payload)
        }
    }
    return state;
}