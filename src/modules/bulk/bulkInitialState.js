'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   isLoaderRunning:false,
   bulkConfigList:[],
   bulktTransactionList:[]
  
})

export default InitialState