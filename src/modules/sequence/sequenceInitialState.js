'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   sequenceList:{},
   isSequenceScreenLoading:false,
   isResequencingDisabled:false,
   unallocatedTransactionCount:0,
   responseMessage:''
   
})

export default InitialState