'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    jobTransactionCustomizationList : [],
    isRefreshing : false,
})

export default InitialState