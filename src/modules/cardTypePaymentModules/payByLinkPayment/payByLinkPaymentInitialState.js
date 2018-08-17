'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    payByLinkConfigJSON: null,
    customerContact: null,
    payByLinkScreenLoader: false,
    payByLinkMessage: null
})

export default InitialState

