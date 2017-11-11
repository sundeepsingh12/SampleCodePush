'use strict'
var actions = require('../homeActions')
import {
  JOB_FETCHING_START,
    JOB_LISTING_END,
    JOB_REFRESHING_START,
    JOB_REFRESHING_WAIT,
    SET_FETCHING_FALSE,
    CLEAR_HOME_STATE,
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
} from '../../../lib/constants'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { sync } from '../../../services/classes/Sync'
import { jobStatusService } from '../../../services/classes/JobStatus'
import { jobTransactionService } from '../../../services/classes/JobTransaction'
import { jobSummaryService } from '../../../services/classes/JobSummary'
import { jobMasterService } from '../../../services/classes/JobMaster'
import * as realm from '../../../repositories/realmdb'
import _ from 'underscore'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)


describe('home actions for reducers', () => {

    it('should start job fetching', () => {
        const isRefresh = false
        expect(actions.jobFetchingStart(isRefresh)).toEqual({
            type: JOB_FETCHING_START,
            payload: {
                isRefresh
            }
        })
    })

    it('should start job ending', () => {
        const jobTransactionCustomizationList = [
            {
                id: 1,
                line1: 'xyz'
            },
            {
                id: 2,
                line1: 'abc'
            }
        ]
        expect(actions.jobFetchingEnd(jobTransactionCustomizationList)).toEqual({
            type: JOB_LISTING_END,
            payload: {
                jobTransactionCustomizationList
            }
        })
    })

    it('should set tabs list', () => {
        const tabsList = 'test'
        const tabIdStatusIdMap = 'teststatus'
        expect(actions.setTabsList(tabsList, tabIdStatusIdMap)).toEqual({
            type: SET_TABS_LIST,
            payload: {
                tabsList,
                tabIdStatusIdMap
            }
        })
    })

    it('should clear home state', () => {
        expect(actions.clearHomeState()).toEqual({
            type: CLEAR_HOME_STATE
        })
    })

})

describe('test cases for action fetchTabs', () => {
    it('should fetch tabs', () => {
        const tabsList = {
            value: [
                {
                    tabId: 12
                }
            ]
        }
        const tabsListResult = [
            {
                tabId: 12
            }
        ]
        const tabIdStatusIdMap = {
            12: [1, 2]
        }
        const expectedActions = [
            {
                type: SET_TABS_LIST,
                payload: {
                    tabsList : tabsListResult,
                    tabIdStatusIdMap
                }
            },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(tabsList)
        jobMasterService.prepareTabStatusIdMap = jest.fn()
        jobMasterService.prepareTabStatusIdMap.mockReturnValue(tabIdStatusIdMap)
        const store = mockStore({})
        return store.dispatch(actions.fetchTabs())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(jobMasterService.prepareTabStatusIdMap).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test cases for action fetchJobs', () => {
    it('should fetch jobs', () => {
        const tabId = 12, pageNumber = 0
        const pageData = {
            pageJobTransactionCustomizationList: [
                {
                    id: 1,
                    line1: xyz
                }
            ],
            pageNumber: 0,
            isLastPage: true,
        }
        const expectedActions = [
            {
                type: JOB_FETCHING_START,
                payload: {
                    tabId,
                    isRefresh
                }
            },
            {
                type: JOB_FETCHING_END,
                payload: {
                    jobTransactionCustomizationList: pageData.pageJobTransactionCustomizationList,
                    pageNumber: pageData.pageNumber,
                    isLastPage: pageData.isLastPage,
                    tabId,
                }
            }
        ]
        jobTransactionService.getJobTransactions = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(pageData)
        const store = mockStore({})
        return store.dispatch(actions.fetchJobs())
            .then(() => {
                expect(jobTransactionService.getJobTransactions).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[0].type)
                expect(store.getActions[1].payload).toEqual(expectedActions[0].payload)
            })
    })
})