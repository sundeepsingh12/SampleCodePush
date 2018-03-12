'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    isLoaderRunning: false,
    bulkConfigList: [],
    bulkTransactionList: {},
    selectedItems: {},
    selectAllNone: 'Select All',
    isSelectAllVisible: false,
    searchText: null,
    isManualSelectionAllowed: true,
    searchSelectionOnLine1Line2: false,
    idToSeparatorMap: {},
    errorToastMessage: '',
    nextStatusList: []
})

export default InitialState