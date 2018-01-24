'use strict'

const InitialState = require('./backupInitialState').default
import {
    SET_LOADER_BACKUP,
    SET_BACKUP_FILES,
    SET_BACKUP_VIEW,
    SET_UPLOADING_FILE,
    SET_SYNCED_FILES,
    SET_BACKUP_TOAST
} from '../../lib/constants'
const initialState = new InitialState()

export default function backupReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOADER_BACKUP:
            return state.set('isLoading', action.payload)
        case SET_BACKUP_FILES:
            return state.set('syncedFiles', action.payload.syncedBackupFiles)
                .set('unSyncedFiles', action.payload.unsyncedBackupFiles)
                .set('isLoading', false)
        case SET_BACKUP_VIEW:
            return state.set('backupView', action.payload)
        case SET_UPLOADING_FILE:
            return state.set('fileUploading', action.payload)
                .set('backupView', 1)
        case SET_SYNCED_FILES:
            return state.set('syncedFiles', action.payload.syncedBackupFiles)
                .set('toastMessage', action.payload.toastMessage)
                .set('isLoading', false)
        case SET_BACKUP_TOAST:
            return state.set('toastMessage', action.payload.toastMessage)

    }
    return state
}