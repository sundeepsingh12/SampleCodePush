'use strict'

const InitialState = require('./mosambeeIntialState').default

const initialState = new InitialState()
import {
    SET_MOSAMBEE_PARAMETERS,
    SET_LOADER_FOR_MOSAMBEE,
    SET_MESSAGE_FOR_MOSAMBEE,
    RESET_STATE_FOR_MOSAMBEE
} from '../../../lib/constants'


export default function mosambeeReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case SET_LOADER_FOR_MOSAMBEE :
            return state.set('mosambeeLoader',action.payload)

        case SET_MESSAGE_FOR_MOSAMBEE :
            return state.set('mosambeeMessage',action.payload)
                        .set('mosambeeLoader',false)

        case  SET_MOSAMBEE_PARAMETERS :
            return state.set('mosambeeLoader','START_MOSAMBEE')
                        .set('mosambeeParameters',action.payload)
        case RESET_STATE_FOR_MOSAMBEE:
             return initialState

    }
    return state
}