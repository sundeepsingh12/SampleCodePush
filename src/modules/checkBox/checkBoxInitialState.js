'use strict'

const { Record } = require('immutable')

const InitialState = Record({
    isComponentVisible: false,
    checkBoxValues: {}
})

export default InitialState