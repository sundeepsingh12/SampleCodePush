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
} = require('../../../lib/constants').default

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { sync } from '../../../services/classes/Sync'
import { jobStatusService } from '../../../services/classes/JobStatus'
import { jobTransactionService } from '../../../services/classes/JobTransaction'
import { jobSummaryService } from '../../../services/classes/JobSummary'
import { tabsService } from '../../../services/classes/Tabs'
import * as realm from '../../../repositories/realmdb'
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
        const pageData = {
            pageJobTransactionCustomizationList: 'xyz',
            pageNumber: 2,
            isLastPage: false
        }
        expect(actions.jobFetchingEnd(pageData, tabId)).toEqual({
            type: JOB_FETCHING_END,
            payload: {
                jobTransactionCustomizationList: pageData.pageJobTransactionCustomizationList,
                pageNumber: pageData.pageNumber,
                isLastPage: pageData.isLastPage,
                tabId,
            }
        })
    })

    it('should set tabs list', () => {
        const tabsList = 'test'
        expect(actions.setTabsList(tabsList)).toEqual({
            type: SET_TABS_LIST,
            payload: tabsList
        })
    })

    it('should set fetching false', () => {
        const tabId = 13
        expect(actions.setFetchingFalse(tabId)).toEqual({
            type: SET_FETCHING_FALSE,
            payload: {
                tabId
            }
        })
    })

    it('should clear home state', () => {
        expect(actions.clearHomeState(tabId)).toEqual({
            type: CLEAR_HOME_STATE
        })
    })

    it('should fetch tabs', () => {
        const tabsList = [{
            tabId: 12
        }]
        const expectedActions = [
            {
                type: SET_TABS_LIST,
                payload: tabsList
            },
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(tabsList)
        const store = mockStore({})
        return store.dispatch(actions.fetchTabs())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions[0].payload).toEqual(expectedActions[0].payload)
            })
    })

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
            isLastPage : true,
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