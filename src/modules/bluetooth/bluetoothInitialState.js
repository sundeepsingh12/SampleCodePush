'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    isScanRunning: false,
    unpairedDevices:[],
    pairedDevices:[]
    
})

export default InitialState