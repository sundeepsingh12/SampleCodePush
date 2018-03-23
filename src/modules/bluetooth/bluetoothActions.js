'use strict'

import BluetoothSerial from 'react-native-bluetooth-serial'
import {
    setState
} from '../global/globalActions'
import {
    BLUETOOTH_SCANNING_START,
    BLUETOOTH_SCANNING_STOP
} from '../../lib/constants'

export function fetchUnpairedDevices(){
    return async function(dispatch){
        try {
            dispatch(setState(BLUETOOTH_SCANNING_START))
            let isBluetoothEnabled = await BluetoothSerial.isEnabled()
            if(!isBluetoothEnabled){
                BluetoothSerial.enable()
            }
            let pairedDevices = await BluetoothSerial.list()
            let unpairedDevices = await BluetoothSerial.discoverUnpairedDevices()
            dispatch(setState(BLUETOOTH_SCANNING_STOP, {
                unpairedDevices,
                pairedDevices
            }))
        } catch (error) {
            dispatch(setState(BLUETOOTH_SCANNING_STOP, []))
        }
    }
}