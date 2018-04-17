'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    showImage: true,
    imageData: '',
    viewData: '',
    validation: null
})

export default InitialState