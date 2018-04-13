import { Record } from 'immutable'
var InitialState = Record({
    mainMenuList: [],
    subMenuList: [],
    utilities: {
        pieChartEnabled: false,
        messagingEnabled: false
    },
    pagesLoading: false,
    pieChartSummaryCount: {
        pendingCounts: 0,
        successCounts: 0,
        failCounts: 0,
    },
    customErpPullActivated: false,
    syncStatus: 'OK',
    erpSyncStatus: null,
    unsyncedTransactionList: [],
    moduleLoading: false,
    chartLoading: false,
    lastSyncTime: null,
    isLoggingOut: false,
    isUnsyncTransactionOnLogout: false,
    backupUploadView: 0,
    uploadingFileCount: 0,
    failedUploadCount: 0,
    unsyncBackupFilesList: [],
    trackingServiceStarted: false,
    customErpPullActivated: null,
    erpModalVisible: false,
    lastErpSyncTime: null,
    draftNewJobInfo: null,
})
export default InitialState

