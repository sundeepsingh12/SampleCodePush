'use strict'

const InitialState = require('./customAppInitialState').default

const initialState = new InitialState()
import {
    START_FETCHING_URL,
    END_FETCHING_URL,
    ON_CHANGE_STATE
} from '../../lib/constants'


export default function customAppReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {

        case ON_CHANGE_STATE: 
            return state.set('customUrl',null)

        case START_FETCHING_URL:
            return state.set('isLoaderRunning',true) 
                        .set('customUrl',action.payload)   
                        
        case END_FETCHING_URL:
            return state.set('isLoaderRunning',false)    
    }
    return state
}