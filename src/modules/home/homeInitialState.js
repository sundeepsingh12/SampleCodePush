'use strict'

const { Record } = require('immutable')
import { ListView } from 'react-native'
let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

var InitialState = Record({
    revertService: '',
    downloadService: '',
    searchText: '',
    tabIdJobTransactions: {},
    isRefreshing:false,
    tabsList: [],
})

export default InitialState