'use strict'

import { Record } from 'immutable'
import React from 'react'
import BulkIcon from '../../../src/svg_components/icons/BulkIcon'
import LiveIcon from '../../../src/svg_components/icons/LiveIcon'
import SequenceIcon from '../../../src/svg_components/icons/SequenceIcon'
import TaskIcon from '../../../src/svg_components/icons/TaskIcon'

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
            displayName: 'Sort Parcels',
            enabled: false,
            icon: <SequenceIcon />,
        }, CUSTOMAPP: {
            appModuleId: 12,
            displayName: 'Web URL',
            enabled: false,
            remark: null,
            icon: <SequenceIcon />
        },
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
    lastSyncTime:null,
    isLoggingOut:false
})

export default InitialState