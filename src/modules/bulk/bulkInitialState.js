'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   isLoaderRunning:false,
   bulkConfigList:[],
   bulkTransactionList:{},
   selectedItems : []
})

export default InitialState