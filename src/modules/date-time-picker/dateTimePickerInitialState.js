'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    isComponentVisible: false,
    value:[''],
    arrayValue:[''],
})

export default InitialState