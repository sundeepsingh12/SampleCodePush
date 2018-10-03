'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    mosambeeLoader: false,
    mosambeeParameters: null,  
    mosambeeMessage: null,  
})

export default InitialState