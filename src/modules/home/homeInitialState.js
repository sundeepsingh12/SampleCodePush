'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    loading: false,
    syncStatus: null,
    unsyncedTransactionList: [],
})

export default InitialState