'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    progressBarStatus: 70,
    fileName: '',
    downLoadingStatus: 0,
    lastSyncTime:''
})

export default InitialState