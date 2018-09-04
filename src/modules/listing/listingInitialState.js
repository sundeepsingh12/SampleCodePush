'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    jobTransactionCustomizationList: [],
    isRefreshing: false,
    updatedTransactionListIds: []
})

export default InitialState