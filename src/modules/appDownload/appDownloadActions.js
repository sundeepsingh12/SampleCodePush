'use strict'

import CONFIG from '../../lib/config'
import { appDownload } from '../../services/classes/AppDownload'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
  APP_VERSION
} from '../../lib/constants'


export function getIOSDownloadUrl() {
    return async function (dispatch) {
      try {
        console.log('getIOSDownloadUrl action called >>>')
        const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
        if (!token) {
            throw new Error('Token Missing')
        }
        const appVersion = await keyValueDBService.getValueFromStore(APP_VERSION)
        console.log('appVersion',appVersion)
       appDownload.getDownloadLinkFromServer(token.value,appVersion.value)
      } catch (error) {
        console.log('error1', error)
      }
    }
  }