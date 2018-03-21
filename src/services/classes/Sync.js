import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import * as realm from '../../repositories/realmdb'
import { createZip } from './SyncZip'
import { keyValueDBService } from './KeyValueDBService'
import moment from 'moment'
import { jobStatusService } from './JobStatus'
import { jobTransactionService } from './JobTransaction'
import { runSheetService } from './RunSheet'
import { jobSummaryService } from './JobSummary'
import { addServerSmsService } from './AddServerSms'
import { jobMasterService } from './JobMaster'
import { syncZipService } from './SyncZip'
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
  CUSTOMIZATION_APP_MODULE,
  POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS,
  LAST_SYNC_WITH_SERVER,
} from '../../lib/constants'

import {
  FAREYE_UPDATES,
  JOB_ASSIGNMENT_ID,
} from '../../lib/AttributeConstants'
import { Platform } from 'react-native'
import { moduleCustomizationService } from './ModuleCustomization'
import PushNotification from 'react-native-push-notification'
import {
  JOBS_DELETED
} from '../../lib/ContainerConstants'

class Sync {

  async createAndUploadZip(syncStoreDTO) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token) {
      throw new Error('Token Missing')
    }
    await syncZipService.createZip(syncStoreDTO)
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
  async downloadDataFromServer(pageNumber, pageSize, isLiveJob, erpPull) {
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token) {
      throw new Error('Token Missing')
    }
    let formData = null
    if (!erpPull) {
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
  async processTdcResponse(tdcContentArray, isLiveJob, syncStoreDTO, jobMasterMapWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap) {
    let tdcContentObject, jobMasterIds
    //Prepare jobMasterWithAssignOrderToHubEnabledhere only and if it is non empty,then only hit store for below 4 lines
    // const jobMaster = await keyValueDBService.getValueFromStore(JOB_MASTER)
    const { jobMasterList } = syncStoreDTO
    //This loop gets jobMaster map for job master of which assignOrderToHub is enabled
    for (tdcContentObject of tdcContentArray) {
      let contentQuery = JSON.parse(tdcContentObject.query)
      let allJobsToTransaction = _.isEmpty(jobMasterMapWithAssignOrderToHubEnabled) ? [] : this.getAssignOrderTohubEnabledJobs(contentQuery, syncStoreDTO, jobMasterMapWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap)
      if (allJobsToTransaction.length) {
        contentQuery.jobTransactions = (contentQuery.jobTransactions) ? allJobsToTransaction.concat(contentQuery.jobTransactions) : allJobsToTransaction
      }
      const queryType = tdcContentObject.type
      if (queryType == 'insert') {
        jobMasterIds = await this.saveDataFromServerInDB(contentQuery, isLiveJob)
      } else if (queryType == 'update') {
        jobMasterIds = await this.insertOrUpdateDataInDb(contentQuery)
      } else if (queryType == 'updateStatus') {
        jobMasterIds = await this.updateDataInDB(contentQuery)
      } else if (queryType == 'delete') {
        jobMasterIds = `${JOBS_DELETED}`
        const jobIds = contentQuery.job.map(jobObject => jobObject.id)
        const deleteJobTransactions = {
          tableName: TABLE_JOB_TRANSACTION,
          valueList: jobIds,
          propertyName: 'jobId'
        }
        realm.deleteRecordsInBatch(deleteJobTransactions)
      } else if (queryType == 'deleteBroadcast') {
        const jobIds = contentQuery.job.map(jobObject => jobObject.id)
        const deleteJobs = {
          tableName: TABLE_JOB,
          valueList: jobIds,
          propertyName: 'id'
        }
        const deleteJobData = {
          tableName: TABLE_JOB_DATA,
          valueList: jobIds,
          propertyName: 'jobId'
        }
        realm.deleteRecordsInBatch(deleteJobTransactions, deleteJobData)
      }
    }
    return jobMasterIds
  }

  getAssignOrderTohubEnabledJobs(query, syncStoreDTO, jobMasterMapWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap) {
    let allJobsToTransactions = []
    let transactionList = query.jobTransactions
    let jobIdJobIdMap = {}
    for (let jobTransaction in transactionList) {
      jobIdJobIdMap[transactionList[jobTransaction].jobId] = transactionList[jobTransaction].jobId
    }
    for (let jobs of query.job) {
      let jobMasterId = jobMasterMapWithAssignOrderToHubEnabled[jobs.jobMasterId]
      //Make transactions for those whose job transaction node is null
      if (jobMasterId && (!jobIdJobIdMap[jobs.id])) {
        let unassignedTransactions = this.createTransactionsOfUnassignedJobs(jobs, syncStoreDTO, jobMasterWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap)
        allJobsToTransactions.push(unassignedTransactions)
      }
    }
    return allJobsToTransactions
  }

  createTransactionsOfUnassignedJobs(job, syncStoreDTO, jobMasterIdvsCode, jobMasterIdJobStatusIdOfPendingCodeMap) {
    let jobStatusId = jobMasterIdJobStatusIdOfPendingCodeMap[job.jobMasterId];
    let jobtransaction = this.getDefaultValuesForJobTransaction(-job.id, jobStatusId, job.referenceNo, syncStoreDTO.user, syncStoreDTO.hub, syncStoreDTO.imei, jobMasterIdvsCode);
    return jobtransaction
  }

  getDefaultValuesForJobTransaction(id, statusid, referenceNumber, user, hub, imei, jobMasterIdVSCode) {
    //TODO some values like lat/lng and battery are not valid values, update them as their library is added
    return jobTransaction = {
      id,
      runsheetNo: "AUTO-GEN",
      syncErp: false,
      userId: user.id,
      jobId: -id,
      jobStatusId: statusid,
      companyId: user.company.id,
      actualAmount: 0.0,
      originalAmount: 0.0,
      moneyTransactionType: '',
      referenceNumber: referenceNumber,
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
      jobType: _.values(jobMasterIdVSCode)[0], // single value pass in param
      jobMasterId: Number(_.keys(jobMasterIdVSCode)[0]), // single value pass in param
      employeeCode: user.employeeCode,
      hubCode: hub.code,
      statusCode: "PENDING",
      startTime: "00:00",
      endTime: "00:00",
      merchantCode: null,
      seqSelected: id,
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
  async saveDataFromServerInDB(contentQuery, isLiveJob) {
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
    if (isLiveJob) {
      await this.saveLiveJobData(jobs, jobTransactions, jobDatas, fieldDatas, runsheets)
    }
    realm.performBatchSave(jobs, jobTransactions, jobDatas, fieldDatas, runsheets)
    const jobMasterIds = this.getJobMasterIds(contentQuery.job)
    return jobMasterIds
  }

  async saveLiveJobData(jobs, jobDatas) {
    let jobQuery = jobs.value.map(jobId => 'id = ' + jobId.id).join(' OR ')
    // job status 
    // 1 : unassigned
    // 2 : assigned
    // 6 : live job
    jobQuery = jobQuery + ' AND status = 6'
    let jobsInDbList = realm.getRecordListOnQuery(TABLE_JOB, jobQuery)
    if (jobsInDbList.length == 0) {
      await keyValueDBService.validateAndSaveData('LIVE_JOB', new Boolean(true))
      return
    }
    // only delete job data
    realm.deleteRecordsInBatch(jobDatas)
    return
  }


  getJobMasterIds(jobList) {
    let jobMasterIds = {}
    jobMasterIds = jobList.map(job => job.jobMasterId)
    return jobMasterIds
  }

  /**
   * 
   * @param {*} query 
   */
  async updateDataInDB(contentQuery) {
    /*TODO Current logic of deleting field data and job data is wrong.
    It will be wrong if same contentArray has field data length of one job but not of another job then the field data of 
    both jobs would be deleted and insert but at insert field data of one job will be found resulting in deletion of
    field data of 2nd job.Same goes for job data
    */
    const jobIds = contentQuery.job.map(jobObject => jobObject.id)
    let { jobTransactionsIds, newJobTransactionsIds } = this.getJobTransactionAndNewJobTransactionIds(contentQuery.jobTransactions)
    let concatinatedJobTransactionsIdsAndNewJobTransactionsIds = _.concat(jobTransactionsIds, newJobTransactionsIds)
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
    const jobFieldData = {
      tableName: TABLE_FIELD_DATA,
      valueList: concatinatedJobTransactionsIdsAndNewJobTransactionsIds,
      propertyName: 'jobTransactionId'
    }
    //JobData Db has no Primary Key,and there is no feature of autoIncrement Id In Realm React native currently
    //So it's necessary to delete existing JobData First in case of update query
    realm.deleteRecordsInBatch(jobDatas, newJobTransactions, newJobs, jobFieldData)
    const jobMasterIds = await this.saveDataFromServerInDB(contentQuery)
    return jobMasterIds
  }

  async insertOrUpdateDataInDb(contentQuery) {
    const jobIds = contentQuery.job.map(jobObject => jobObject.id)
    let { jobTransactionsIds, newJobTransactionsIds } = this.getJobTransactionAndNewJobTransactionIds(contentQuery.jobTransactions)
    let concatinatedJobTransactionsIdsAndNewJobTransactionsIds = _.concat(jobTransactionsIds, newJobTransactionsIds)
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
    const jobFieldData = {
      tableName: TABLE_FIELD_DATA,
      valueList: concatinatedJobTransactionsIdsAndNewJobTransactionsIds,
      propertyName: 'jobTransactionId'
    }
    //JobData Db has no Primary Key,and there is no feature of autoIncrement Id In Realm React native currently
    //So it's necessary to delete existing JobData First in case of update query
    //Check is wrong (fails in case normal and new job are coming together)
    if (contentQuery.fieldData && contentQuery.fieldData.length > 0) {
      realm.deleteRecordsInBatch(jobDatas, newJobTransactions, newJobs, jobFieldData)
    } else {
      realm.deleteRecordsInBatch(jobDatas, newJobTransactions, newJobs)
    }
    //check update to _.empty
    contentQuery.jobTransactions = (jobTransactionsIds.length > 0) ? this.getTransactionForUpdateQuery(contentQuery.jobTransactions, jobTransactionsIds) : []
    contentQuery.job = (jobIds.length > 0) ? this.getJobForUpdateQuery(contentQuery.job, jobIds) : []
    const jobMasterIds = await this.saveDataFromServerInDB(contentQuery)
    return jobMasterIds
  }

  getJobForUpdateQuery(jobs, jobIds) {
    let jobArray = []
    let jobQuery = jobIds.map(jobId => 'id = ' + jobId).join(' OR ')
    let jobList = realm.getRecordListOnQuery(TABLE_JOB, jobQuery, null, null)
    let existingTransactionsMap = {}
    for (let index in jobList) {
      let jobInDb = { ...jobList[index] }
      existingTransactionsMap[jobInDb.id] = jobInDb
    }
    if (_.isEmpty(existingTransactionsMap)) {
      return jobs
    }
    for (let job of jobs) {
      let updatedJob = (existingTransactionsMap[job.id]) ? _.omit(job, ['status']) : job
      jobArray.push(updatedJob)
    }
    return jobArray
  }

  getTransactionForUpdateQuery(jobTransactions, jobTransactionIds) {
    let jobTransactionArray = []
    let jobTransactionQuery = jobTransactionIds.map(transactionId => 'id = ' + transactionId).join(' OR ')
    let transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobTransactionQuery)
    let existingTransactionsMap = {}
    for (let index in transactionList) {
      //no need for whole job transaction
      let jobTransactionInDb = { ...transactionList[index] }
      existingTransactionsMap[jobTransactionInDb.id] = jobTransactionInDb
    }
    //This is case of when job are added after user has logged in (query type still comes 'update')
    //Need server side changes here,it should be 'insert'
    if (_.isEmpty(existingTransactionsMap)) { return jobTransactions }

    for (let jobTransaction of jobTransactions) {
      //Use ternary here
      if (existingTransactionsMap[jobTransaction.id]) {
        let updatedJobTransaction = _.omit(jobTransaction, ['jobStatusId', 'actualAmount', 'originalAmount', 'moneyTransactionType', 'trackKm', 'trackHalt', 'trackCallCount', 'trackCallDuration',
          'trackSmsCount', 'latitude', 'longitude', 'trackBattery', 'seqSelected', 'seqActual', 'seqAssigned', 'lastTransactionTimeOnMobile', 'statusCode', 'jobEtaTime', 'npsFeedBack'])
        jobTransactionArray.push(updatedJobTransaction)
      } else {
        jobTransactionArray.push(jobTransaction)
      }
    }
    return jobTransactionArray
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
  async downloadAndDeleteDataFromServer(isLiveJob, erpPull, syncStoreDTO) {
    let pageNumber = 0, currentPage, jobMasterMapWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap, jobStatusIdJobSummaryMap
    let pageSize = isLiveJob ? 200 : 3
    let isLastPageReached = false, json, isJobsPresent = false, jobMasterIds
    const appModulesList = await keyValueDBService.getValueFromStore(CUSTOMIZATION_APP_MODULE)
    let jobAssignmentModule = moduleCustomizationService.getModuleCustomizationForAppModuleId(appModulesList.value, JOB_ASSIGNMENT_ID)
    let postAssignmentList = _.size(jobAssignmentModule) == 0 ? null : jobAssignmentModule[0].remark ? JSON.parse(jobAssignmentModule[0].remark).postAssignmentList : null
    const unseenStatusIds = postAssignmentList && _.size(postAssignmentList) > 0 ? jobStatusService.getStatusIdListForStatusCodeAndJobMasterList(syncStoreDTO.statusList, postAssignmentList, UNSEEN) : jobStatusService.getAllIdsForCode(syncStoreDTO.statusList, UNSEEN)
    let jobMasterTitleList = []
    while (!isLastPageReached) {
      const tdcResponse = await this.downloadDataFromServer(pageNumber, pageSize, isLiveJob, erpPull)
      if (tdcResponse) {
        json = await tdcResponse.json
        isLastPageReached = json.last
        currentPage = json.number
        if (!_.isNull(json.content) && !_.isUndefined(json.content) && !_.isEmpty(json.content)) {
          jobMasterMapWithAssignOrderToHubEnabled = jobMasterService.getJobMasterMapWithAssignOrderToHub(syncStoreDTO.jobMasterList)
          jobMasterIdJobStatusIdOfPendingCodeMap = jobStatusService.getStatusIdForJobMasterIdFilteredOnCodeMap(syncStoreDTO.statusList, PENDING)
          jobStatusIdJobSummaryMap = jobSummaryService.getJobStatusIdJobSummaryMap(syncStoreDTO.jobSummaryList)
          jobMasterIds = await this.processTdcResponse(json.content, isLiveJob, syncStoreDTO, jobMasterMapWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap)
        } else {
          isLastPageReached = true
        }
        const successSyncIds = this.getSyncIdFromResponse(json.content)
        //Dont hit delete sync API if successSyncIds empty
        //Delete Data from server code starts here

        if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
          isJobsPresent = true
          const postOrderList = await keyValueDBService.getValueFromStore(POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS)
          const unseenTransactions = postOrderList ? jobTransactionService.getJobTransactionsForDeleteSync(unseenStatusIds, postOrderList.value) : jobTransactionService.getJobTransactionsForStatusIds(unseenStatusIds)
          const jobMasterIdJobStatusIdTransactionIdDtoObject = jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions, jobMasterIdJobStatusIdOfPendingCodeMap, jobStatusIdJobSummaryMap)
          const messageIdDTOs = []
          if (!isLiveJob) {
            await this.deleteDataFromServer(successSyncIds, messageIdDTOs, jobMasterIdJobStatusIdTransactionIdDtoObject.transactionIdDtos, jobMasterIdJobStatusIdTransactionIdDtoObject.jobSummaries)
            await keyValueDBService.deleteValueFromStore(POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS)
          }
          realm.saveList(TABLE_JOB_TRANSACTION, jobMasterIdJobStatusIdTransactionIdDtoObject.updatedTransactonsList)
          jobMasterTitleList = jobMasterTitleList.concat(jobMasterService.getJobMasterTitleListFromIds(jobMasterIds, syncStoreDTO.jobMasterList))
          await jobSummaryService.updateJobSummaryForSync(jobMasterIdJobStatusIdTransactionIdDtoObject.jobSummaries, jobStatusIdJobSummaryMap)
          await addServerSmsService.setServerSmsMapForPendingStatus(jobMasterIdJobStatusIdTransactionIdDtoObject.jobMasterIdJobStatusIdTransactionIdDtoMap)
          if (erpPull) {
            user.lastERPSyncWithServer = moment().format('YYYY-MM-DD HH:mm:ss')
            await keyValueDBService.validateAndSaveData(USER, user)
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
        erpPull = false
      }
    }
    let showLiveJobNotification = await keyValueDBService.getValueFromStore('LIVE_JOB');
    if (!_.isEmpty(jobMasterTitleList) && (!isLiveJob || (showLiveJobNotification && showLiveJobNotification.value))) {
      this.showNotification(_.uniq(jobMasterTitleList))
      await keyValueDBService.validateAndSaveData('LIVE_JOB', new Boolean(false))
    }
    if (isJobsPresent) {
      await runSheetService.updateRunSheetAndUserSummary()
    }
    return isJobsPresent
  }

  showNotification(jobMasterTitleList) {
    const alertBody = (jobMasterTitleList.constructor === Array) ? jobMasterTitleList.join() : jobMasterTitleList
    const message = (jobMasterTitleList.constructor === Array) ? `You have new updates for ${alertBody} jobs` : alertBody
    PushNotification.localNotification({
      /* iOS and Android properties */
      title: FAREYE_UPDATES, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
      message, // (required)
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    });
  }

  async calculateDifference() {
    const lastSyncTime = await keyValueDBService.getValueFromStore(LAST_SYNC_WITH_SERVER)
    const differenceInDays = moment().diff(lastSyncTime.value, 'days')
    const differenceInHours = moment().diff(lastSyncTime.value, 'hours')
    const differenceInMinutes = moment().diff(lastSyncTime.value, 'minutes')
    const differenceInSeconds = moment().diff(lastSyncTime.value, 'seconds')
    let timeDifference = ""
    if (differenceInDays > 0) {
      timeDifference = `${differenceInDays} days ago`
    } else if (differenceInHours > 0) {
      timeDifference = `${differenceInHours} hours ago`
    } else if (differenceInMinutes > 0) {
      timeDifference = `${differenceInMinutes} minutes ago`
    } else {
      timeDifference = `${differenceInSeconds} seconds ago`
    }
    return timeDifference
  }

  getJobTransactionAndNewJobTransactionIds(jobTransactionList) {
    let jobTransactionsIds = [], newJobTransactionsIds = []
    for (let jobTransaction in jobTransactionList) {
      if (!jobTransactionList[jobTransaction].negativeJobTransactionId) {
        jobTransactionsIds.push(jobTransactionList[jobTransaction].id)
      } else if (jobTransactionList[jobTransaction].negativeJobTransactionId < 0) {
        newJobTransactionsIds.push(jobTransactionList[jobTransaction].negativeJobTransactionId)
      }
    }
    return {
      jobTransactionsIds,
      newJobTransactionsIds
    }
  }
}

export let sync = new Sync()