'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    formLayoutStates: {},
    currentStatus: {},
    savedJobDetails: {},
    loaderRunning: false,
    isCheckoutVisible: false,
    checkoutData: {}
})

export default InitialState