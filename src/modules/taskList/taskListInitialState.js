'use strict'

const { Record } = require('immutable')

var InitialState = Record({
    tabsList: [],
    tabIdStatusIdMap: {},
    downloadingJobs: false,
    isFutureRunsheetEnabled: false,
    selectedDate: null,
    isCalendarVisible: false,
    searchText: {},
    landingTabId: null
})

export default InitialState