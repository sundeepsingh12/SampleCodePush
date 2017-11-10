'use strict'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { sortingService } from '../../../services/classes/sorting'
var actions = require('../sortingActions')
import CONFIG from '../../../lib/config'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

import {
    SORTING_SEARCH_VALUE,
    SORTING_ITEM_DETAILS,
    ERROR_MESSAGE,
    SHOW_LOADER
} from '../../../lib/constants'

describe('sorting actions', () => {

    let data = 
        {
        "0": {"id": 0, "label": "", "value": "NITESH-1510252533058"},
        "1": {"id": 1, "label": "Name", "value": "MANUPRA SINGH"},
        "2": {"id": 2, "label": "Sequence Number", "value": "1/1"},
        "3": {"id": 3, "label": "Employee Code", "value": "udyog12"}, 
        "4": {"id": 4, "value": "N.A"}
        }
        
    
    let jsonData = {
            firstName : 'MANUPRA',
            lastName : 'SINGH',
            jobsInRunsheet : '1',
            jobTransaction : {
            referenceNumber: 'NITESH-1510252533058',
            seqSelected: '1'
            },
            empHubCode : 'udyog12',
            addressData : undefined
       }
    const expectedActions = [
        {
            type: SHOW_LOADER,
            payload: true
        }, {
            type: SORTING_ITEM_DETAILS,
            payload: data
        }, {
            type: ERROR_MESSAGE,
            payload: {
                errorMessage: 'No records found for search',
                dataStoreAttrValueMap: {},
            }
        }
    ]

    it('should set reference value', () => {
        const referenceValue = 'NITESH-12136427487'
        expect(actions.searchReferenceValue(referenceValue)).toEqual({
            type: SORTING_SEARCH_VALUE,
            payload: {value : referenceValue}
        })
    })
    
    it('should get data for sorting and Printing list', () => {
        const referenceValue = 'NITESH-1510252533058'
        const token = {
            value :'test'
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        sortingService.getSortingData = jest.fn()
        sortingService.getSortingData.mockReturnValue(referenceValue,token.value)
        sortingService.setSortingData = jest.fn()
        sortingService.setSortingData.mockReturnValue(data,referenceValue)
        const store = mockStore({})
        return store.dispatch(actions.getDataForSortingAndPrinting())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(sortingService.getSortingData).toHaveBeenCalled()
                expect(sortingService.setSortingData).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
    it('should return error message', () => {
        const referenceValue = 'NITESH-151025253305'
        const token = { value : null}
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        sortingService.getSortingData = jest.fn()
        sortingService.getSortingData.mockReturnValue(referenceValue,token.value)
        sortingService.setSortingData = jest.fn()
        sortingService.setSortingData.mockReturnValue(data,referenceValue)
        const store = mockStore({})
        return store.dispatch(actions.getDataForSortingAndPrinting())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(sortingService.getSortingData).toHaveBeenCalled()
                expect(sortingService.setSortingData).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })       
})