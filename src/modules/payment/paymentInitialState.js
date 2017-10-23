'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    actualAmount: null,
    paymentError:null,
    isAmountEditable: false,
    maxValue: null,
    minValue: null,
    moneyCollectMaster: null,
    originalAmount: null,
    paymentModeList: [],
    selectedIndex: 0,
    isSaveButtonDisabled: true,
    transactionNumber: null
})

export default InitialState