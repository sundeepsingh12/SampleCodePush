const {
  JOB_STATUS,
  TABIDMAP
} = require('../../lib/constants').default

import {
  keyValueDBService
} from './KeyValueDBService'

import _ from 'underscore'

class JobStatus {

  /**A generic method for getting all status ids based on particular status code
   * 
   * Possible values of statusCode - UNSEEN,PENDING
   * @param {*} statusCode 
   * 
   * Sample Return Value
   * [4585, 4640, 4648, 4703, 4719, 4750, 4792] 
   */
  async getAllIdsForCode(statusCode) {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if(_.isEmpty(jobStatusArray.value) || _.isUndefined(jobStatusArray.value)){
      throw new Error('Invalid Status Code')
    }
    const jobStatusIds = await jobStatusArray.value.filter(jobStatusObject => jobStatusObject.code == statusCode)
      .map(jobStatusObject => jobStatusObject.id)
      console.log('jobStatusIds')
        console.log(jobStatusIds)
    return jobStatusIds
  }

  /**Generic method for getting particular status id of a particular job master and job status code
   * 
   * @param {*} jobMasterId 
   * @param {*} code 
   */
  async getStatusIdForJobMasterIdAndCode(jobMasterId, jobStatusCode) {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if(_.isUndefined(jobStatusArray.value) || _.isEmpty(jobStatusArray.value)){
      throw new Error('Invalid Job Master or Job Status')
    }
    const jobStatusId = await jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobStatusObject.jobMasterId == jobMasterId))
      .map(jobStatusObject => jobStatusObject.id)
      console.log('jobStatusId')
       console.log(jobStatusId)
        console.log('jobStatusId[0]')
       console.log(jobStatusId[0])
    return jobStatusId[0]
  }

  /**Returns jobMasterId Vs JobStatusId Map from set of jobMasterIds and a status code
   * 
   * @param {*} jobMasterIdList 
   * @param {*} jobStatusCode 
   * 
   * Sample Return type
   *  {930: 4813}
   * 
   */
  async getjobMasterIdStatusIdMap(jobMasterIdList, jobStatusCode) {
    let jobMasterIdStatusIdMap = {}
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if(_.isUndefined(jobStatusArray.value)|| _.isEmpty(jobStatusArray.value)){
       throw new Error('Invalid Job Master or Job Status Code')
    }
    const filteredJobStatusArray = await jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobMasterIdList.includes(jobStatusObject.jobMasterId)))
    if(_.isUndefined(filteredJobStatusArray) || _.isEmpty(filteredJobStatusArray)){
       throw new Error('Invalid Job Master or Job Status Code')
    }
    filteredJobStatusArray.forEach(jobStatusObject => {
      jobMasterIdStatusIdMap[jobStatusObject.jobMasterId] = jobStatusObject.id
    })
      console.log('jobMasterIdStatusIdMap')
       console.log(jobMasterIdStatusIdMap)
    return jobMasterIdStatusIdMap
  }

  getStatusIdsForTabId(tabId) {
    const tabIdMap = keyValueDBService.getValueFromStore()
    console.log(tabIdMap.value[tabId])
    return tabIdMap.value[tabId]
  }

}

export let jobStatusService = new JobStatus()
