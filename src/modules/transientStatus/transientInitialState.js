'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    formLayoutStates: {},
    currentStatus: {},
    loaderRunning: false,
})

export default InitialState