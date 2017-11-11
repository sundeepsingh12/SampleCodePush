'use strict'

import {Record} from 'immutable'

var InitialState = Record({
    isCashTenderingLoaderRunning: false,
    cashTenderingList: {},
    totalAmount: 0,
    isReceive: true,
    cashTenderingListReturn: {},
    totalAmountReturn:0
})

export default InitialState