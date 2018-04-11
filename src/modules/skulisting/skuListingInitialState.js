'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    skuListingLoading: false,
    skuListItems: {},
    skuSearchTerm: '',
    isSearchBarVisible: false,
    skuObjectValidation: {},
    skuChildItems: {},
    skuObjectAttributeId: '',
    skuValidationForImageAndReason: {},
    reasonsList: [],
    searchText: '',
})

export default InitialState