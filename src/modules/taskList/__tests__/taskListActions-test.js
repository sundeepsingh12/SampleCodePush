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
    SET_TABS_LIST
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
    it('should fetch jobs', () => {
        const jobTransactionCustomizationList = [
            {
                line1: 'xyz',
                line2: 'abc'
            }
        ]
        const expectedActions = [
            {
                type: JOB_LISTING_START,
            },
            {
                type: JOB_LISTING_END,
                payload: {
                    jobTransactionCustomizationList
                }
            }
        ]
        jobTransactionService.getAllJobTransactionsCustomizationList = jest.fn()
        jobTransactionService.getAllJobTransactionsCustomizationList.mockReturnValue(jobTransactionCustomizationList)
        transactionCustomizationService.getJobListingParameters = jest.fn()
        transactionCustomizationService.getJobListingParameters.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.fetchJobs())
            .then(() => {
                expect(transactionCustomizationService.getJobListingParameters).toHaveBeenCalledTimes(1)
                expect(jobTransactionService.getAllJobTransactionsCustomizationList).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})