'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    jobTransactionCustomizationList : [],
    isRefreshing : false,
    jobIdGroupIdMap : {}
})

export default InitialState