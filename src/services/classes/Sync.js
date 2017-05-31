import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import * as realm from '../../repositories/realmdb'
import {
  keyValueDBService
} from './KeyValueDBService'

import {
  jobStatusService
} from './JobStatus'
import {
  jobTransactionService
} from './JobTransaction'

const {
  TABLE_JOB_TRANSACTION,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  USER
} = require('../../lib/constants').default

class Sync {

  /**GET API (Pagination)
   * This downloads jobTransactions,Job,Field Data etc from server
   * @param {*} pageNumber 
   * @param {*} pageSize 
   * 
   * Expected Response Body
   * 
   * {
    "content": [
        {
            "id": 2326388,
            "userId": 4954,
            "type": "insert",
            "query": "{
    \"job\": [
        
    ],
    \"jobTransactions\": [
      
    ],
    \"jobData\": [
      
    ],
    \"fieldData\": [
        
    ],
    \"runSheet\": [
        
    ]
}"
            "dateTime": "2017-05-22 13:08:04",
            "companyId": 295,
            "jobId": null,
            "imeiNumber": null
        }
    ],
    "last": true,
    "totalPages": 1,
    "totalElements": 1,
    "numberOfElements": 1,
    "sort": [
        {
            "direction": "ASC",
            "property": "id",
            "ignoreCase": false,
            "nullHandling": "NATIVE",
            "ascending": true
        }
    ],
    "first": true,
    "size": 5,
    "number": 0
}
   * 
   * 
   * @return tdcResponse object
   */
  async downloadDataFromServer(token, pageNumber, pageSize) {
    let formData = null
    const user = await keyValueDBService.getValueFromStore(USER)
    const isCustomErpPullActivated = user.value.company.customErpPullActivated
    if (!isCustomErpPullActivated) {
      formData = 'pageNumber=' + pageNumber + '&pageSize=' + pageSize
    }
    const url = (formData == null) ? CONFIG.API.DOWNLOAD_DATA_API : CONFIG.API.DOWNLOAD_DATA_API + "?" + formData
    let downloadResponse = RestAPIFactory(token.value).serviceCall(null, url, 'GET')
    return downloadResponse
  }

  /**Returns value of 'query' from transaction download response
   * 
   * Possible return values
   * 
   * Insert
   * Update
   * Delete
   * Message
   * 
   * @param {*} tdcResponse 
   */
  getQueryTypeFromResponse(tdcResponse) {

  }

  /**This iterates over the Json array response returned from API and correspondingly Realm db is updated
   * 
   * @param {*} tdcResponse 
   */
  processTdcResponse(tdcResponse) {
    let tdcResponseObject
    for (tdcResponseObject of tdcResponse) {
      const queryType = tdcResponseObject.type
      console.log(queryType)
      if (queryType == 'insert') {
        const contentArray = JSON.parse(tdcResponseObject.query)
        const jobTransactions = {
          tableName: TABLE_JOB_TRANSACTION,
          value: contentArray.jobTransactions
        }
        const jobs = {
          tableName: TABLE_JOB,
          value: contentArray.job
        }

        const jobDatas = {
          tableName: TABLE_JOB_DATA,
          value: contentArray.jobData
        }

        const fieldDatas = {
          tableName: TABLE_FIELD_DATA,
          value: contentArray.fieldData
        }
        realm.performBatchSave(jobs, jobTransactions, jobDatas, fieldDatas)
      }
    }
  }


  /**POST API
   * 
   * Request Body
   * 
   * {
      "jobSummaries": [
          {
              "cityId": 744,
              "companyId": 295,
              "count": 0,
              "date": "2017-05-23 00:00:00",
              "hubId": 2757,
              "id": 2098643,
              "jobMasterId": 930,
              "jobStatusId": 4814,
              "updatedTime": null,
              "userId": 4954
          }
      ],
      "messageIdDTOs": [
          
      ],
      "syncIds": [
          2327049
      ],
      "transactionIdDTOs": [
          "jobMasterId": 930,
              "pendingStatusId": 4813,
              "transactionId": "2361130",
              "unSeenStatusId": 4814
      ]

      Expected Response Body
      Success/fail
  }
   * 
   *
   */
  deleteDataFromServer(successSyncIds, messageIdDTOs, transactionIdDTOs, jobSummary) {

  }

  /**This will give value of 'id' key from tdc response
   * 
   * @param {*} tdcResponse 
   */
  getSyncIdFromResponse(content) {
    const successSyncIds = content.map(contentData => contentData.id)
    return successSyncIds
  }

  async getTransactionIdDTOs() {
    const allJobTransactions = await jobTransactionService.getAllJobTransactions()
    console.log('allJobTransactions')
     console.log(allJobTransactions)
    const transactionIdDtos = []
    const unseenStatusIds = await jobStatusService.getAllUnseenIds()
    const unseenTransactions = await jobTransactionService.getUnseenJobTransactions(allJobTransactions,unseenStatusIds)
    console.log('unseenTransactions')
    console.log(unseenTransactions)
    unseenTransactions.forEach(unseenTransactionObject=>{
      const [jobMasterId] = unseenTransactionObject
      console.log(jobMasterId)
      const transactionId = unseenTransactionObject.id
      const unSeenStatusId = jobStatusService.getStatusIdForJobMasterIdAndCode(jobMasterId,'UNSEEN')
      console.log('unSeenStatusId')
       console.log(unSeenStatusId)
       const pendingStatusId = jobStatusService.getStatusIdForJobMasterIdAndCode(jobMasterId,'PENDING')
       console.log('pendingStatusId')
       console.log(pendingStatusId)
      const transactionIdDtoObject = {
        jobMasterId,
        pendingStatusId,
        transactionId,
        unseenStatusId
      }
      transactionIdDtos.push(transactionIdDtoObject)
    })
    console.log(unseenTransactions)
 }

}

export let sync = new Sync()
