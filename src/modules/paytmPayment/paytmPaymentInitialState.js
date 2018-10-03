'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    paytmLoader: false,
    paytmConfigObject: {},
    contactNumber: '',
    otp: '',
    actualAmount: 0,
    showCheckTransaction: null
})

export default InitialState