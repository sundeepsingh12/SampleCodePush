'use strict'

import bluetoothReducer from '../bluetoothReducer'
import {
    BLUETOOTH_SCANNING_START,
    BLUETOOTH_SCANNING_STOP
} from '../../../lib/constants'

import InitialState from '../bluetoothInitialState'

describe('test cases for bluetooth reducer', () => {
    it('should set scanning true', () => {
        const action = {
            type: BLUETOOTH_SCANNING_START,
        }
        let nextState = bluetoothReducer(undefined, action)
        expect(nextState.isScanRunning).toEqual(true)
    })

    it('should stop scanning', () => {
        const action = {
            type: BLUETOOTH_SCANNING_STOP,
            payload: {
                unpairedDevices: [],
                pairedDevices: []
            }
        }
        let nextState = bluetoothReducer(undefined, action)
        expect(nextState.isScanRunning).toEqual(false)
        expect(nextState.unpairedDevices).toEqual(action.payload.unpairedDevices)
        expect(nextState.pairedDevices).toEqual(action.payload.pairedDevices)
    })
    it('set initial state', () => {
        const action = {
            type: null
        }
        let nextState = bluetoothReducer(undefined, action)
        expect(nextState.isScanRunning).toEqual(false)
        expect(nextState.unpairedDevices).toEqual([])
        expect(nextState.pairedDevices).toEqual([])
    })
})

