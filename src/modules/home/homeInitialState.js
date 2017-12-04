'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    moduleLoading: false,
    chartLoading: false,
    count: null,
})

export default InitialState