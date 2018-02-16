'use strict'

import { Record } from 'immutable'
import React from 'react'
import BulkIcon from '../../../src/svg_components/icons/BulkIcon'
import LiveIcon from '../../../src/svg_components/icons/LiveIcon'
import SequenceIcon from '../../../src/svg_components/icons/SequenceIcon'
import TaskIcon from '../../../src/svg_components/icons/TaskIcon'
import JobAssignmentIcon from '../../svg_components/icons/JobAssignmentIcon'
import {
    JOB_ASSIGNMENT_DISPLAY,
    CUSTOM_APP_DISPLAY,
    SORTING_DISPLAY
} from '../../lib/ContainerConstants'
import SortParcelIcon from '../../../src/svg_components/icons/SortParcelIcon'
import WebUrlIcon from '../../../src/svg_components/icons/WebUrlIcon'

var InitialState = Record({
    modules: {
        START: {
            appModuleId: 4,
            displayName: 'All Tasks',
            enabled: false,
            icon: <TaskIcon />
        }, LIVE: {
            appModuleId: 13,
            displayName: 'Live',
            enabled: false,
            icon: <LiveIcon />,
        },
        BULK: {
            appModuleId: 1,
            displayName: 'Bulk Update',
            enabled: false,
            icon: <BulkIcon />,
        }, SEQUENCEMODULE: {
            appModuleId: 2,
            displayName: 'Sequence',
            enabled: false,
            icon: <SequenceIcon />,
        }, SORTING: {
            appModuleId: 26,
            displayName: SORTING_DISPLAY,
            enabled: false,
            icon: <SortParcelIcon />,
        }, CUSTOMAPP: {
            appModuleId: 12,
            displayName: CUSTOM_APP_DISPLAY,
            enabled: false,
            remark: null,
            icon: <WebUrlIcon />
        },
        JOB_ASSIGNMENT: {
            appModuleId: 20,
            displayName: JOB_ASSIGNMENT_DISPLAY,
            enabled: false,
            icon: <JobAssignmentIcon width={30} height={30} />
        }
    },
    menu: {
        BACKUP: {
            appModuleId: 17,
            displayName: 'Backup',
            enabled: false,
        }, BLUETOOTH: {
            appModuleId: 16,
            displayName: 'Pair Bluetooth Device',
            enabled: false,
        }, OFFLINEDATASTORE: {
            appModuleId: 15,
            displayName: 'Sync Datastore',
            enabled: false,
        }, PROFILE: {
            appModuleId: 14,
            displayName: 'Profile',
            enabled: false,
            icon: 'md-person',
        }, STATISTIC: {
            appModuleId: 7,
            displayName: 'My Stats',
            enabled: false,
            icon: 'md-trending-up',
        }, EZETAP: {
            appModuleId: 10,
            displayName: 'Ezetap',
            enabled: false,
        }, MSWIPE: {
            appModuleId: 9,
            displayName: 'MSwipe',
            enabled: false,
        }
    },
    pieChart: {
        PIECHART: {
            appModuleId: 5,
            displayName: 'Pie Chart',
            enabled: false,
        }, SUMMARY: {
            appModuleId: 8,
            displayName: 'Summary',
            enabled: false,
        },
    },
    syncStatus: null,
    unsyncedTransactionList: [],
    moduleLoading: false,
    chartLoading: false,
    count: null,
    lastSyncTime: null,
    isLoggingOut: false,
    isUnsyncTransactionOnLogout: false,
    backupUploadView: 0,
    uploadingFileCount: 0,
    failedUploadCount: 0,
    unsyncBackupFilesList: [],
    transactionServiceStarted: false,
})

export default InitialState