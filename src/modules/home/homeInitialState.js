'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    syncStatus: null,
    unsyncedTransactionList: [],
    moduleLoading: false,
    chartLoading: false,
    count: null,
})

export default InitialState