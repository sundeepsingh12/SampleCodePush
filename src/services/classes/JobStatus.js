import {
  JOB_STATUS,
  UNSEEN,
  TAB,
} from '../../lib/constants'

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
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error('Job status missing in store')
    }
    const jobStatusIds = jobStatusArray.value.filter(jobStatusObject => jobStatusObject.code == statusCode)
      .map(jobStatusObject => jobStatusObject.id)
    return jobStatusIds
  }

  /**Generic method for getting particular status id of a particular job master and job status code
   * 
   * @param {*} jobMasterId 
   * @param {*} code 
   */
  async getStatusIdForJobMasterIdAndCode(jobMasterId, jobStatusCode) {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error('Job status missing in store')
    }
    const jobStatusId = jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobStatusObject.jobMasterId == jobMasterId))
      .map(jobStatusObject => jobStatusObject.id)
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
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error('Job status missing in store')
    }
    const filteredJobStatusArray = await jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobMasterIdList.includes(jobStatusObject.jobMasterId)))
    if (_.isUndefined(filteredJobStatusArray) || _.isNull(filteredJobStatusArray)) {
      throw new Error('Invalid Job Master or Job Status Code')
    }
    filteredJobStatusArray.forEach(jobStatusObject => {
      jobMasterIdStatusIdMap[jobStatusObject.jobMasterId] = jobStatusObject.id
    })
    return jobMasterIdStatusIdMap
  }

  /**
   * 
   * @param {*} statusList 
   * @param {*} jobAttributeStatusMap 
   * @returns 
   * {
   * JobMasterIdJobAttributeStatusMap : {
   *                                      jobMasterId : {
   *                                                      statusId : {
   *                                                                    jobAttributeMasterId : {jobAttributeStatus}
   *                                                                 }
   *                                                    }
   *                                    }
   * StatusIdStatusMap : {
   *                            statusId : status
   *                          }
   * }
   */
  getJobMasterIdStatusIdMap(statusList, jobAttributeStatusMap) {
    let jobMasterIdJobAttributeStatusMap = {}
    let statusIdStatusMap = {}
    statusList = statusList ? statusList : []
    statusList.forEach(status => {
      statusIdStatusMap[status.id] = status
      if (!jobAttributeStatusMap[status.id]) {
        return
      }
      jobMasterIdJobAttributeStatusMap[status.jobMasterId] = jobMasterIdJobAttributeStatusMap[status.jobMasterId] ? jobMasterIdJobAttributeStatusMap[status.jobMasterId] : {}
      jobMasterIdJobAttributeStatusMap[status.jobMasterId][status.id] = jobAttributeStatusMap[status.id]
    })
    return {
      jobMasterIdJobAttributeStatusMap,
      statusIdStatusMap
    }
  }

  /** Returns statusIds based on particular status category 
   * where code is not 'UNSEEN' 
   * 
   * Possible values of statusCategory - 1,2,3
   * @param {*} statusCategory 
   * 
   * Sample Return value
   * [1,2,3]
   */
  async getNonUnseenStatusIdsForStatusCategory(statusCategory) {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error('Job status missing in store')
    }
    const filteredJobStatusIds = jobStatusArray.value.filter(jobStatus => jobStatus.statusCategory == statusCategory && jobStatus.code != UNSEEN).map(jobStatus => jobStatus.id)
    return filteredJobStatusIds
  }

  /** Returns statusIds based on particular status category  and status_code  and also check that 
   *  job_status_tab is not hidden
   * 
   * Sample Return value
   * [1,2,3]
   */
  
  async getStatusIdsForAllStatusCategory() {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    const tabs = await keyValueDBService.getValueFromStore(TAB)
    if (!tabs || !tabs.value) {
      throw new Error('tab missing in store')
    }
    const tabList = {}
    tabs.value.forEach(key => tabList[key.id] = key)
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error('Job status missing in store')
    }
    const jobStatusList = jobStatusArray.value
    let pendingStatusIds = [], failStatusIds =[], successStatusIds = [];
    for(id in jobStatusList){
        if(jobStatusList[id].statusCategory == 1 && jobStatusList[id].code != UNSEEN && tabList[jobStatusList[id].tabId].name.toLocaleLowerCase() !== 'hidden'){
          pendingStatusIds.push(jobStatusList[id].id)
          continue
        }
        if(jobStatusList[id].statusCategory == 3  && tabList[jobStatusList[id].tabId].name.toLocaleLowerCase() !== 'hidden'){
          successStatusIds.push(jobStatusList[id].id)
          continue
        }
        if(jobStatusList[id].statusCategory == 2  && tabList[jobStatusList[id].tabId].name.toLocaleLowerCase() !== 'hidden'){
          failStatusIds.push(jobStatusList[id].id)
        }
    }
   return {pendingStatusIds,failStatusIds,successStatusIds}
  }


  async getStatusCategoryOnStatusId(jobStatusId){
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    const category = jobStatusArray.value.filter(jobStatus => jobStatus.id ==jobStatusId &&  jobStatus.code != UNSEEN).map(id => id.statusCategory)
    return category[0];
  }
}

export let jobStatusService = new JobStatus()