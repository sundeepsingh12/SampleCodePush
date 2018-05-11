'use strict'
import {
    JOB_MASTER,
    JOB_STATUS,
    START_FETCHING_BULK_TRANSACTIONS,
    STOP_FETCHING_BULK_TRANSACTIONS,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM,
    TOGGLE_ALL_JOB_TRANSACTIONS,
    CUSTOMIZATION_APP_MODULE,
    SET_BULK_SEARCH_TEXT,
    CUSTOMIZATION_LIST_MAP,
    SET_BULK_ERROR_MESSAGE,
    SET_BULK_TRANSACTION_PARAMETERS
} from '../../../lib/constants'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
var actions = require('../bulkActions')
import { jobStatusService } from '../../../services/classes/JobStatus'

import configureStore from 'redux-mock-store'
import { bulkService } from '../../../services/classes/Bulk';
const middlewares = [thunk]
const mockStore = configureStore(middlewares)


describe('test for toggleAllItems', () => {
    bulkService.getBulkJobSimilarityConfig = jest.fn()
    bulkService.getDisplayTextAndSelectAll = jest.fn()
    it('should select none transactions when similarity check is not set', () => {
        const allTransactions = {
            1: {
                isChecked: false,
                disabled: false
            }
        }
        const bulkTransactions = {
            1: {
                isChecked: true
            }
        }
        const selectAllNone = 'Select None'
        const displayText = 'Select All'
        const selectedItems = {}
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions: allTransactions,
                    displayText,
                    selectAll: true
                }
            }
        ]
        bulkService.getBulkJobSimilarityConfig.mockReturnValue(null)
        bulkService.getDisplayTextAndSelectAll.mockReturnValue({ selectAll: true, displayText })
        const store = mockStore({})
        store.dispatch(actions.toggleAllItems(bulkTransactions, selectAllNone, {}))
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)

    })
    it('should select all transactions', () => {
        const allTransactions = {
            1: {
                id: 1,
                isChecked: false,
                jobId: 1,
                jobMasterId: 1
            }
        }
        const bulkTransactions = {
            1: {
                id: 1,
                isChecked: true,
                jobId: 1,
                jobMasterId: 1
            }
        }
        const displayText = 'Select None'
        const selectAllNone = 'Select All'
        const selectedItems = {
            1: {
                jobTransactionId: 1,
                jobId: 1,
                jobMasterId: 1
            }
        }
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions,
                    displayText,
                    selectAll: true
                }
            }
        ]
        const store = mockStore({})
        bulkService.getBulkJobSimilarityConfig.mockReturnValue(null)
        bulkService.getDisplayTextAndSelectAll.mockReturnValue({ selectAll: true, displayText })
        store.dispatch(actions.toggleAllItems(allTransactions, selectAllNone, {}))
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
    })


    it('should select no transactions when similarity check is enabled', () => {
        const allTransactions = {
            1: {
                id: 1,
                isChecked: false,
                jobId: 1,
                jobMasterId: 1,
                disabled: true
            }
        }
        const bulkTransactions = {
            1: {
                id: 1,
                isChecked: false,
                jobId: 1,
                jobMasterId: 1,
                disabled: true
            }
        }
        const displayText = 'Select None'
        const selectAllNone = 'Select All'
        const selectedItems = {
            1: {
                jobTransactionId: 1,
                jobId: 1,
                jobMasterId: 1
            }
        }
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems: {},
                    bulkTransactions,
                    displayText,
                    selectAll: true
                }
            }
        ]
        const store = mockStore({})
        bulkService.getBulkJobSimilarityConfig.mockReturnValue({})
        bulkService.getDisplayTextAndSelectAll.mockReturnValue({ selectAll: true, displayText })
        store.dispatch(actions.toggleAllItems(allTransactions, selectAllNone, {}))
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
    })
})
describe('test for toggleMultipleTransactions', () => {

    it('should select one transactions', () => {
        const allTransactions = {
            1: {
                id: 1,
                isChecked: false,
                jobId: 1,
                jobMasterId: 1
            }
        }
        const bulkTransactions = {
            1: {
                id: 1,
                isChecked: true,
                jobId: 1,
                jobMasterId: 1
            }
        }
        const jobTransactionList = [{
            id: 1,
            isChecked: false
        }]
        const displayText = 'Select None'
        const selectedItems = {
            1: {
                jobTransactionId: 1,
                jobId: 1,
                jobMasterId: 1
            }
        }

        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions,
                    displayText,
                    selectAll: true
                }
            }
        ]
        const store = mockStore({})
        bulkService.getBulkJobSimilarityConfig.mockReturnValue(null)
        bulkService.getDisplayTextAndSelectAll.mockReturnValue({ selectAll: true, displayText })
        store.dispatch(actions.toggleMultipleTransactions(jobTransactionList, allTransactions, {}))
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
    })
    it('should select all transactions', () => {
        const allTransactions = {
            1: {
                id: 1,
                jobId: 1,
                jobMasterId: 1,
                isChecked: false
            },
            2: {
                id: 2,
                jobId: 2,
                jobMasterId: 2,
                isChecked: false
            }
        }
        const jobTransactionList = [{
            id: 1,
            isChecked: false
        },
        {
            id: 2,
            isChecked: false
        }]
        const displayText = 'Select None'
        const selectedItems = {
            1: {
                jobTransactionId: 1,
                jobId: 1,
                jobMasterId: 1
            },
            2: {
                jobTransactionId: 2,
                jobId: 2,
                jobMasterId: 2
            }
        }
        const bulkTransactions = {
            1: {
                isChecked: true,
                id: 1,
                jobId: 1,
                jobMasterId: 1
            },
            2: {
                isChecked: true,
                id: 2,
                jobId: 2,
                jobMasterId: 2
            }
        }
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions,
                    displayText,
                    selectAll: true
                }
            }
        ]
        const store = mockStore({})
        bulkService.getBulkJobSimilarityConfig.mockReturnValue(null)
        bulkService.getDisplayTextAndSelectAll.mockReturnValue({ selectAll: true, displayText })
        store.dispatch(actions.toggleMultipleTransactions(jobTransactionList, allTransactions, {}))
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)

    })
})

describe('test for set searched item', () => {

    it('should select one transactions', () => {
        const bulkTransactions = {
            1: {
                id: 1,
                isChecked: false,
                jobId: 1,
                jobMasterId: 1,
                referenceNumber: 'test'
            },
            2: {
                id: 2,
                isChecked: false,
                jobId: 2,
                jobMasterId: 2,
                referenceNumber: 'test2'
            }
        }
        const cloneBulk = {
            1: {
                id: 1,
                isChecked: true,
                jobId: 1,
                jobMasterId: 1,
                referenceNumber: 'test'
            },
            2: {
                id: 2,
                isChecked: false,
                jobId: 2,
                jobMasterId: 2,
                referenceNumber: 'test2'
            }
        }
        const searchvalue = 'test'
        const idToSeparatorMap = {}
        const selectedItems = {
            1: {
                jobTransactionId: 1,
                jobId: 1,
                jobMasterId: 1,
            },
        }
        const expectedActions = [
            {
                type: SET_BULK_TRANSACTION_PARAMETERS,
                payload: {
                    bulkTransactions,
                    selectedItems: {},
                    displayText: 'Select All',
                    searchText: '',
                    selectAll: true
                }
            }
        ]
        const searchResultObject = {
            errorMessage: ''
        }
        bulkService.performSearch = jest.fn()
        bulkService.performSearch.mockReturnValue({
            displayText: 'Select All',
            selectAll: true,
            errorMessage: ''
        })
        const store = mockStore({})
        store.dispatch(actions.setSearchedItem(searchvalue, bulkTransactions, false, idToSeparatorMap, {}, {}))
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)

    })
    it('should set error message', () => {
        const bulkTransactions = {
            1: {
                id: 1,
                isChecked: false
            },
            2: {
                id: 2,
                isChecked: false
            }
        }
        const searchvalue = 'test'
        const idToSeparatorMap = {}
        const searchResultObject = {
            jobTransactionArray: [{
                id: 1,
                isChecked: false
            },
            {
                id: 2,
                isChecked: false
            }
            ],
            errorMessage: 'invalid'
        }
        const expectedActions = [
            {
                type: SET_BULK_ERROR_MESSAGE,
                payload: searchResultObject.errorMessage
            }
        ]

        const store = mockStore({})
        bulkService.performSearch = jest.fn()
        bulkService.performSearch.mockReturnValue(searchResultObject)
        store.dispatch(actions.setSearchedItem(searchvalue, bulkTransactions, true, idToSeparatorMap))
        expect(bulkService.performSearch).toHaveBeenCalled()
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
    })
})

describe('test for getBulkJobTransactions', () => {

    it('should select one transactions', () => {
        const allTransactions = {
            1: {
                id: 1,
                jobId: 1,
                jobMasterId: 1
            }
        }
        const bulkParams = {
            pageObject: {
                additionalParams: JSON.stringify({
                    statusId: 1,
                    selectAll: true
                }),
                jobMasterIds: [1]
            }
        }

        const expectedActions = [
            {
                type: START_FETCHING_BULK_TRANSACTIONS,
            },
            {
                type: STOP_FETCHING_BULK_TRANSACTIONS,
                payload: {
                    bulkTransactions: allTransactions,
                    selectAll: true,
                    isManualSelectionAllowed: false,
                    searchSelectionOnLine1Line2: false,
                    idToSeparatorMap: undefined,
                    nextStatusList: []
                }
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        bulkService.getJobListingForBulk = jest.fn()
        jobStatusService.getJobStatusForJobStatusId = jest.fn()
        bulkService.getJobListingForBulk.mockReturnValue(allTransactions)
        jobStatusService.getJobStatusForJobStatusId.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.getBulkJobTransactions(bulkParams))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(bulkService.getJobListingForBulk).toHaveBeenCalled()
                expect(jobStatusService.getJobStatusForJobStatusId).toHaveBeenCalled()
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})