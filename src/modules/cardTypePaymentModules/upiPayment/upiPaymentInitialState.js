'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    approveTransactionAPIResponse: null,
    customerContact: null,
    customerName: null,
    payerVPA: null,
    upiConfigJSON: null,
})

export default InitialState