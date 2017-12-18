'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    jobTransactionMap: null,
    loading: null,
    pendingCount: 0,
    error: null,
    scanSuccess: false,
    isManualSelectionAllowed: false,
    isForceAssignmentAllowed: false,
    scanError: null
})

export default InitialState