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
     if (!token) {
      throw new Error('Token Missing')
    }
    let formData = null
    const user = await keyValueDBService.getValueFromStore(USER)
    if (!user || !user.value) {
      throw new Error('Value of user missing')
    }
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
      if (queryType == 'insert') {
        this.saveDataFromServerInDB(tdcContentObject.query)
      } else if (queryType == 'update' || queryType == 'updateStatus') {
        this.updateDataInDB(tdcContentObject.query)
      }
    }
  }

  /**
   * 
   * @param {*} query 
   */
  async saveDataFromServerInDB(query) {
    try{
    const contentQuery = await JSON.parse(query)
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
      value: contentQuery.runSheet
    }
     realm.performBatchSave(jobs, jobTransactions, jobDatas, fieldDatas, runsheets)
    }
    catch(Error){
      console.log('inside catch >>')
      console.log(Error)
    }
   
  }

/**
 * 
 * @param {*} query 
 */
  async updateDataInDB(query) {
    try {
      const contentQuery = await JSON.parse(query)
      const jobIds = await contentQuery.job.map(jobObject => jobObject.id)
      const runsheetIds = await contentQuery.runSheet.map(runsheetObject => runsheetObject.id)

      const runsheets = {
        tableName: TABLE_RUNSHEET,
        valueList: runsheetIds,
        propertyName: 'id'
      }
      const jobDatas = {
        tableName: TABLE_JOB_DATA,
        valueList: jobIds,
        propertyName: 'jobId'
      }

      //JobData Db has no Primary Key,and there is no feature of autoIncrement Id In Realm React native currently
      //So it's necessary to delete existing JobData First in case of update query
      await realm.deleteRecordsInBatch(jobDatas, runsheets)
      await this.saveDataFromServerInDB(query)
    } catch (Error) {
      console.log(Error)
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
              "transactionId": "2361130:123456",
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
    if (!token) {
      throw new Error('Token Missing')
    }
    const postData = JSON.stringify({
      syncIds,
      messageIdDTOs,
      transactionIdDTOs,
      jobSummaries
    })
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


  /**
   * Sample Return type 
   * transactionIdDTOs : [
         {
             "jobMasterId": 930,
             "pendingStatusId": 4813,
             "transactionId": "2426803:12345",
             "unSeenStatusId": 4814
         }
     ]
      jobSummaries:[
    {
      cityId: 744
       companyId: 295
       count:0
       date:"2017-06-19 00:00:00"
       hubId:2757
       id:2229406
       jobMasterId:930
       jobStatusId:4814 //unseen status id
       userId:4954
    }
   ,{
   cityId: 744
       companyId: 295
       count:0
       date:"2017-06-19 00:00:00"
       hubId:2757
       id:2229894
       jobMasterId:930
       jobStatusId:4813 //pending status id
       userId:4954
   }
   
   ]
   */
  async getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap) {
    let transactionIdDtos = []
    const jobSummaries = []
    let jobMasterIdUnseenStatusIdMap = {},jobMasterIdPendingStatusIdMap = {}
    for (let jobMasterId in jobMasterIdJobStatusIdTransactionIdDtoMap) {
      for (let unseenStatusId in jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId]) {
        jobMasterIdUnseenStatusIdMap[jobMasterId] = unseenStatusId
        let count = jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId].transactionId.split(":").length
        let pendingID = jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId].pendingStatusId
        jobMasterIdPendingStatusIdMap[jobMasterId] = pendingID
        transactionIdDtos.push(jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId])
      }
    }
    let unseenJobSummaryList = await jobSummaryService.getJobSummariesForJobMasterAndStatus(jobMasterIdUnseenStatusIdMap)
    jobSummaries.push(unseenJobSummaryList)
    let pendingJobSummaryList = await jobSummaryService.getJobSummariesForJobMasterAndStatus(jobMasterIdPendingStatusIdMap)
     jobSummaries.push(pendingJobSummaryList)
    const dataList = {
      jobSummaries,
      transactionIdDtos
    }
    return dataList
  }
}

export let sync = new Sync()
