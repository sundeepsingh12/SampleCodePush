'use strict'

const { Record } = require('immutable')

const InitialState = Record({
    isLoaderRunning: false,
    fixedSKUList: {},
    totalQuantity: 0
})

export default InitialState
