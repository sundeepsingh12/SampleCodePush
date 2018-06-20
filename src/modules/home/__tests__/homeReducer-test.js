'use strict'

import {
    PAGES_LOADING,
    SET_PAGES_UTILITY_N_PIESUMMARY,
    SYNC_STATUS,
    CHART_LOADING,
    RESET_STATE,
    LAST_SYNC_TIME,
    TOGGLE_LOGOUT,
    SET_UNSYNC_TRANSACTION_PRESENT,
    SET_BACKUP_UPLOAD_VIEW,
    SET_UPLOAD_FILE_COUNT,
    SET_FAIL_UPLOAD_COUNT,
    SET_BACKUP_FILES_LIST,
    SET_TRANSACTION_SERVICE_STARTED,
    SET_ERP_PULL_ACTIVATED,
    ERP_SYNC_STATUS,
    SET_NEWJOB_DRAFT_INFO
} from '../../../lib/constants'

import homeReducer from '../homeReducer'

describe('home reducer', () => {
    it('it should set pages loader', () => {
        const action = {
            type: PAGES_LOADING,
            payload: {
                pagesLoading: false,
            }
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.pagesLoading).toBe(action.payload.pagesLoading)
    })

    it('it should set erp pull activated', () => {
        const action = {
            type: SET_ERP_PULL_ACTIVATED,
            payload: {
                customErpPullActivated: false,
            }
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.customErpPullActivated).toBe(action.payload.customErpPullActivated)
    })

    it('it should set pages loader', () => {
        const action = {
            type: SYNC_STATUS,
            payload: {
                unsyncedTransactionList: [],
                syncStatus: 'abc'
            }
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.unsyncedTransactionList).toBe(action.payload.unsyncedTransactionList)
        expect(nextState.syncStatus).toBe(action.payload.syncStatus)
    })

    it('it should set erp sync status', () => {
        const action = {
            type: ERP_SYNC_STATUS,
            payload: {
                syncStatus: 'abc',
                erpModalVisible: true,
                lastErpSyncTime: 'test'
            }
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.erpSyncStatus).toBe(action.payload.syncStatus)
        expect(nextState.erpModalVisible).toBe(action.payload.erpModalVisible)
        expect(nextState.lastErpSyncTime).toBe(action.payload.lastErpSyncTime)
    })

    it('it should set chart loading', () => {
        const action = {
            type: CHART_LOADING,
            payload: {
                loading: false,
                count: 1
            }
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.chartLoading).toBe(action.payload.loading)
        expect(nextState.pieChartSummaryCount).toBe(action.payload.count)
    })

    it('it should set last sync time', () => {
        const action = {
            type: LAST_SYNC_TIME,
            payload: 'test'
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.lastSyncTime).toBe(action.payload)
    })

    it('it should set logout', () => {
        const action = {
            type: TOGGLE_LOGOUT,
            payload: true
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.isLoggingOut).toBe(action.payload)
    })

    it('it should set unsync transactions present', () => {
        const action = {
            type: SET_UNSYNC_TRANSACTION_PRESENT,
            payload: true
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.isUnsyncTransactionOnLogout).toBe(action.payload)
    })

    it('it should set backup upload view when unsync backup present', () => {
        const action = {
            type: SET_BACKUP_UPLOAD_VIEW,
            payload: 1
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.backupUploadView).toBe(action.payload)
    })

    it('it should set count of files to upload', () => {
        const action = {
            type: SET_UPLOAD_FILE_COUNT,
            payload: 1
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.uploadingFileCount).toBe(action.payload)
    })

    it('it should set count of files failed', () => {
        const action = {
            type: SET_FAIL_UPLOAD_COUNT,
            payload: 1
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.failedUploadCount).toBe(action.payload)
    })

    it('it should set list of files to upload', () => {
        const action = {
            type: SET_BACKUP_FILES_LIST,
            payload: []
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.unsyncBackupFilesList).toBe(action.payload)
    })

    it('it should set draft new job', () => {
        const action = {
            type: SET_NEWJOB_DRAFT_INFO,
            payload: {}
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.draftNewJobInfo).toBe(action.payload)
    })

    it('it should set transaction service started', () => {
        const action = {
            type: SET_TRANSACTION_SERVICE_STARTED,
            payload: true
        }
        let nextState = homeReducer(undefined, action)
        expect(nextState.trackingServiceStarted).toBe(action.payload)
    })

})