const {
  JOB_SUMMARY
} = require('../../lib/constants').default

import {
  keyValueDBService
} from './KeyValueDBService'

import _ from 'underscore'

class JobSummary {

  /**Sample Return type
   * [
   *  {
   *    cityId: 744
        companyId: 295
        count:0
        date:"2017-06-19 00:00:00"
        hubId:2757
        id:2229406
        jobMasterId:930
        jobStatusId:4814 //unseen status id
        userId:4954
   *  }
   * ,{
   * cityId: 744
        companyId: 295
        count:0
        date:"2017-06-19 00:00:00"
        hubId:2757
        id:2229894
        jobMasterId:930
        jobStatusId:4813 //pending status id
        userId:4954
   * }
   * 
   * ]
   * 
   * @param {*} unseenTransactionsMap 
   */
  async getSummaryForDeleteSyncApi(unseenTransactionsMap) {
    const jobSummaries = []
    const jobMasterIdJobStatusIdTransactionIdDtoMap = unseenTransactionsMap.jobMasterIdJobStatusIdTransactionIdDtoMap
    for (let jobMasterId in jobMasterIdJobStatusIdTransactionIdDtoMap) {
      for (let unseenStatusId in jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId]) {
        let count = jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId].length
        let pendingID = jobMasterIdJobStatusIdTransactionIdDtoMap[jobMasterId][unseenStatusId][0].pendingStatusId
        let unseenJobSummaryData = await this.getJobSummaryData(jobMasterId, unseenStatusId)
        unseenJobSummaryData.count = 0
        await jobSummaries.push(unseenJobSummaryData)
        let pendingJobSummaryData = await this.getJobSummaryData(jobMasterId, pendingID)
        console.log('pendingJobSummaryData.count')
        console.log(pendingJobSummaryData.count)
        pendingJobSummaryData.count += count
        await jobSummaries.push(pendingJobSummaryData)
      }
    }
    return jobSummaries
  }

  /**
   * 
   * @param {*} jobSummaries 
   */
  async updateJobSummary(jobSummaries) {
    const jobSummariesInStore = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    const jobSummaryIds = await jobSummaries.map(jobSummaryObject => jobSummaryObject.id)
    const jobSummaryIdJobSummaryObjectMap = {}
    
    jobSummaries.forEach(jobSummaryObject => {
      jobSummaryIdJobSummaryObjectMap[jobSummaryObject.id] = jobSummaryObject
    })
    jobSummariesInStore.value.forEach(jobSummaryObject => {
      if (jobSummaryIdJobSummaryObjectMap[jobSummaryObject.id]) {
        jobSummaryObject.count = jobSummaryIdJobSummaryObjectMap[jobSummaryObject.id].count
      }
    })
    await keyValueDBService.validateAndUpdateData(JOB_SUMMARY, jobSummariesInStore)

  }
  /**A generic method for getting jobSummary from store given a particular jobStatusId and jobMasterId
   * 
   * @param {*} jobMasterId 
   * @param {*} statusId 
   */
  async getJobSummaryData(jobMasterId, statusId) {
    const alljobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    if(_.isUndefined(alljobSummaryList.value) || _.isEmpty(alljobSummaryList.value)){
      throw new Error('Value of JobSummary missing ')
    }
    const filteredJobSummaryList = await alljobSummaryList.value.filter(jobSummaryObject => (jobSummaryObject.jobStatusId == statusId && jobSummaryObject.jobMasterId == jobMasterId))
    console.log('filteredJobSummaryList[0]')
    console.log(filteredJobSummaryList[0])
    return filteredJobSummaryList[0]
  }
}

export let jobSummaryService = new JobSummary()
