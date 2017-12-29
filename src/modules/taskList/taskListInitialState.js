'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    tabsList: [],
    tabIdStatusIdMap: {},
    downloadingJobs : false,
    isFutureRunsheetEnabled : false,
    selectedDate: null,
    isCalendarVisible:false,
    searchText:null,
    searchTap: null,
})

export default InitialState