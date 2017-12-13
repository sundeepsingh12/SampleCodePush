'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    liveJobList: {},
    selectedItems: [],
    loaderRunning: false,
    searchText: '',
    liveJobToastMessage: ''
})

export default InitialState