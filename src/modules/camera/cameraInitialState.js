'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    imageData: '',
    viewData: '',
    validation: null,
    cameraLoader: false
})

export default InitialState