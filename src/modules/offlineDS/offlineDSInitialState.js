'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    progressBarStatus: 0,
    fileName: '',
    downLoadingStatus: 0,
    lastSyncTime:''
})

export default InitialState