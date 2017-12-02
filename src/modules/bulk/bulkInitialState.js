'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   isLoaderRunning:false,
   bulkConfigList:[],
   bulkTransactionList:{},
   selectedItems : [],
   selectAllNone:'Select All',
   isSelectAllVisible:false
})

export default InitialState