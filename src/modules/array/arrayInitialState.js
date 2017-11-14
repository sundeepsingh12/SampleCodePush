'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    isSaveDisabled: true,
    arrayElements: {},
    isLoading: false,
    lastRowId: 0,
    childElementsTemplate: {},
    isValidConfiguration: true
})

export default InitialState