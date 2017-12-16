'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    progressBarMaxRange: 100,
    progressBarMinRange: 0,
    isDownLoadingDS: false,
    isDownLoadSuccessful: false,
})

export default InitialState