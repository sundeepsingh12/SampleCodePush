'use strict'

import CONFIG from '../../lib/config'
import { appDownload } from '../../services/classes/AppDownload'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { setState} from '../global/globalActions'
import {
  APP_VERSION,
  DOWNLOAD_LATEST_APP
} from '../../lib/constants'


export function getIOSDownloadUrl() {
    return async function (dispatch) {
      try {
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (!token) {
          throw new Error('Token Missing')
        }
        const appVersion = await keyValueDBService.getValueFromStore(APP_VERSION)
        // const iosUrlLink = appDownload.getDownloadLinkFromServer(token.value, appVersion.value)
        const iosUrlLink = "https://www.google.com"
        dispatch(setState(DOWNLOAD_LATEST_APP,{androidDownloadUrl:iosUrlLink}))

      } catch (error) {
        console.log('error1', error)
      }
    }
  }