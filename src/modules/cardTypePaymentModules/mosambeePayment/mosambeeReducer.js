'use strict'

const InitialState = require('./mosambeeIntialState').default

const initialState = new InitialState()
import {
    SET_MOSAMBEE_PARAMETERS,
    SET_LOADER_FOR_MOSAMBEE
} from '../../../lib/constants'


export default function mosambeeReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case SET_LOADER_FOR_MOSAMBEE :
             return state.set('mosambeeLoader',true)

        case  SET_MOSAMBEE_PARAMETERS :
        return state.set('mosambeeLoader','startMosambee')
                    .set('mosambeeParameters',action.payload)
    }
    return state
}