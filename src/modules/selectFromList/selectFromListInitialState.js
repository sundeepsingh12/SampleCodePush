'use strict'

const { Record } = require('immutable')

const InitialState = Record({
    selectFromListState: {},
    errorMessage: ''
})

export default InitialState