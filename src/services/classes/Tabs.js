'use strict'

const {
    TAB
} = require('../../lib/constants').default
import { keyValueDBService } from './KeyValueDBService'

class Tabs {

    getAllTabs() {
        console.log('getAllTabs')
        
        console.log(tabs)
        return tabs
    }
}

export let tabsService = new Tabs()