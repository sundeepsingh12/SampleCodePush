'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    showLiveJobList: false,
    liveJobList: []
})

export default InitialState