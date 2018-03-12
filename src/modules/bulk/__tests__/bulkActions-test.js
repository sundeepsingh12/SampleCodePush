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
    SET_BULK_ERROR_MESSAGE
} from '../../../lib/constants'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
var actions = require('../bulkActions')

import configureStore from 'redux-mock-store'
import { bulkService } from '../../../services/classes/Bulk';
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test for toggleListItemIsChecked', () => {
    const jobTransactionId = 1
    const allTransactions = {
        1: {
            isChecked: false
        }
    }
    const selectedItems = [1]
    const bulkTransactions = {
        1: {
            isChecked: true
        }
    }
    const displayText = 'Select None'
    const expectedActions = [
        {
            type: TOGGLE_ALL_JOB_TRANSACTIONS,
            payload: {
                selectedItems,
                bulkTransactions,
                displayText
            }
        }
    ]
    it('should set all bulk transactions', () => {

        bulkService.getSelectedTransactionIds = jest.fn()
        bulkService.getSelectedTransactionIds.mockReturnValue([1])
        const store = mockStore({})
        return store.dispatch(actions.toggleListItemIsChecked(jobTransactionId, allTransactions))
            .then(() => {
                expect(bulkService.getSelectedTransactionIds).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for toggleAllItems', () => {

    it('should select none transactions', () => {
        const allTransactions = {
            1: {
                isChecked: false
            }
        }
        const bulkTransactions = {
            1: {
                isChecked: true
            }
        }
        const selectAllNone = 'Select None'
        const displayText = 'Select All'
        const selectedItems = []
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions: allTransactions,
                    displayText
                }
            }
        ]
        const store = mockStore({})
        return store.dispatch(actions.toggleAllItems(bulkTransactions, selectAllNone))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should select all transactions', () => {
        const allTransactions = {
            1: {
                isChecked: false
            }
        }
        const bulkTransactions = {
            1: {
                isChecked: true
            }
        }
        const displayText = 'Select None'
        const selectAllNone = 'Select All'
        const selectedItems = ['1']
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions,
                    displayText
                }
            }
        ]
        const store = mockStore({})
        return store.dispatch(actions.toggleAllItems(allTransactions, selectAllNone))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})
describe('test for toggleMultipleTransactions', () => {

    it('should select one transactions', () => {
        const allTransactions = {
            1: {
                isChecked: false
            },
            2: {
                isChecked: false
            }
        }
        const jobTransactionList = [{
            id: 1,
            isChecked: false
        }]
        const displayText = 'Select All'
        const selectedItems = [1]
        const bulkTransactions = {
            1: {
                isChecked: true
            },
            2: {
                isChecked: false
            }
        }
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions,
                    displayText
                }
            }
        ]
        const store = mockStore({})
        bulkService.getSelectedTransactionIds = jest.fn()
        bulkService.getSelectedTransactionIds.mockReturnValue([1])
        return store.dispatch(actions.toggleMultipleTransactions(jobTransactionList, allTransactions))
            .then(() => {
                expect(bulkService.getSelectedTransactionIds).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should select all transactions', () => {
        const allTransactions = {
            1: {
                isChecked: false
            },
            2: {
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
        const selectedItems = [1, 2]
        const bulkTransactions = {
            1: {
                isChecked: true
            },
            2: {
                isChecked: true
            }
        }
        const expectedActions = [
            {
                type: TOGGLE_ALL_JOB_TRANSACTIONS,
                payload: {
                    selectedItems,
                    bulkTransactions,
                    displayText
                }
            }
        ]
        const store = mockStore({})
        bulkService.getSelectedTransactionIds = jest.fn()
        bulkService.getSelectedTransactionIds.mockReturnValue([1, 2])
        return store.dispatch(actions.toggleMultipleTransactions(jobTransactionList, allTransactions))
            .then(() => {
                expect(bulkService.getSelectedTransactionIds).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for set searched item', () => {

    it('should select one transactions', () => {
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
        const expectedActions = [
            {
                type: SET_BULK_SEARCH_TEXT,
                payload: ''
            }
        ]
        const searchResultObject = {
            jobTransactionArray: [{
                id: 1,
                isChecked: false
            }],
            errorMessage: ''
        }
        const store = mockStore({})
        bulkService.performSearch = jest.fn()
        bulkService.performSearch.mockReturnValue(searchResultObject)
        return store.dispatch(actions.setSearchedItem(searchvalue, bulkTransactions, true, idToSeparatorMap))
            .then(() => {
                expect(bulkService.performSearch).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should select multiple transactions', () => {
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
        const expectedActions = [
            {
                type: SET_BULK_SEARCH_TEXT,
                payload: ''
            }
        ]
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
            errorMessage: ''
        }
        const store = mockStore({})
        bulkService.performSearch = jest.fn()
        bulkService.performSearch.mockReturnValue(searchResultObject)
        return store.dispatch(actions.setSearchedItem(searchvalue, bulkTransactions, true, idToSeparatorMap))
            .then(() => {
                expect(bulkService.performSearch).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
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
        return store.dispatch(actions.setSearchedItem(searchvalue, bulkTransactions, true, idToSeparatorMap))
            .then(() => {
                expect(bulkService.performSearch).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})