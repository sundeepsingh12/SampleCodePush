import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import * as realm from '../../repositories/realmdb'
import { createZip } from './SyncZip'
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
  PENDING,
  TABLE_JOB_TRANSACTION_CUSTOMIZATION
} = require('../../lib/constants').default


class Sync {

  async createAndUploadZip() {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token) {
      throw new Error('Token Missing')
    }
    await createZip();
    await RestAPIFactory(token.value).uploadZipFile();
  }

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
  async processTdcResponse(tdcContentArray) {
    let tdcContentObject
    for (tdcContentObject of tdcContentArray) {
      const queryType = tdcContentObject.type
      if (queryType == 'insert') {
        await this.saveDataFromServerInDB(tdcContentObject.query)
      } else if (queryType == 'update' || queryType == 'updateStatus') {
        await this.updateDataInDB(tdcContentObject.query)
      }
    }
  }

  /**
   * 
   * @param {*} query 
   */
  async saveDataFromServerInDB(query) {
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
      value: contentQuery.runSheet
    }
    realm.performBatchSave(jobs, jobTransactions, jobDatas, fieldDatas, runsheets)
  }

  /**
   * 
   * @param {*} query 
   */
  async updateDataInDB(query) {
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
    for (let jobMasterId in jobMasterIdJobStatusIdTransactionIdDtoMap) {
      for (let unseenStatusId in jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId]) {
        let count = jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId].transactionId.split(":").length
        let pendingID = jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId].pendingStatusId
        let unseenJobSummaryData = await jobSummaryService.getJobSummaryData(jobMasterId, unseenStatusId)
        unseenJobSummaryData.count = 0
        jobSummaries.push(unseenJobSummaryData)
        let pendingJobSummaryData = await jobSummaryService.getJobSummaryData(jobMasterId, pendingID)
        pendingJobSummaryData.count += count
        jobSummaries.push(pendingJobSummaryData)
        transactionIdDtos.push(jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId])
      }
    }
    const dataList = {
      jobSummaries,
      transactionIdDtos
    }
    return dataList
  }

  /**This method first download data from server and then 
   * requests server to delete entries from sync table
   * 
   * @Return type
   * boolean 
   * 
   * Returns true if any job present in sync table on server side
   */
  async downloadAndDeleteDataFromServer() {
    const pageNumber = 0,
      pageSize = 3
    let isLastPageReached = false,
      json, isJobsPresent = false
    const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
    while (!isLastPageReached) {
      const tdcResponse = await this.downloadDataFromServer(pageNumber, pageSize)
      if (tdcResponse) {
        json = await tdcResponse.json
        isLastPageReached = json.last
        if (!_.isNull(json.content) && !_.isUndefined(json.content) && !_.isEmpty(json.content)) {
          await this.processTdcResponse(json.content)
        } else {
          isLastPageReached = true
        }
        const successSyncIds = await this.getSyncIdFromResponse(json.content)
        //Dont hit delete sync API if successSyncIds empty
        //Delete Data from server code starts here
        if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
          isJobsPresent = true
          const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds( unseenStatusIds)
          const jobMasterIdJobStatusIdTransactionIdDtoMap = await jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions)
          const dataList = await this.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap)
          const messageIdDTOs = []
          await this.deleteDataFromServer(successSyncIds, messageIdDTOs, dataList.transactionIdDtos, dataList.jobSummaries)
          await jobTransactionService.updateJobTransactionStatusId(dataList.transactionIdDtos)
          jobSummaryService.updateJobSummary(dataList.jobSummaries)
        }
      } else {
        isLastPageReached = true
      }
    }
    return isJobsPresent
  }
}

export let sync = new Sync()