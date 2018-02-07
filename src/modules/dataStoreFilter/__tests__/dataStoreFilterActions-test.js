'use strict'
var actions = require('../dataStoreFilterActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
import {
    SHOW_LOADER_DSF,
    DATA_STORE_FILTER_LIST,
    SEARCHED_DATA_STORE_FILTER_LIST,
    SET_DSF_REVERSE_MAP,
} from '../../../lib/constants'
import CONFIG from '../../../lib/config'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { dataStoreFilterService } from '../../../services/classes/DataStoreFilterService'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)



describe('test for getDSFListContent', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DSF,
        payload: true
    }, {
        type: DATA_STORE_FILTER_LIST,
        payload: {}
    }, {
        type: SET_DSF_REVERSE_MAP,
        payload: {}
    }]

    it('should set dataStoreFilterResponse and dataStoreFilterReverseMap', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})

        dataStoreFilterService.fetchDataForFilter = jest.fn()
        dataStoreFilterService.fetchDataForFilter.mockReturnValue({
            dataStoreFilterResponse: {},
            dataStoreFilterReverseMap: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.getDSFListContent('abc', {}, null, null))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(dataStoreFilterService.fetchDataForFilter).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[2].payload)
            })
    })
})

describe('test for getFilteredResults', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DSF,
        payload: true
    }, {
        type: SEARCHED_DATA_STORE_FILTER_LIST,
        payload: {
            dataStoreFilterList: {},
            cloneDataStoreFilterList: {}
        }
    }]

    it('should set dataStoreFilterResponse and dataStoreFilterReverseMap', () => {
        dataStoreFilterService.searchDSFList = jest.fn()
        dataStoreFilterService.searchDSFList.mockReturnValue({
            dataStoreFilterList: {},
            cloneDataStoreFilterList: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.getFilteredResults('abc', {}, null))
            .then(() => {
                expect(dataStoreFilterService.searchDSFList).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})


describe('test for onSave', () => {

    it('should set formElement to formLayout state', () => {
        dataStoreFilterService.clearMappedDSFValue = jest.fn()
        dataStoreFilterService.clearMappedDSFValue.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.onSave('abc', {}, null))
            .then(() => {
                expect(dataStoreFilterService.clearMappedDSFValue).toHaveBeenCalledTimes(1)
            })
    })
})
