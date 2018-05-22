'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    showImage: true,
    imageData: '',
    viewData: '',
    validation: null,
    cameraLoader: false
})

export default InitialState