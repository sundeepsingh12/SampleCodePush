'use strict'

const { Record } = require('immutable')
import { ListView } from 'react-native'
let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

const Jobs = Record({
    lazydata: [],
    isFetching: false,
    pageNumber: 0,
    isRefreshing:false,
})

var InitialState = Record({
    revertService: '',
    downloadService: '',
    searchText: '',
    jobs: new Jobs(),
    tabsList: [],
})

export default InitialState