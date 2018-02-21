'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    jobTransactionCustomizationList : [],
    isRefreshing : false,
    statusNextStatusListMap : {}
})

export default InitialState