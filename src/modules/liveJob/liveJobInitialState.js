'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    jobDataList: [],
    jobTransaction: null,
    currentStatus: null,
    liveJobDetailsLoading: false,
    toastMessage: '',
    isLoading: false
})

export default InitialState