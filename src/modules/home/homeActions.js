'use strict'

const {
  IS_LAST_PAGE
} = require('../../lib/constants').default
import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import { jobStatusService } from '../../services/classes/JobStatus'
import { jobTransactionService } from '../../services/classes/JobTransaction'

export function onResyncPress() {
  return async function (dispatch) {
    try {
      const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
      const pageNumber = 0,pageSize = 3
      let isLastPageReached = false,json
      while (!isLastPageReached) {
        console.log('inside while')
        const tdcResponse = await sync.downloadDataFromServer(token, pageNumber++, pageSize)
        if (tdcResponse) {
           json = await tdcResponse.json
          console.log(json)
          isLastPageReached = json.last
          await sync.processTdcResponse(json.content)
        } else {
          isLastPageReached = true
        }
      }
      const successSyncIds = await sync.getSyncIdFromResponse(json.content)
      console.log(successSyncIds)

      const transactionIdDTOs = await sync.getTransactionIdDTOs()

    } catch (error) {
      console.log(error)
    }
  }
}
