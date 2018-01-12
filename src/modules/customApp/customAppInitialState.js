'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   isLoaderRunning : false,
   customUrl : '',
   scannerText : '',
})

export default InitialState 