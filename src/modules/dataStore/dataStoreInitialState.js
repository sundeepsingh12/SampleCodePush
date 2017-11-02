'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    isScannerEnabled: false,
    isAutoStartScannerEnabled: false,
    isSearchEnabled: false,
    isAllowFromField: false,
    dataStoreValue: '',
    dataStoreAttrValueMap: {},
    loaderRunning: false,
    errorMessage: '',
    searchText: '',
    detailsVisibleFor: -1,
})

export default InitialState