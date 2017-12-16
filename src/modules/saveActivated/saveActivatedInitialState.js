'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    commonData: [],
    recurringData: {},
    isSignOffVisible: false,
    loading: false,
    headerTitle: '',
})

export default InitialState