'use strict'

import { Record } from 'immutable'

var InitialState = Record({
   searchRefereneceValue: '',
   sortingDetails:{},
   errorMessage: '',
   loaderRunning: false,
})

export default InitialState 