'use strict'
var actions = require('../homeActions')
const {
  JOB_FETCHING_START,
    JOB_FETCHING_END,
    JOB_REFRESHING_START,
    JOB_REFRESHING_WAIT,
    SET_FETCHING_FALSE,
    UNSEEN,
    TABLE_JOB_TRANSACTION,
    TAB,
    SET_TABS_LIST,
    TABLE_FIELD_DATA,
    TABLE_JOB,
    TABLE_JOB_DATA,
    USER,
    TABLE_RUNSHEET,
    TABLE_JOB_TRANSACTION_CUSTOMIZATION
} = require('../../lib/constants').default

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import { jobStatusService } from '../../services/classes/JobStatus'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobSummaryService } from '../../services/classes/JobSummary'
import { tabsService } from '../../services/classes/Tabs'
import * as realm from '../../repositories/realmdb'
import _ from 'underscore'

describe('home actions', () => {
    
    it('should start job fetching', () => {
        const tabId = 2
        const isRefresh = false
        expect(actions.jobFetchingStart(tabId, isRefresh)).toEqual({
            type: JOB_FETCHING_START,
            payload: {
                tabId,
                isRefresh
            }
        })
    })

    it('should start job ending', () => {
        const tabId = 2
        const isRefresh = false
        expect(actions.jobFetchingEnd(tabId, isRefresh)).toEqual({
            type: JOB_FETCHING_START,
            payload: {
                tabId,
                isRefresh
            }
        })
    })
})