import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import * as realm from '../../repositories/realmdb'
import { createZip } from './SyncZip'
import {
  keyValueDBService
} from './KeyValueDBService'
import moment from 'moment'

import {
  jobStatusService
} from './JobStatus'
import {
  jobTransactionService
} from './JobTransaction'

import {
  jobSummaryService
} from './JobSummary'
import { addServerSmsService } from './AddServerSms'

import _ from 'underscore'

import {
  TABLE_JOB_TRANSACTION,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  TABLE_RUNSHEET,
  USER,
  UNSEEN,
  PENDING,
  TABLE_JOB_TRANSACTION_CUSTOMIZATION,
  JOB_MASTER,
  JOB_STATUS,
  HUB,
  DEVICE_IMEI,

} from '../../lib/constants'


class Sync {

  async createAndUploadZip() {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token) {
      throw new Error('Token Missing')
    }
    await createZip()
    console.log('token before call',token.value)
    await RestAPIFactory(token.value).uploadZipFile()
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
    console.log('tdcContentArray',tdcContentArray)
    for (tdcContentObject of tdcContentArray) {
      let contentQuery = JSON.parse(tdcContentObject.query)
      let allJobsToTransaction = await this.getAssignOrderTohubEnabledJobs(contentQuery)
      console.log("allJobsToTransaction", allJobsToTransaction)

      if (allJobsToTransaction.length) {
        console.log("inside if", allJobsToTransaction)
        //Change this
        
        contentQuery.jobTransactions = allJobsToTransaction
        // let jsonQuery = JSON.stringify(contentQuery)
        // tdcContentObject.query = jsonQuery
      }
      const queryType = tdcContentObject.type
      console.log('queryType',queryType)
      if (queryType == 'insert') {
        await this.saveDataFromServerInDB(contentQuery)
      } else if (queryType == 'update' || queryType == 'updateStatus') {
        await this.updateDataInDB(contentQuery)
      } else if (queryType == 'delete') {
        let jobTransaction = contentQuery.jobTransactions
        await realm.deleteRecordsInBatch(jobTransaction)
      }
    }
  }

  async getAssignOrderTohubEnabledJobs(query) {
    let allJobsToTransactions = []
    const jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER)
    //optimize this
    const jobMasterWithAssignOrderToHubEnabled = jobMaster.value.filter(id => id.assignOrderToHub).reduce((object, item) => {
      object[item.id] = item.id
      return object
    }, {})
    let transactionList = query.jobTransactions
    let transactionListIdMap = _.values(transactionList).reduce((object, item) => {
      object[item.jobId] = item.jobId
      return object
    }, {})

    let jobsList = query.job
    for (let jobs in jobsList) {
      let jobMasterid = jobMasterWithAssignOrderToHubEnabled[jobsList[jobs].jobMasterId]
      if ((!transactionListIdMap || !transactionListIdMap[jobsList[jobs].id]) && jobMasterWithAssignOrderToHubEnabled[jobsList[jobs].jobMasterId]) {
        let unassignedTransactions = await this._createTransactionsOfUnassignedJobs(jobsList[jobs], jobMasterid)
        allJobsToTransactions.push(unassignedTransactions)
      }
      console.log("allJobsToTransactions in getAssignOrderTohubEnabledJobs", allJobsToTransactions)
    }
    return allJobsToTransactions
  }

  async _createTransactionsOfUnassignedJobs(job, jobMasterid) {
    const jobstatusFromDB = await keyValueDBService.getValueFromStore(JOB_STATUS)

    let user = await keyValueDBService.getValueFromStore(USER)
    let hub = await keyValueDBService.getValueFromStore(HUB)
    let imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
    let jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER).then(jobMasterObject => { return jobMasterObject.value.filter(jobMasterObject1 => jobMasterObject1.id == jobMasterid) })
    let jobstatus = jobstatusFromDB.value.filter(item => (item.code == "PENDING" && item.jobMasterId == job.jobMasterId))[0]

    let jobtransaction = await this._getDefaultValuesForJobTransaction(-job.id, jobstatus, jobMaster[0], user.value, hub.value, imei.value)
    jobtransaction.jobId = job.id
    jobtransaction.seqSelected = -job.id
    console.log('jobtransaction in _createTransactionsOfUnassignedJobs',jobtransaction)
    return jobtransaction
  }

  _getDefaultValuesForJobTransaction(id, status, jobMaster, user, hub, imei) {
    //TODO some values like lat/lng and battery are not valid values, update them as their library is added
    return jobTransaction = {
      id,
      runsheetNo: "AUTO-GEN",
      syncErp: false,
      userId: user.id,
      jobId: id,
      jobStatusId: status.id,
      companyId: user.company.id,
      actualAmount: 0.0,
      originalAmount: 0.0,
      moneyTransactionType: '',
      referenceNumber: user.id + "/" + hub.id + "/" + moment().valueOf(),
      runsheetId: null,
      hubId: hub.id,
      cityId: user.cityId,
      trackKm: 0.0,
      trackHalt: 0.0,
      trackCallCount: 0,
      trackCallDuration: 0,
      trackSmsCount: 0,
      trackTransactionTimeSpent: 0.0,
      jobCreatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      erpSyncTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      androidPushTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      lastUpdatedAtServer: moment().format('YYYY-MM-DD HH:mm:ss'),
      lastTransactionTimeOnMobile: moment().format('YYYY-MM-DD HH:mm:ss'),
      deleteFlag: 0,
      attemptCount: 1,
      jobType: jobMaster.code,
      jobMasterId: jobMaster.id,
      employeeCode: user.employeeCode,
      hubCode: hub.code,
      statusCode: status.code,
      startTime: "00:00",
      endTime: "00:00",
      merchantCode: null,
      seqSelected: 0,
      seqAssigned: 0,
      seqActual: 0,
      latitude: 0.0,
      longitude: 0.0,
      trackBattery: 0,
      imeiNumber: imei.imeiNumber
    }

  }

  /**
   * 
   * @param {*} query 
   */
  async saveDataFromServerInDB(contentQuery) {
    // const contentQuery = JSON.parse(query)
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
  async updateDataInDB(contentQuery) {
    const jobIds = await contentQuery.job.map(jobObject => jobObject.id)
    const runsheetIds = await contentQuery.runSheet.map(runsheetObject => runsheetObject.id)
    const newJobTransactionsIds = contentQuery.jobTransactions.filter(jobTransaction => jobTransaction.negativeJobTransactionId && jobTransaction.negativeJobTransactionId < 0)
      .map(newJobTransaction => newJobTransaction.negativeJobTransactionId);

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
    const newJobTransactions = {
      tableName: TABLE_JOB_TRANSACTION,
      valueList: newJobTransactionsIds,
      propertyName: 'id'
    }
    const newJobs = {
      tableName: TABLE_JOB,
      valueList: newJobTransactionsIds,
      propertyName: 'id'
    }
    const newJobFieldData = {
      tableName: TABLE_FIELD_DATA,
      valueList: newJobTransactionsIds,
      propertyName: 'jobTransactionId'
    }

    //JobData Db has no Primary Key,and there is no feature of autoIncrement Id In Realm React native currently
    //So it's necessary to delete existing JobData First in case of update query
    await realm.deleteRecordsInBatch(jobDatas, runsheets, newJobTransactions, newJobs, newJobFieldData)
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
      console.log('tdcResponse in tdcResponse',tdcResponse)
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
          const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(unseenStatusIds)
          const jobMasterIdJobStatusIdTransactionIdDtoMap = await jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions)
          const dataList = await this.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap)
          const messageIdDTOs = []
          await this.deleteDataFromServer(successSyncIds, messageIdDTOs, dataList.transactionIdDtos, dataList.jobSummaries)
          await jobTransactionService.updateJobTransactionStatusId(dataList.transactionIdDtos)
          await addServerSmsService.setServerSmsMapForPendingStatus(dataList.transactionIdDtos)
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