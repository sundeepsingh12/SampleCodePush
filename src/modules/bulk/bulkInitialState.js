'use strict'

import { Record } from 'immutable'
import {
    SELECT_ALL
} from '../../lib/ContainerConstants'

var InitialState = Record({
    isLoaderRunning: false,
    bulkConfigList: [],
    bulkTransactionList: {},
    selectedItems: {},
    selectAllNone: SELECT_ALL,
    isSelectAllVisible: false,
    wantUnselectJob: null,
    searchText: null,
    isManualSelectionAllowed: true,
    searchSelectionOnLine1Line2: false,
    idToSeparatorMap: {},
    errorToastMessage: '',
    nextStatusList: [],
    checkAlertView: false
})

export default InitialState