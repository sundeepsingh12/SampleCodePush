'use strict'

import CONFIG from '../../lib/config'
import { appDownload } from '../../services/classes/AppDownload'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { setState } from '../global/globalActions'
import { APP_VERSION, SET_IOS_UPGRADE_SCREEN } from '../../lib/constants'


export function getIOSDownloadUrl() {
  return async function (dispatch) {
    try {
      dispatch(setState(SET_IOS_UPGRADE_SCREEN, { iosDownloadScreen: 'Loading' }))
      const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      if (!token) {
        throw new Error('Token Missing')
      }
      const appVersion = await keyValueDBService.getValueFromStore(APP_VERSION)
      const iosUrlLinkResponse = await appDownload.getDownloadLinkFromServer(token.value, appVersion.value)
      let iosUrlLink = iosUrlLinkResponse.json.iosDownloadUrlResponse;
      if (iosUrlLink == 'No more IOS licenses available Contact manager') {
        dispatch(setState(SET_IOS_UPGRADE_SCREEN, { iosDownloadScreen: 'Failed', downloadUrl: iosUrlLink }))
      } else {
        dispatch(setState(SET_IOS_UPGRADE_SCREEN, { iosDownloadScreen: 'Webview', downloadUrl: iosUrlLink }))
      }
    } catch (error) {
      console.log('error1', error)
      dispatch(setState(SET_IOS_UPGRADE_SCREEN, { iosDownloadScreen: 'Failed', downloadUrl: iosUrlLink }))
    }
  }
}