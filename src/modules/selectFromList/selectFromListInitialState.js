'use strict'

const { Record } = require('immutable')

const InitialState = Record({
    selectFromListState: {},
    errorMessage: '',
    totalItemsInSelectFromList: 0,
    searchBarInputText: '',
    filteredDataSelectFromList: {}
})

export default InitialState