'use strict'

import backupReducer from '../backupReducer'
import {
    SET_LOADER_BACKUP,
    SET_BACKUP_FILES,
    SET_BACKUP_VIEW,
    SET_UPLOADING_FILE,
    SET_SYNCED_FILES
} from '../../../lib/constants'

import InitialState from '../backupInitialState'

describe('test cases for case SET_LOADER_BACKUP', () => {
    it('should set isLoading', () => {
        const action = {
            type: SET_LOADER_BACKUP,
            payload: true
        }
        let nextState = backupReducer(undefined, action)
        expect(nextState.isLoading).toEqual(true)
    })
})

describe('test cases for case SET_BACKUP_FILES', () => {
    it('should set backup files', () => {
        const files = {
            syncedBackupFiles: {},
            unsyncedBackupFiles: {}
        }
        const action = {
            type: SET_BACKUP_FILES,
            payload: files
        }
        let nextState = backupReducer(undefined, action)
        expect(nextState.syncedFiles).toEqual(files.syncedBackupFiles)
        expect(nextState.unSyncedFiles).toEqual(files.unsyncedBackupFiles)
        expect(nextState.isLoading).toEqual(false)
    })
})

describe('test cases for case SET_BACKUP_VIEW', () => {
    it('should set backup view', () => {
        const action = {
            type: SET_BACKUP_VIEW,
            payload: 1
        }
        let nextState = backupReducer(undefined, action)
        expect(nextState.backupView).toEqual(action.payload)
    })
})

describe('test cases for case SET_UPLOADING_FILE', () => {
    it('should set uploading file', () => {
        const uploadingFile = {}
        const action = {
            type: SET_UPLOADING_FILE,
            payload: uploadingFile
        }
        let nextState = backupReducer(undefined, action)
        expect(nextState.fileUploading).toEqual(uploadingFile)
        expect(nextState.backupView).toEqual(1)
    })
})

describe('test cases for case SET_SYNCED_FILES', () => {
    it('should set synced files', () => {
        const syncedFiles = {}
        const action = {
            type: SET_SYNCED_FILES,
            payload: syncedFiles
        }
        let nextState = backupReducer(undefined, action)
        expect(nextState.syncedFiles).toEqual(action.payload)
    })
})

describe('test cases for undefined action', () => {
    it('should set initial state', () => {
        const action = {
            type: undefined
        }
        let nextState = backupReducer(undefined, action)
        expect(nextState.syncedFiles).toEqual({})
        expect(nextState.unSyncedFiles).toEqual({})
        expect(nextState.isLoading).toEqual(false)
        expect(nextState.backupView).toEqual(0)
        expect(nextState.fileUploading).toEqual({})
    })
})