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
  JOB_MASTER,
  POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS,
  LAST_SYNC_WITH_SERVER,
  PAGES,
  TABLE_MESSAGE_INTERACTION
} from '../../lib/constants'
import { FAREYE_UPDATES, PAGE_OUTSCAN, PATH_TEMP } from '../../lib/AttributeConstants'
import { pages } from './Pages'
import { JOBS_DELETED } from '../../lib/ContainerConstants'
import { geoFencingService } from './GeoFencingService'
import FCM from "react-native-fcm"
import RNFS from 'react-native-fs'
import { showToastAndAddUserExceptionLog } from '../../modules/global/globalActions'

class Sync {

  async createAndUploadZip(syncStoreDTO, currentDate) {
    let isFileExists = await RNFS.exists(PATH_TEMP);
    if (isFileExists) {
      await RNFS.unlink(PATH_TEMP).then(() => { }).catch((error) => { showToastAndAddUserExceptionLog(2901, JSON.stringify(error), 'danger', 0) })
    }
    const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
    if (!token) {
      throw new Error('Token Missing')
    }
    await syncZipService.createZip(syncStoreDTO)
    const responseBody = await RestAPIFactory(token.value).uploadZipFile(null, null, currentDate, syncStoreDTO)
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
    let tdcContentObject, jobMasterIds, messageIdDto = []
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
      } else if (queryType == 'message') {
        messageIdDto = messageIdDto.concat(this.saveMessagesInDb(tdcContentObject))
      }
    }
    return { jobMasterIds, messageIdDto }
  }

  getAssignOrderTohubEnabledJobs(query, syncStoreDTO, jobMasterMapWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap) {
    let allJobsToTransactions = []
    let transactionList = query.jobTransactions
    let jobIdJobIdMap = {}
    for (let jobTransaction in transactionList) {
      jobIdJobIdMap[transactionList[jobTransaction].jobId] = transactionList[jobTransaction].jobId
    }
    for (let jobs of query.job) {
      let jobMaster = jobMasterMapWithAssignOrderToHubEnabled[jobs.jobMasterId]
      //Make transactions for those whose job transaction node is null
      if (jobMaster && (!jobIdJobIdMap[jobs.id]) && jobs.status == 1) {
        let unassignedTransactions = this.createTransactionsOfUnassignedJobs(jobs, syncStoreDTO, jobMaster, jobMasterIdJobStatusIdOfPendingCodeMap)
        allJobsToTransactions.push(unassignedTransactions)
      }
    }
    return allJobsToTransactions
  }

  createTransactionsOfUnassignedJobs(job, syncStoreDTO, jobMaster, jobMasterIdJobStatusIdOfPendingCodeMap) {
    let jobStatusId = jobMasterIdJobStatusIdOfPendingCodeMap[job.jobMasterId];
    let jobtransaction = this.getDefaultValuesForJobTransaction(-job.id, jobStatusId, job.referenceNo, syncStoreDTO.user, syncStoreDTO.hub, syncStoreDTO.imei, jobMaster);
    return jobtransaction
  }

  getDefaultValuesForJobTransaction(id, statusid, referenceNumber, user, hub, imei, jobMaster) {
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
      jobType: jobMaster.code, // single value pass in param
      jobMasterId: jobMaster.id, // single value pass in param
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
    const jobIds = contentQuery.job.map(jobObject => jobObject.id)
    const existingJobDatas = {
      tableName: TABLE_JOB_DATA,
      valueList: jobIds,
      propertyName: 'jobId'
    }
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
    //Job data is deleted in insert query also,to handle multiple login case 
    //Ideally Id should be added server side in jobdata table
    realm.deleteRecordsInBatch(existingJobDatas)
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
    let jobSummaries = []
    for (let jobMasterId in jobMasterIdJobStatusIdTransactionIdDtoMap) {
      for (let unseenStatusId in jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId]) {
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
    let isLastPageReached = false, json, isJobsPresent = false, jobMasterIdsAndNumberOfMessages
    const pagesList = await keyValueDBService.getValueFromStore(PAGES)
    let outScanModuleJobMasterIds = pages.getJobMasterIdListForScreenTypeId(pagesList.value, PAGE_OUTSCAN)
    const unseenStatusIds = !_.isEmpty(outScanModuleJobMasterIds) ? jobStatusService.getStatusIdListForStatusCodeAndJobMasterList(syncStoreDTO.statusList, outScanModuleJobMasterIds, UNSEEN) : jobStatusService.getAllIdsForCode(syncStoreDTO.statusList, UNSEEN)
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
          jobMasterIdsAndNumberOfMessages = await this.processTdcResponse(json.content, isLiveJob, syncStoreDTO, jobMasterMapWithAssignOrderToHubEnabled, jobMasterIdJobStatusIdOfPendingCodeMap)
        } else {
          isLastPageReached = true
        }
        const successSyncIds = this.getSyncIdFromResponse(json.content)
        //Dont hit delete sync API if successSyncIds empty
        //Delete Data from server code starts here

        if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
          isJobsPresent = true
          const postOrderList = await keyValueDBService.getValueFromStore(POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS)

          const unseenTransactions = postOrderList && _.size(postOrderList.value) > 0 ? jobTransactionService.getJobTransactionsForDeleteSync(unseenStatusIds, postOrderList.value) : jobTransactionService.getJobTransactionsForStatusIds(unseenStatusIds)
          const jobMasterIdJobStatusIdTransactionIdDtoObject = jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions, jobMasterIdJobStatusIdOfPendingCodeMap, jobStatusIdJobSummaryMap)
          const messageIdDTOs = jobMasterIdsAndNumberOfMessages && jobMasterIdsAndNumberOfMessages.messageIdDto ? jobMasterIdsAndNumberOfMessages.messageIdDto : []
          if (!isLiveJob) {
            await this.deleteDataFromServer(successSyncIds, messageIdDTOs, jobMasterIdJobStatusIdTransactionIdDtoObject.transactionIdDtos, jobMasterIdJobStatusIdTransactionIdDtoObject.jobSummaries)
            if (postOrderList) {
              await this.deleteSpecificTransactionFromStoreList(postOrderList.value, POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS, moment().format('YYYY-MM-DD HH:mm:ss'))
            }
          }
          realm.saveList(TABLE_JOB_TRANSACTION, jobMasterIdJobStatusIdTransactionIdDtoObject.updatedTransactonsList)
          jobMasterTitleList = jobMasterTitleList.concat(jobMasterService.getJobMasterTitleListFromIds(jobMasterIdsAndNumberOfMessages.jobMasterIds, syncStoreDTO.jobMasterList))
          await addServerSmsService.setServerSmsMapForPendingStatus(jobMasterIdJobStatusIdTransactionIdDtoObject.updatedTransactonsList)
          if (erpPull) {
            user.lastERPSyncWithServer = moment().format('YYYY-MM-DD HH:mm:ss')
            await keyValueDBService.validateAndSaveData(USER, user)
          }
          await geoFencingService.addGeoFence(true)
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
      this.showJobMasterNotification(_.uniq(jobMasterTitleList))
      await keyValueDBService.validateAndSaveData('LIVE_JOB', new Boolean(false))
    }
    if (jobMasterIdsAndNumberOfMessages && jobMasterIdsAndNumberOfMessages.messageIdDto && jobMasterIdsAndNumberOfMessages.messageIdDto.length > 0) {
      this.showMessageNotification(jobMasterIdsAndNumberOfMessages.messageIdDto.length)
    }
    if (isJobsPresent) {
      await runSheetService.updateRunSheetUserAndJobSummary()
    }
    return isJobsPresent
  }

  showJobMasterNotification(jobMasterTitleList) {
    const body = (jobMasterTitleList.constructor === Array) ? jobMasterTitleList.join() : jobMasterTitleList
    const message = (jobMasterTitleList.constructor === Array) ? `You have new updates for ${body} jobs` : body
    this.showNotification(FAREYE_UPDATES, message, '1')
  }

  showMessageNotification(numberOfMessages) {
    const message = `You have ${numberOfMessages} new messages`
    this.showNotification(FAREYE_UPDATES, message, '2')
  }

  showNotification(title, message, id) {
    FCM.presentLocalNotification({
      id: id,
      title: title,
      body: message,
      priority: "high",
      sound: "default",
      show_in_foreground: true
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
      jobTransactionsIds.push(jobTransactionList[jobTransaction].id)
      if (jobTransactionList[jobTransaction].negativeJobTransactionId < 0) {
        newJobTransactionsIds.push(jobTransactionList[jobTransaction].negativeJobTransactionId)
      }
    }
    return {
      jobTransactionsIds,
      newJobTransactionsIds
    }
  }

  /**Called when home screen is mounted,app sends fcm token to server
   * 
   * @param {*} token 
   * @param {*} fcmToken 
   * @param {*} topic 
   */
  sendRegistrationTokenToServer(token, fcmToken, topic) {
    const url = CONFIG.API.FCM_TOKEN_REGISTRATON + '?topic=' + topic
    RestAPIFactory(token.value).serviceCall(fcmToken, url, 'POST')
  }


  /**This de-registers fcm token from server and removes local/delivered notifications
   * 
   * Try/Catch is written here so that logout doesn't gets affected
   * 
   * @param {*} userObject 
   * @param {*} token 
   * @param {*} fcmToken 
   */
  deregisterFcmTokenFromServer(userObject, token, fcmToken) {
    try {
      FCM.cancelAllLocalNotifications()
      FCM.removeAllDeliveredNotifications()
      const topic = `FE_${userObject.value.id}`
      FCM.unsubscribeFromTopic(topic);
      const url = CONFIG.API.FCM_TOKEN_DEREGISTRATION + '?topic=' + topic
      RestAPIFactory(token.value).serviceCall(fcmToken.value, url, 'POST')
    } catch (error) {
    }
  }

  saveMessagesInDb(contentData) {
    let messageInteractionList = JSON.parse(contentData.query)
    let messageIdList = [], currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    let currentFieldDataObject = {}; // used object to set currentFieldDataId as call-by-reference whereas if we take integer then it is by call-by-value and hence value of id is not updated in that scenario.
    currentFieldDataObject.currentFieldDataId = realm.getRecordListOnQuery(TABLE_MESSAGE_INTERACTION, null, true, 'id').length;
    for (let message of messageInteractionList.messageDataCenters) {
      messageIdList.push({
        id: message.id,
        dateTimeOfMessageReceiving: currentTime
      })
      message.id = currentFieldDataObject.currentFieldDataId
      currentFieldDataObject.currentFieldDataId++
    }

    realm.saveList(TABLE_MESSAGE_INTERACTION, messageInteractionList.messageDataCenters)
    return messageIdList
  }
  /**
   * This function deletes transaction list from schema that has been synced successfully with server.
   * This handles cases when api response comes late and other transactions are added in schema.
   * @param {*} transactionIdsSynced
   * @param {*} schemaName
   * @param {*} date
   */
  async deleteSpecificTransactionFromStoreList(transactionIdsSynced, schemaName, date) {
    let transactionToBeSynced = await keyValueDBService.getValueFromStore(schemaName);
    let originalTransactionsToBeSynced = transactionToBeSynced ? transactionToBeSynced.value : {}
    for (let index in transactionIdsSynced) {
      if (moment(originalTransactionsToBeSynced[index].syncTime).isBefore(moment(date).format('YYYY-MM-DD HH:mm:ss')) || moment(originalTransactionsToBeSynced[index].syncTime.isSame(moment(date).format('YYYY-MM-DD HH:mm:ss')))) {
        delete originalTransactionsToBeSynced[index]
      }
    }
    if (originalTransactionsToBeSynced && _.size(originalTransactionsToBeSynced) > 0) {
      await keyValueDBService.validateAndSaveData(schemaName, originalTransactionsToBeSynced);
    } else {
      await keyValueDBService.deleteValueFromStore(schemaName);
    }
  }
}


export let sync = new Sync()