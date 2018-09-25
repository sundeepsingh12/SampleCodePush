'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   jobMasterSummary : [],
   runSheetSummary: [],
   isLoaderRunning: false,
   currentActiveRunsheetId:0
})

export default InitialState 