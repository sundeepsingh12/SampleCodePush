'use strict'

const { Record } = require('immutable')

const InitialState = Record({
    selectFromListState: {},
    errorMessage: '',
    dropdownValue: '',
})

export default InitialState