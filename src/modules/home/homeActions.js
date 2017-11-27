'use strict'

import {
  CUSTOMIZATION_APP_MODULE,
  HOME_LOADING,
  JOB_DOWNLOADING_STATUS,
  USER,
} from '../../lib/constants'

import {
  SERVICE_ALREADY_SCHEDULED
} from '../../lib/AttributeConstants'

import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import _ from 'underscore'
import BackgroundTimer from 'react-native-background-timer'
import { setState, navigateToScene } from '../global/globalActions'
import { moduleCustomizationService } from '../../services/classes/ModuleCustomization'

/**
 * This action enables modules for particular user
 */
export function fetchModulesList() {
  return async function (dispatch) {
    try {
      dispatch(setState(HOME_LOADING, { loading: true }))
      const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
      const user = await keyValueDBService.getValueFromStore(USER)
      moduleCustomizationService.getActiveModules(appModulesList.value, user.value)
      dispatch(setState(HOME_LOADING, { loading: false }))
    } catch (error) {
      console.log(error)
    }
  }
}

export function syncService() {
  return async (dispatch) => {
    try {
      if (CONFIG.intervalId) {
        throw new Error(SERVICE_ALREADY_SCHEDULED)
      }
      CONFIG.intervalId = BackgroundTimer.setInterval(async () => {
        dispatch(onResyncPress())
      }, CONFIG.SYNC_SERVICE_DELAY);
    } catch (error) {
      //Update UI here
      console.log(error)
    }
  }
}

export function onResyncPress() {
  return async function (dispatch) {
    try {
      dispatch(setState(JOB_DOWNLOADING_STATUS, { isDownloadingjobs: true }))
      await sync.createAndUploadZip()
      let isLiveJob = false
      const isJobsPresent = await sync.downloadAndDeleteDataFromServer(isLiveJob)
      isLiveJob = true
      const isLiveJobPresent = await sync.downloadAndDeleteDataFromServer(true)
      console.log(isLiveJobPresent)
      dispatch(setState(JOB_DOWNLOADING_STATUS, { isDownloadingjobs: false }))
      if (isLiveJobPresent) {
        dispatch(setState(SHOW_LIVE_JOB_LIST, true))
        navigateToScene()
      }
      dispatch(syncService())
    } catch (error) {
      console.log(error)
      dispatch(setState(JOB_DOWNLOADING_STATUS, { isDownloadingjobs: false }))
    }
  }
}