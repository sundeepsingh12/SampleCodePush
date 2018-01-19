'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    actualAmount: null,
    paymentError: null,
    isAmountEditable: false,
    maxValue: null,
    minValue: null,
    moneyCollectMaster: null,
    originalAmount: null,
    paymentModeList: {},
    selectedPaymentMode: 0,
    isSaveButtonDisabled: true,
    transactionNumber: null,
    splitPaymentMode: null,
    splitPaymentModeMap: {},
    jobTransactionIdAmountMap: null
})

export default InitialState