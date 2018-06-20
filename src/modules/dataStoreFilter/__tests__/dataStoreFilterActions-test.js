'use strict'
var actions = require('../dataStoreFilterActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
import {
    SHOW_LOADER_DSF,
    DATA_STORE_FILTER_LIST,
    SEARCHED_DATA_STORE_FILTER_LIST,
    SET_DSF_REVERSE_MAP,
    SET_ARRAY_DATA_STORE_FILTER_MAP,
} from '../../../lib/constants'
import CONFIG from '../../../lib/config'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { dataStoreFilterService } from '../../../services/classes/DataStoreFilterService'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import { Toast } from 'native-base'



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
    }, {
        type: SHOW_LOADER_DSF,
        payload: false
    }]

    it('should throw an error', () => {
        keyValueDBService.getValueFromStore = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        return store.dispatch(actions.getDSFListContent('abc', {}, null, null))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(Toast.show).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[3].payload)
            })
    })

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
    }, {
        type: SHOW_LOADER_DSF,
        payload: false
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


    it('should throw an error', () => {
        dataStoreFilterService.searchDSFList = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        return store.dispatch(actions.getFilteredResults('abc', {}, null))
            .then(() => {
                expect(dataStoreFilterService.searchDSFList).toHaveBeenCalled()
                expect(Toast.show).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})


describe('test for onSave', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DSF,
        payload: false
    }]
    let formLayoutState = {
        latestPositionId: 1,
        formElement: {}
    }
    let arrayElements = {
        formElement: {
            0: {
                formLayoutObject: {}
            }
        }
    }
    it('should set formElement to formLayout state', () => {
        dataStoreFilterService.clearMappedDSFValue = jest.fn()
        dataStoreFilterService.clearMappedDSFValue.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.onSave('abc', formLayoutState, null, null, 1, false, {}, 1233, null))
            .then(() => {
                expect(dataStoreFilterService.clearMappedDSFValue).toHaveBeenCalledTimes(1)
            })
    })

    it('should set formElement to formLayout state in array', () => {
        dataStoreFilterService.clearMappedDSFValue = jest.fn()
        dataStoreFilterService.clearMappedDSFValue.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.onSave('abc', arrayElements, '123', {}, {}, true, 0, {}, 1))
            .then(() => {
                expect(dataStoreFilterService.clearMappedDSFValue).toHaveBeenCalledTimes(1)
            })
    })

    it('should throw an error', () => {
        dataStoreFilterService.clearMappedDSFValue = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.onSave('abc'))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})



describe('test for getDSFListContentForArray', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DSF,
        payload: true
    }, {
        type: DATA_STORE_FILTER_LIST,
        payload: {}
    }, {
        type: SET_ARRAY_DATA_STORE_FILTER_MAP,
        payload: {}
    }, {
        type: SHOW_LOADER_DSF,
        payload: false
    }]

    it('should set dataStoreFilterResponse and arrayReverseDataStoreFilterMap in case of array', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})

        dataStoreFilterService.fetchDataForFilterInArray = jest.fn()
        dataStoreFilterService.fetchDataForFilterInArray.mockReturnValue({
            dataStoreFilterResponse: {},
            arrayReverseDataStoreFilterMap: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.getDSFListContentForArray('abc'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(dataStoreFilterService.fetchDataForFilterInArray).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[2].payload)
            })
    })

    it('should throw an error', () => {
        keyValueDBService.getValueFromStore = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        return store.dispatch(actions.getDSFListContentForArray('abc'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(Toast.show).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[3].payload)
            })
    })
})