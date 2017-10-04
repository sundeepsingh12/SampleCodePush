'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    actualAmount: null,
    isAmountEditable: false,
    moneyCollectMaster: null,
    originalAmount: null,
    paymentModeList: [],
    selectedIndex: 0,
    isSaveButtonDisabled: true,
    transactionNumber: null
})

export default InitialState