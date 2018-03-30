'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    isScannerEnabled: false,
    isAutoStartScannerEnabled: false,
    isSearchEnabled: false,
    isMinMaxValidation: false,
    dataStoreValue: '',
    dataStoreAttrValueMap: {},
    loaderRunning: false,
    errorMessage: '',
    searchText: '',
    detailsVisibleFor: -1,
    isSaveSuccessful: false,
    value: '',
    isFiltersPresent: true,
    cloneDataStoreAttrValueMap: {},
    isAllowFromFieldInExternalDS: false,
})

export default InitialState