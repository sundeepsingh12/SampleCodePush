'use strict'

import * as actions from '../taskListActions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { jobMasterService } from '../../../services/classes/JobMaster'
import { jobTransactionService } from '../../../services/classes/JobTransaction'
import { transactionCustomizationService } from '../../../services/classes/TransactionCustomization'
import {
    JOB_LISTING_START,
    JOB_LISTING_END,
    SET_TABS_LIST,
    SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE
} from '../../../lib/constants'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

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
                    tabsList: tabsListResult,
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
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        jobTransactionService.getAllJobTransactionsCustomizationList = jest.fn()
        transactionCustomizationService.getJobListingParameters = jest.fn()
        jobTransactionService.getEnableMultiPartJobMaster = jest.fn()
        jobTransactionService.getJobIdGroupIdMap = jest.fn()
        jobTransactionService.getFutureRunsheetEnabledAndSelectedDate = jest.fn()
    })

    let jobMasterWithEnableMultiPart = [{
        id: 1
    },
    {
        id: 2
    }]

    let jobIdGroupIdMap = {
        "1": "xyz",
        "2": "abc"
    }
    it('should fetch jobs', () => {
        const jobTransactionCustomizationList = []

        const statusNextStatusListMap = {}
        const expectedActions = [
            {
                type: JOB_LISTING_START,
            },
            {
                type: SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE,
                payload: { enableFutureDateRunsheet: false, selectedDate: null }
            },
            {
                type: JOB_LISTING_END,
                payload: {
                    jobTransactionCustomizationList,
                    statusNextStatusListMap
                }
            }
        ]
        jobTransactionService.getJobIdGroupIdMap.mockReturnValue(jobIdGroupIdMap)
        transactionCustomizationService.getJobListingParameters.mockReturnValue({})
        jobTransactionService.getAllJobTransactionsCustomizationList.mockReturnValueOnce({ jobTransactionCustomizationList, statusNextStatusListMap })
        jobTransactionService.getFutureRunsheetEnabledAndSelectedDate.mockReturnValue({ enableFutureDateRunsheet: false, selectedDate: null })
        const store = mockStore({})
        return store.dispatch(actions.fetchJobs())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(jobTransactionService.getAllJobTransactionsCustomizationList).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[2].payload)
            })
    })
})

describe('test cases for action shouldFetchJobsOrNot', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
    })
    it('should fetch jobs when jobTransactionCustomizationList is empty', () => {
        const statusNextStatusListMap = {}
        let jobIdGroupIdMap = {
            "1": "xyz",
            "2": "abc"
        }
        const expectedActions = [
            {
                type: JOB_LISTING_START,
            },
            {
                type: SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE,
                payload: { enableFutureDateRunsheet: false, selectedDate: null }
            },
            {
                type: JOB_LISTING_END,
                payload: {
                    jobTransactionCustomizationList,
                    statusNextStatusListMap
                }
            }
        ]
        jobTransactionService.getJobIdGroupIdMap.mockReturnValue(jobIdGroupIdMap)
        transactionCustomizationService.getJobListingParameters.mockReturnValue({})
        jobTransactionService.getAllJobTransactionsCustomizationList.mockReturnValueOnce({ jobTransactionCustomizationList, statusNextStatusListMap })
        jobTransactionService.getFutureRunsheetEnabledAndSelectedDate.mockReturnValue({ enableFutureDateRunsheet: false, selectedDate: null })
        const jobTransactionCustomizationList = []
        const shouldFetchJobs = {
            value: true
        }
        keyValueDBService.getValueFromStore.mockReturnValue(shouldFetchJobs)
        const store = mockStore({})
        return store.dispatch(actions.shouldFetchJobsOrNot(jobTransactionCustomizationList))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(jobTransactionService.getAllJobTransactionsCustomizationList).toHaveBeenCalledTimes(2)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[2].payload)
            })
    })

    it('should not fetch jobs when should reload jobs is false', () => {
        const jobTransactionCustomizationList = [{
            x: 1
        }]
        const shouldFetchJobs = {
            value: false
        }
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(shouldFetchJobs)
        const store = mockStore({})
        return store.dispatch(actions.shouldFetchJobsOrNot(jobTransactionCustomizationList))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
            })
    })
})