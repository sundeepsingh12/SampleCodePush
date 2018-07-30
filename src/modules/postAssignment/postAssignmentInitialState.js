'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    jobTransactionMap: null,
    loading: null,
    pendingCount: 0,
    error: null,
    scanSuccess: false,
    jobMaster:null
})

export default InitialState