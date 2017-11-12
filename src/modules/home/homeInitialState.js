'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    revertService: '',
    downloadService: '',
    searchText: '',
    isRefreshing: false,
    tabsList: [],
    tabIdStatusIdMap: {},
    downloadingJobs : false,
    loading: false,
})

export default InitialState