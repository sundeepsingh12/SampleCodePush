import {
  JOB_STATUS,
  UNSEEN,
  TAB,
  PENDING,
  SEEN
} from '../../lib/constants'
import { keyValueDBService } from './KeyValueDBService'
import _ from 'lodash'
import { JOB_STATUS_MISSING } from '../../lib/ContainerConstants'

class JobStatus {

  /**A generic method for getting all status ids based on particular status code
   * 
   * Possible values of statusCode - UNSEEN,PENDING
   * @param {*} statusCode 
   * 
   * Sample Return Value
   * [4585, 4640, 4648, 4703, 4719, 4750, 4792] 
   */
  getAllIdsForCode(statusList, statusCode) {
    if (!statusList) {
      throw new Error(JOB_STATUS_MISSING)
    }
    const jobStatusIds = statusList.filter(jobStatusObject => jobStatusObject.code == statusCode).map(jobStatusObject => jobStatusObject.id)
    return jobStatusIds
  }

  /**Generic method for getting particular status id of a particular job master and job status code
   * 
   * @param {*} jobMasterId 
   * @param {*} jobStatusCode 
   */
  async getStatusIdForJobMasterIdAndCode(jobMasterId, jobStatusCode) {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error(JOB_STATUS_MISSING)
    }
    const jobStatusId = jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobStatusObject.jobMasterId == jobMasterId))
      .map(jobStatusObject => jobStatusObject.id)
    return jobStatusId[0]
  }

  /**
   * This function filters job status on basis of jobMasterId and jobStatusCode
   * @param {*} jobMasterId 
   * @param {*} jobStatusCode 
   * @returns
   * jobStatus
   */
  async getStatusForJobMasterIdAndCode(jobMasterId, jobStatusCode) {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error(JOB_STATUS_MISSING)
    }
    const jobStatus = jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobStatusObject.jobMasterId == jobMasterId))
    return jobStatus[0]
  }

  /**Returns jobMasterId Vs JobStatusId Map from set of jobMasterIds and a status id
   * 
   * @param {*} jobMasterIdList 
   * @param {*} jobStatusCode 
   * 
   * Sample Return type
   *  {930: 4813}
   * 
   */
  getjobMasterIdStatusIdMap(jobMasterIdList, jobStatusCode, jobStatusArray) {
    let jobMasterIdStatusIdMap = {}
    // const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS) 
    if (!jobStatusArray) {
      throw new Error(JOB_STATUS_MISSING)
    }
    //optimize using for loop
    const filteredJobStatusArray = jobStatusArray.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobMasterIdList.includes(jobStatusObject.jobMasterId)))
    if (_.isUndefined(filteredJobStatusArray) || _.isNull(filteredJobStatusArray)) {
      throw new Error('Invalid Job Master or Job Status Code')
    }
    filteredJobStatusArray.forEach(jobStatusObject => {
      jobMasterIdStatusIdMap[jobStatusObject.jobMasterId] = jobStatusObject.id
    })
    return jobMasterIdStatusIdMap
  }

  /**
   * This function returns status id list for specific status code and not present in list of jobmaster ids
   * @param {*} jobMasterIdList 
   * @param {*} jobStatusCode 
   * @returns
   * [jobStatusIdList]
   */
  getStatusIdListForStatusCodeAndJobMasterList(statusList, jobMasterIdList, jobStatusCode) {
    if (!statusList) {
      throw new Error(JOB_STATUS_MISSING)
    }
    const filteredJobStatusArray = statusList.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && !jobMasterIdList.includes(jobStatusObject.jobMasterId)))
    let jobStatusIdList = filteredJobStatusArray.map(jobStatusObject => jobStatusObject.id)
    return jobStatusIdList
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
    let jobMasterIdJobAttributeStatusMap = {}, statusIdStatusMap = {},unseenStatusIdCodeMap={}
    statusList = statusList ? statusList : []
    statusList.forEach(status => {
      statusIdStatusMap[status.id] = status

      if(status.code===UNSEEN){
        unseenStatusIdCodeMap[status.id] = status.code
      }

      if (!jobAttributeStatusMap[status.id]) {
        return
      }
      jobMasterIdJobAttributeStatusMap[status.jobMasterId] = jobMasterIdJobAttributeStatusMap[status.jobMasterId] ? jobMasterIdJobAttributeStatusMap[status.jobMasterId] : {}
      jobMasterIdJobAttributeStatusMap[status.jobMasterId][status.id] = jobAttributeStatusMap[status.id]
    })
    return { jobMasterIdJobAttributeStatusMap, statusIdStatusMap,unseenStatusIdCodeMap }
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
      throw new Error(JOB_STATUS_MISSING)
    }
    const filteredJobStatusIds = jobStatusArray.value.filter(jobStatus => jobStatus.statusCategory == statusCategory && jobStatus.code != UNSEEN).map(jobStatus => jobStatus.id)
    return filteredJobStatusIds
  }

  /**@function getStatusIdsForAllStatusCategory()
   * 
   * function return map of allStatusIds (pending, fail, success) with its status category and 
   * also map of status whose nextStatusList is empty
   * It also check for hidden tab
   *
   *@return  {allStatusMap :  {  123 : 1 , 124 : 2 , 125 : 3 }, noNextStatusMap : { 126 : true , 130 : true } }
   *
   */

  async getStatusIdsForAllStatusCategory() {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    let allStatusMap = {}, noNextStatusMap = {}
    let tabIdMap = await this.checkForHiddenTab()
    if (!jobStatusArray || !jobStatusArray.value) {//check for jobStatus in store
      throw new Error('Job status missing in store')
    }
    const jobStatusList = jobStatusArray.value
    for (let id in jobStatusList) {
      if (!tabIdMap[jobStatusList[id].tabId]) {// check for hidden tab 
        continue
      }
      if (jobStatusList[id].nextStatusList.length == 0 && jobStatusList[id].statusCategory != 1) {//check for status having no next status list 
        noNextStatusMap[jobStatusList[id].id] = true
      }
      if (jobStatusList[id].code != UNSEEN) { // check for all status whose code is not UNSEEN
        allStatusMap[jobStatusList[id].id] = jobStatusList[id].statusCategory
      }
    }
    return { allStatusMap, noNextStatusMap }
  }

  /**@function checkForHiddenTab()
      * 
      * function return tabLisId map with boolean whose tabName is not equal to hidden
      * 
      *@return {tabListMap : {1 : true, 2 : true}} 
      *
      */

  async checkForHiddenTab() {
    const tabs = await keyValueDBService.getValueFromStore(TAB)
    if (!tabs || !tabs.value) {
      throw new Error('tab missing in store')
    }
    const tabListMap = {}
    tabs.value.forEach(key => {
      if (key.name.toLocaleLowerCase() !== 'hidden') { // check for hidden tab
        tabListMap[key.id] = true
      }
    })
    return tabListMap
  }

  getTabIdOnStatusId(statusList, statusId) {
    let tabId
    for (let data of statusList) {
      if (data.id == statusId) {
        tabId = data.tabId
        break
      }
    }
    return tabId
  }

  isSeenStatusCode(jobStatusId, statusIdStatusMap) {
    const nextStatusList = statusIdStatusMap[jobStatusId].nextStatusList
    for (let id in nextStatusList) {
      if ((_.isEqual(_.toLower(nextStatusList[id].code), 'seen'))) {
        return nextStatusList[id].id
      }
    }
    return false
  }

  async getStatusCategoryOnStatusId(jobStatusId) {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error(JOB_STATUS_MISSING)
    }
    const category = jobStatusArray.value.filter(jobStatus => jobStatus.id == jobStatusId && jobStatus.code != UNSEEN).map(id => id.statusCategory)
    return category[0];
  }

  async getNonDeliveredStatusIds() {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    if (!jobStatusArray || !jobStatusArray.value) {
      throw new Error(JOB_STATUS_MISSING)
    }
    const filteredJobStatusIds = jobStatusArray.value.filter(jobStatus => jobStatus.code != UNSEEN && jobStatus.code != SEEN && jobStatus.code != PENDING).map(jobStatus => jobStatus.id)
    return filteredJobStatusIds
  }

  /**
   * This function return status for corresponding statusId
   * @param {*} jobStatusList 
   * @param {*} jobStatusId 
   * @returns
   * JobStatus
   */
  getJobStatusForJobStatusId(jobStatusList, jobStatusId) {
    if (!jobStatusId) {
      return [];
    }
    jobStatusList = jobStatusList ? jobStatusList : [];
    return jobStatusList.filter(jobStatus => jobStatus.id == jobStatusId)[0];
  }

  getStatusIdForJobMasterIdFilteredOnCodeMap(statusList, statusCode) {
    let jobMasterIdJobStatusIdMap = {};
    for (let index in statusList) {
      if (statusList[index].code == statusCode) {
        jobMasterIdJobStatusIdMap[statusList[index].jobMasterId] = statusList[index].id;
      }
    }
    return jobMasterIdJobStatusIdMap;
  }

  /**
   * This function prepares map of tabId on basis of jobStatusList
   * @param {*} jobStatusList 
   * {
   *    tabId : {
   *                [statusIds]
   *                tab
   *            }
   * }
   */
  prepareTabStatusIdMap(jobStatusList) {
    let tabIdStatusIdsMap = {};
    for (let index in jobStatusList) {
      if (jobStatusList[index].code == UNSEEN) {
        continue;
      }
      if (!tabIdStatusIdsMap[jobStatusList[index].tabId]) {
        tabIdStatusIdsMap[jobStatusList[index].tabId] = []
      }
      tabIdStatusIdsMap[jobStatusList[index].tabId].push(jobStatusList[index].id)
    }
    return tabIdStatusIdsMap;
  }
}

export let jobStatusService = new JobStatus()