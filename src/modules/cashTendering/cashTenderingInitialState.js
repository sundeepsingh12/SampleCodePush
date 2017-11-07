'use strict'

const { Record } = require('immutable')

const InitialState = Record({
    isCashTenderingLoaderRunning: false,
    cashTenderingList: {},
    totalAmount: 0,
    isReceive: true,
    cashTenderingListReturn: {},
    totalAmountReturn:0
})

export default InitialState