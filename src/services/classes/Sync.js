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

import {
  jobSummaryService
} from './JobSummary'

import _ from 'underscore'

const {
  TABLE_JOB_TRANSACTION,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  TABLE_RUNSHEET,
  USER,
  UNSEEN,
  PENDING
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
  async downloadDataFromServer(pageNumber, pageSize) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
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


  /**This iterates over the Json array response returned from API and correspondingly Realm db is updated
   * 
   * @param {*} tdcResponse 
   */
  processTdcResponse(tdcContentArray) {
    let tdcContentObject
    for (tdcContentObject of tdcContentArray) {
      const queryType = tdcContentObject.type
      console.log(queryType)
      if (queryType == 'insert') {
        this.saveDataFromServerInDB(tdcContentObject.query)
      }else if (queryType == 'update') {
        this.updateDataInDB(tdcContentObject.query)
      }
    }
  }

  /**
   * 
   * @param {*} query 
   */
  saveDataFromServerInDB(query) {
    const contentQuery = JSON.parse(query)
    const jobTransactions = {
      tableName: TABLE_JOB_TRANSACTION,
      value: contentQuery.jobTransactions
    }
    const jobs = {
      tableName: TABLE_JOB,
      value: contentQuery.job
    }

    const jobDatas = {
      tableName: TABLE_JOB_DATA,
      value: contentQuery.jobData
    }

    const fieldDatas = {
      tableName: TABLE_FIELD_DATA,
      value: contentQuery.fieldData
    }

    const runsheets = {
      tableName: TABLE_RUNSHEET,
      value: contentQuery.runsheet  
    }

    realm.performBatchSave(jobs, jobTransactions, jobDatas, fieldDatas,runsheets)
  }

  updateDataInDB(query) {
    const contentQuery = JSON.parse(query)

    const jobs = {
      tableName: TABLE_JOB,
      value: contentQuery.job
    }

    const jobDatas = {
      tableName: TABLE_JOB_DATA,
      value: contentQuery.jobData
    }

    const fieldDatas = {
      tableName: TABLE_FIELD_DATA,
      value: contentQuery.fieldData
    }

    const runsheets = {
      tableName: TABLE_RUNSHEET,
      value: contentQuery.runsheet  
    }

    realm.deleteRecordsInBatch(jobs, jobDatas,runsheets)


    realm.performBatchSave(jobs, jobDatas, fieldDatas,runsheets)
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
  async deleteDataFromServer(syncIds, messageIdDTOs, transactionIdDTOs, jobSummaries) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    const postData = JSON.stringify({
      syncIds,
      messageIdDTOs,
      transactionIdDTOs,
      jobSummaries
    })
    console.log('postData')
    console.log(postData)
    let deleteResponse = RestAPIFactory(token.value).serviceCall(postData, CONFIG.API.DELETE_DATA_API, 'POST')
    return deleteResponse
  }

  /**This will give value of 'id' key from tdc response
   * 
   * @param {*} tdcResponse 
   */
  getSyncIdFromResponse(content) {
    const successSyncIds = content.map(contentData => contentData.id)
    return successSyncIds
  }

  /**Returns Transaction Id dto which will be used in Request body of delete sync
   * 
   * Sample transactionIdDTOs : [
          {
              "jobMasterId": 930,
              "pendingStatusId": 4813,
              "transactionId": "2426803",
              "unSeenStatusId": 4814
          }
      ]
   * 
   */
  getTransactionIdDTOs(unseenTransactionsMap) {
    const jobMasterIdTransactionDtoMap = unseenTransactionsMap.jobMasterIdTransactionDtoMap
    let transactionIdDtos = []
    for (let mapObject in jobMasterIdTransactionDtoMap) {
      transactionIdDtos.push(jobMasterIdTransactionDtoMap[mapObject]);
    }
    return transactionIdDtos
  }
}

export let sync = new Sync()
