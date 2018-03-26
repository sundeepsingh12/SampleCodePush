'use strict'

const InitialState = require('./bluetoothInitialState').default

const initialState = new InitialState()
import {
    BLUETOOTH_SCANNING_START,
    BLUETOOTH_SCANNING_STOP
} from '../../lib/constants'


export default function bluetoothReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state)

    switch (action.type) {
        case BLUETOOTH_SCANNING_START :
             return state.set('isScanRunning',true)

        case  BLUETOOTH_SCANNING_STOP :
        return state.set('isScanRunning',false)
                    .set('unpairedDevices',action.payload.unpairedDevices)
                    .set('pairedDevices',action.payload.pairedDevices)
    }
    return state
}