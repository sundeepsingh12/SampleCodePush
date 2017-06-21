'use strict'

const { Record } = require('immutable')
import {ListView} from 'react-native'
let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

var InitialState = Record({
    dataSource : ds,
    tabs: {
        name: '',
        jobs: [{
            line1: '',
            line2: '',
            circleLine1: '',
            circleLine2: '',
        }
        ]
    },
    revertService : '',
    downloadService : '',
    searchText : '',
    isFetching : false,
    pageNumber : 0,
    lazydata : []
})

export default InitialState