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
  runSheetService
} from './RunSheet'

import {
  jobSummaryService
} from './JobSummary'
import { addServerSmsService } from './AddServerSms'

import {
  jobMasterService
} from './JobMaster'
import _ from 'lodash'

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

import {
  FAREYE_UPDATES
} from '../../lib/AttributeConstants'
import { Platform } from 'react-native'
import NotificationsIOS, { NotificationsAndroid } from 'react-native-notifications'

class Sync {

  async createAndUploadZip(transactionIdToBeSynced) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token) {
      throw new Error('Token Missing')
    }
    await createZip(transactionIdToBeSynced)
    const responseBody = await RestAPIFactory(token.value).uploadZipFile()
    return responseBody
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
  async downloadDataFromServer(pageNumber, pageSize, isLiveJob) {
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
    let url = ''
    if (!isLiveJob)
      url = (formData == null) ? CONFIG.API.DOWNLOAD_DATA_API : CONFIG.API.DOWNLOAD_DATA_API + "?" + formData
    else
      url = (formData == null) ? CONFIG.API.DOWNLOAD_LIVE_JOB_DATA : CONFIG.API.DOWNLOAD_LIVE_JOB_DATA + "?" + formData

    let downloadResponse = RestAPIFactory(token.value).serviceCall(null, url, 'GET')
    return downloadResponse
  }


  /**This iterates over the Json array response returned from API and correspondingly Realm db is updated
   * 
   * @param {*} tdcResponse 
   */
  async processTdcResponse(tdcContentArray) {
    let tdcContentObject, jobMasterIds
    for (tdcContentObject of tdcContentArray) {
      let contentQuery = JSON.parse(tdcContentObject.query)
      let allJobsToTransaction = await this.getAssignOrderTohubEnabledJobs(contentQuery)

      if (allJobsToTransaction.length) {
        contentQuery.jobTransactions = (contentQuery.jobTransactions) ? allJobsToTransaction.concat(contentQuery.jobTransactions) : allJobsToTransaction
      }
      const queryType = tdcContentObject.type
      if (queryType == 'insert') {
        jobMasterIds = await this.saveDataFromServerInDB(contentQuery)
      } else if (queryType == 'update' || queryType == 'updateStatus') {
        jobMasterIds = await this.updateDataInDB(contentQuery)
      } else if (queryType == 'delete') {
        const jobIds = await contentQuery.job.map(jobObject => jobObject.id)
        const deleteJobTransactions = {
          tableName: TABLE_JOB_TRANSACTION,
          valueList: jobIds,
          propertyName: 'jobId'
        }
        await realm.deleteRecordsInBatch(deleteJobTransactions)
      }

    }
    return jobMasterIds
  }

  async getAssignOrderTohubEnabledJobs(query) {
    let allJobsToTransactions = []
    const jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER)
    let jobMasterWithAssignOrderToHubEnabled = {}
    jobMaster.value.forEach(jobMasterObject => {
      if (jobMasterObject.assignOrderToHub) {
        jobMasterWithAssignOrderToHubEnabled[jobMasterObject.id] = jobMasterObject.id
      }
    })
    let transactionList = query.jobTransactions
    let transactionListIdMap = _.values(transactionList).reduce((object, item) => {
      object[item.jobId] = item.jobId
      return object
    }, {})

    for (let jobs of query.job) {
      let jobMasterid = jobMasterWithAssignOrderToHubEnabled[jobs.jobMasterId]
      if ((_.isEmpty(transactionListIdMap) || !transactionListIdMap[jobs.id]) && jobMasterid) {
        let unassignedTransactions = await this._createTransactionsOfUnassignedJobs(jobs, jobMaster.value)
        allJobsToTransactions.push(unassignedTransactions)
      }
    }
    return allJobsToTransactions
  }

  async _createTransactionsOfUnassignedJobs(job, jobMaster) {
    let user = await keyValueDBService.getValueFromStore(USER)
    let hub = await keyValueDBService.getValueFromStore(HUB)
    let imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI)
    let jobmaster
    for (let jobMasterObject of jobMaster) {
      if (jobMasterObject.id == job.jobMasterId) {
        jobmaster = jobMasterObject
        break
      }
    }
    let jobstatusid = await jobStatusService.getStatusIdForJobMasterIdAndCode(job.jobMasterId, "PENDING")
    let jobtransaction = await this._getDefaultValuesForJobTransaction(-job.id, jobstatusid, jobmaster, user.value, hub.value, imei.value)
    jobtransaction.jobId = job.id
    jobtransaction.seqSelected = -job.id
    return jobtransaction
  }

  _getDefaultValuesForJobTransaction(id, statusid, jobMaster, user, hub, imei) {
    //TODO some values like lat/lng and battery are not valid values, update them as their library is added
    return jobTransaction = {
      id,
      runsheetNo: "AUTO-GEN",
      syncErp: false,
      userId: user.id,
      jobId: id,
      jobStatusId: statusid,
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
      statusCode: "PENDING",
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
    const jobMasterIds = this.getJobMasterIds(contentQuery.job)
    return jobMasterIds
  }

  getJobMasterIds(jobList) {
    let jobMasterIds = new Set()
    jobMasterIds = jobList.map(job => job.jobMasterId)
    return jobMasterIds
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
    await realm.deleteRecordsInBatch(jobDatas, newJobTransactions, newJobs, newJobFieldData)
    const jobMasterIds = await this.saveDataFromServerInDB(contentQuery)
    return jobMasterIds
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
  async downloadAndDeleteDataFromServer(isLiveJob) {
    let pageNumber = 0,
      pageSize = 3, currentPage
    if (isLiveJob)
      pageSize = 200
    let isLastPageReached = false,
      json, isJobsPresent = false, jobMasterIds
    const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
    while (!isLastPageReached) {
      const tdcResponse = await this.downloadDataFromServer(pageNumber, pageSize, isLiveJob)
      if (tdcResponse) {
        json = await tdcResponse.json
        isLastPageReached = json.last
        currentPage = json.number
        if (!_.isNull(json.content) && !_.isUndefined(json.content) && !_.isEmpty(json.content)) {
          jobMasterIds = await this.processTdcResponse(json.content)
        } else {
          isLastPageReached = true
        }
        const successSyncIds = await this.getSyncIdFromResponse(json.content)
        //Dont hit delete sync API if successSyncIds empty
        //Delete Data from server code starts here
        if (!isLiveJob) {
          if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
            isJobsPresent = true
            const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(unseenStatusIds)
            const jobMasterIdJobStatusIdTransactionIdDtoMap = await jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions)
            const dataList = await this.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap)
            const messageIdDTOs = []
            await this.deleteDataFromServer(successSyncIds, messageIdDTOs, dataList.transactionIdDtos, dataList.jobSummaries)
            await jobTransactionService.updateJobTransactionStatusId(dataList.transactionIdDtos)
            const jobMasterTitleList = await jobMasterService.getJobMasterTitleListFromIds(jobMasterIds)
            this.showNotification(jobMasterTitleList)
            await addServerSmsService.setServerSmsMapForPendingStatus(dataList.transactionIdDtos)
            jobSummaryService.updateJobSummary(dataList.jobSummaries)
          }
        }
      } else {
        isLastPageReached = true
      }
      if (!isLastPageReached) {
        if (isLiveJob) {
          pageNumber = currentPage + 1
        } else {
          pageNumber = 0
        }
      }
    }
    console.log('isJobsPresent', isJobsPresent)
    if (isJobsPresent) {
      await runSheetService.updateRunSheetSummary()
    }
    return isJobsPresent

  }

  showNotification(jobMasterTitleList) {
    const alertBody = jobMasterTitleList.join()
    if (Platform.OS === 'ios') {
      NotificationsIOS.localNotification({
        alertBody: `You have new updates for ${alertBody} jobs`,
        alertTitle: FAREYE_UPDATES,
      })
    }
    else {
      NotificationsAndroid.localNotification({
        title: FAREYE_UPDATES,
        body: `You have new updates for ${alertBody} jobs`,
      })
    }

  }
}

export let sync = new Sync()