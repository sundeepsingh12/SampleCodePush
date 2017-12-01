'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    liveJobList: {},
    selectedItems: [],
    loaderRunning: false
})

export default InitialState