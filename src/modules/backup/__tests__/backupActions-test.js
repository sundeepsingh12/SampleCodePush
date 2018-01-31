'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../backupActions'

import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import {
    USER,
    SET_LOADER_BACKUP,
    SET_BACKUP_FILES,
    SET_BACKUP_VIEW,
    SET_UPLOADING_FILE,
    SET_SYNCED_FILES
} from '../../../lib/constants'
import { backupService } from '../../../services/classes/BackupService';
import RestAPIFactory from '../../../lib/RestAPIFactory';

describe('test cases for createManualBackup action', () => {

    it('should throw error for undefined user', () => {
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return store.dispatch(actions.createManualBackup({}))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[1].payload).toEqual(false)
            })
    })
    it('should set synced files', () => {
        const store = mockStore({})
        const user = { value: {} }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(user)
        backupService.createManualBackup = jest.fn()
        backupService.createManualBackup.mockReturnValue({})
        return store.dispatch(actions.createManualBackup({}))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(SET_SYNCED_FILES)
                expect(store.getActions()[1].payload).toEqual({})
                expect(store.getActions()[2].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[2].payload).toEqual(false)
            })
    })
})

describe('test cases for getBackupList action', () => {

    it('should throw error for undefined user', () => {
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return store.dispatch(actions.getBackupList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[1].payload).toEqual(false)
            })
    })
    it('should set backup files', () => {
        const store = mockStore({})
        const user = { value: {} }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(user)
        backupService.getBackupFilesList = jest.fn()
        backupService.getBackupFilesList.mockReturnValue({})
        return store.dispatch(actions.getBackupList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(SET_BACKUP_FILES)
                expect(store.getActions()[1].payload).toEqual({})
            })
    })
})

describe('test cases for uploadBackupFile action', () => {

    it('should throw error for undefined token', () => {
        const store = mockStore({})
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        const filesMap = { 0: {} }
        return store.dispatch(actions.uploadBackupFile(0, filesMap))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_UPLOADING_FILE)
                expect(store.getActions()[0].payload).toEqual(filesMap[0])
                expect(store.getActions()[1].type).toEqual(SET_BACKUP_VIEW)
                expect(store.getActions()[1].payload).toEqual(0)
            })
    })
    it('should throw error for undefined file', () => {
        const store = mockStore({})
        const filesMap = { 1: {} }
        return store.dispatch(actions.uploadBackupFile(0, filesMap))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_BACKUP_VIEW)
                expect(store.getActions()[0].payload).toEqual(0)
            })
    })
    it('should set backup view as 2', () => {
        const store = mockStore({})
        const filesMap = { 0: {} }
        const responseBody = 'success,11-00'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('token')
        RestAPIFactory().uploadZipFile = jest.fn()
        RestAPIFactory().uploadZipFile.mockReturnValue(responseBody)
        return store.dispatch(actions.uploadBackupFile(0, filesMap))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_UPLOADING_FILE)
                expect(store.getActions()[0].payload).toEqual(filesMap[0])
                expect(store.getActions()[1].type).toEqual(SET_BACKUP_VIEW)
                expect(store.getActions()[1].payload).toEqual(2)
            })
    })
    it('should set backup view as 3 for failed response', () => {
        const store = mockStore({})
        const filesMap = { 0: {} }
        const responseBody = 'fail,11-00'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue('token')
        RestAPIFactory().uploadZipFile = jest.fn()
        RestAPIFactory().uploadZipFile.mockReturnValue(responseBody)
        return store.dispatch(actions.uploadBackupFile(0, filesMap))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(SET_UPLOADING_FILE)
                expect(store.getActions()[0].payload).toEqual(filesMap[0])
                expect(store.getActions()[1].type).toEqual(SET_BACKUP_VIEW)
                expect(store.getActions()[1].payload).toEqual(3)
            })
    })
    
})

describe('test cases for deleteBackupFile action', () => {

    it('should throw error for undefined file', () => {
        const store = mockStore({})
        const filesMap = { 1: {} }
        return store.dispatch(actions.deleteBackupFile(0, filesMap))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[1].payload).toEqual(false)
            })
    })
    it('should throw error for undefined user', () => {
        const store = mockStore({})
        const filesMap = { 0: {} }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return store.dispatch(actions.deleteBackupFile(0, filesMap))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(store.getActions()[1].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[1].payload).toEqual(false)
            })
    })
    it('should set backup files list', () => {
        const store = mockStore({})
        const filesMap = { 0: {} }
        const user = { value: {} }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(user)
        backupService.deleteBackupFile = jest.fn()
        backupService.getBackupFilesList = jest.fn()
        backupService.getBackupFilesList.mockReturnValue({})
        return store.dispatch(actions.deleteBackupFile(0, filesMap))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(SET_LOADER_BACKUP)
                expect(store.getActions()[0].payload).toEqual(true)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(backupService.deleteBackupFile).toHaveBeenCalledTimes(1)
                expect(backupService.getBackupFilesList).toHaveBeenCalledTimes(1)
                expect(store.getActions()[1].type).toEqual(SET_BACKUP_FILES)
                expect(store.getActions()[1].payload).toEqual({})
            })
    })
})