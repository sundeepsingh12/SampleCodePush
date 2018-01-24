'use strict'

var actions = require('../offlineDSActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../../services/classes/DataStoreService'
import {
    SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR,
    UPDATE_PROGRESS_BAR,
    SET_DOWNLOADING_STATUS,
    SET_LAST_SYNC_TIME
} from '../../../lib/constants'
import CONFIG from '../../../lib/config'
import moment from 'moment'
import {
    LAST_SYNCED,
    NEVER_SYNCED
} from '../../../lib/AttributeConstants'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test for getLastSyncTime', () => {

    const lastSyncTime = {
        value: '27-07-2017'
    }
    const responseLastSyncTimeInFormat = '10 days'
    const expectedActions = [
        {
            type: SET_LAST_SYNC_TIME,
            payload: LAST_SYNCED + responseLastSyncTimeInFormat
        },
        {
            type: SET_LAST_SYNC_TIME,
            payload: NEVER_SYNCED
        }
    ]

    it('should set last sync time if present in store', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(lastSyncTime)
        dataStoreService.getLastSyncTimeInFormat = jest.fn()
        dataStoreService.getLastSyncTimeInFormat.mockReturnValue(responseLastSyncTimeInFormat)
        const store = mockStore({})
        return store.dispatch(actions.getLastSyncTime())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(dataStoreService.getLastSyncTimeInFormat).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should set never synced', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        const store = mockStore({})
        return store.dispatch(actions.getLastSyncTime())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })
    })
})



describe('test for syncDataStore', () => {

    const lastSyncTime = {
        value: '27-07-2017'
    }
    const responseLastSyncTimeInFormat = '10 days'
    const expectedActions = [
        {
            type: SET_DOWNLOADING_STATUS,
            payload: { downLoadingStatus: 1, progressBarStatus: 0 }
        },
        {
            type: SET_DOWNLOADING_STATUS,
            payload: { downLoadingStatus: 2, progressBarStatus: 0 }
        },
        {
            type: SET_DOWNLOADING_STATUS,
            payload: { downLoadingStatus: 3, progressBarStatus: 0 }
        }, {
            type: SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR,
            payload: { fileName: 'abc', progressBarStatus: 0 }
        }, {
            type: UPDATE_PROGRESS_BAR,
            payload: 100
        }
    ]

    it('should set last sync time and no data store master are present', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('temp')
        dataStoreService.getDataStoreMasters = jest.fn()
        dataStoreService.getDataStoreMasters.mockReturnValue(null)
        keyValueDBService.validateAndSaveData = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.syncDataStore())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(dataStoreService.getDataStoreMasters).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should set last sync time and no data store master are present', () => {
        keyValueDBService.getValueFromStore = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.syncDataStore())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })

    it('should set last sync time and data store master is present', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({
            value:123
        })
        dataStoreService.getDataStoreMasters = jest.fn()
        dataStoreService.getDataStoreMasters.mockReturnValue({
            123: 'abc'
        })
        dataStoreService.fetchDatastoreAndSaveInDB = jest.fn()
        dataStoreService.fetchDatastoreAndSaveInDB.mockReturnValue({
            numberOfElements: 100,
            totalElements: 100
        })
        keyValueDBService.validateAndSaveData = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.syncDataStore())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(dataStoreService.getDataStoreMasters).toHaveBeenCalledTimes(1)
                expect(dataStoreService.fetchDatastoreAndSaveInDB).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[3].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[4].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[4].payload)
                expect(store.getActions()[3].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[3].payload).toEqual(expectedActions[1].payload)
            })
    })


    it('should set last sync time and data store master is present but totalElements is 0', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({
            value:123
        })
        dataStoreService.getDataStoreMasters = jest.fn()
        dataStoreService.getDataStoreMasters.mockReturnValue({
            123: 'abc'
        })
        dataStoreService.fetchDatastoreAndSaveInDB = jest.fn()
        dataStoreService.fetchDatastoreAndSaveInDB.mockReturnValue({
            numberOfElements: 0,
            totalElements: 0
        })
        keyValueDBService.validateAndSaveData = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.syncDataStore())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(dataStoreService.getDataStoreMasters).toHaveBeenCalledTimes(1)
                expect(dataStoreService.fetchDatastoreAndSaveInDB).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[3].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[4].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[4].payload)
                expect(store.getActions()[3].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[3].payload).toEqual(expectedActions[1].payload)
            })
    })
})
