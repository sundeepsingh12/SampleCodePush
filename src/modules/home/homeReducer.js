'use strict'

import InitialState from './homeInitialState'
import React from 'react'

const initialState = new InitialState()
import {
  PAGES_LOADING,
  SET_PAGES_UTILITY_N_PIESUMMARY,
  SYNC_STATUS,
  CHART_LOADING,
  RESET_STATE,
  LAST_SYNC_TIME,
  SET_UNSYNC_TRANSACTION_PRESENT,
  SET_BACKUP_UPLOAD_VIEW,
  SET_UPLOAD_FILE_COUNT,
  SET_FAIL_UPLOAD_COUNT,
  SET_BACKUP_FILES_LIST,
  SET_TRANSACTION_SERVICE_STARTED,
  SET_ERP_PULL_ACTIVATED,
  ERP_SYNC_STATUS,
  SET_NEWJOB_DRAFT_INFO,
  LOADER_FOR_SYNCING,
  IS_LOGGING_OUT
} from '../../lib/constants'

export default function homeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) {
    return initialState.mergeDeep(state)
  }
  switch (action.type) {
    case PAGES_LOADING: {
      return state.set('pagesLoading', action.payload.pagesLoading)
    }

    case SET_PAGES_UTILITY_N_PIESUMMARY: {
      return state.set('mainMenuList', action.payload.sortedMainMenuAndSubMenuList.mainMenuSectionList)
        .set('subMenuList', action.payload.sortedMainMenuAndSubMenuList.subMenuSectionList)
        .set('utilities', action.payload.utilities)
        .set('pieChartSummaryCount', action.payload.pieChartSummaryCount)
        .set('pagesLoading', false);
    }

    case SET_ERP_PULL_ACTIVATED: {
      return state.set('customErpPullActivated', action.payload.customErpPullActivated)
    }

    case SYNC_STATUS:
      return state.set('unsyncedTransactionList', action.payload.unsyncedTransactionList)
        .set('syncStatus', action.payload.syncStatus)

    case ERP_SYNC_STATUS: {
      return state.set('erpSyncStatus', action.payload.syncStatus)
        .set('erpModalVisible', action.payload.erpModalVisible ? true : false)
        .set('lastErpSyncTime', action.payload.lastErpSyncTime)
    }

    case LOADER_FOR_SYNCING:{
      return state.set('moduleLoading', action.payload)
    }

    case CHART_LOADING:
      return state.set('chartLoading', action.payload.loading)
        .set('pieChartSummaryCount', action.payload.count)

    case LAST_SYNC_TIME:
      return state.set('lastSyncTime', action.payload)

    case RESET_STATE: {
      return initialState
    }
    case IS_LOGGING_OUT: {
      return state.set('isLoggingOut', action.payload)
    }

    case SET_UNSYNC_TRANSACTION_PRESENT:
      return state.set('isUnsyncTransactionOnLogout', action.payload.isUnsyncTransactionOnLogout)
                  .set('isLoggingOut',action.payload.isLoggingOut)

    case SET_BACKUP_UPLOAD_VIEW:
      return state.set('backupUploadView', action.payload)

    case SET_UPLOAD_FILE_COUNT:
      return state.set('uploadingFileCount', action.payload)

    case SET_FAIL_UPLOAD_COUNT:
      return state.set('failedUploadCount', action.payload)

    case SET_BACKUP_FILES_LIST:
      return state.set('unsyncBackupFilesList', action.payload)

    case SET_NEWJOB_DRAFT_INFO:
      return state.set('draftNewJobInfo', action.payload)

    case SET_TRANSACTION_SERVICE_STARTED:
      return state.set('trackingServiceStarted', action.payload)
  }
  return state;
}