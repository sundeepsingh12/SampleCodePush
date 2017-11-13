'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   sequenceList:{},
   isSequenceScreenLoading:false,
   isResequencingDisabled:false
})

export default InitialState