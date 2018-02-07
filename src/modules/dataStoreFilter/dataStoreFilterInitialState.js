'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    isLoaderForDSFRunning: false,
    dataStoreFilterList: [],
    cloneDataStoreFilterList: [],
    DSFSearchText: '',
})

export default InitialState