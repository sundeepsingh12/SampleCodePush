'use strict'
import { Record } from 'immutable'

const InitialState = Record({
    optionsMap: {},
    error: null,
    searchInput: null,
    advanceDropdownMessageObject: {}
})

export default InitialState