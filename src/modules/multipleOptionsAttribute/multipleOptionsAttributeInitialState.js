'use strict'
import { Record } from 'immutable'

// const InitialState = Record({
//     selectFromListState: {},
//     errorMessage: '',
//     totalItemsInSelectFromList: 0,
//     searchBarInputText: '',
//     filteredDataSelectFromList: {}
// })

const InitialState = Record({
    optionsMap: {},
    error: null,
    searchInput: null,
    advanceDropdownMessageObject: {}
})

export default InitialState