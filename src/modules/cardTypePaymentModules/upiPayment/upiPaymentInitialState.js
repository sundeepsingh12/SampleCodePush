'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    customerContact: null,
    customerName: null,
    payerVPA: null,
    transactionId: null,
    upiApproval: false,
    upiConfigJSON: null,
})

export default InitialState