'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   jobMasterSummary : [],
   runSheetSummary: [],
   isLoaderRunning: false,
})

export default InitialState 