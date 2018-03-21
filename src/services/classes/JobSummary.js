import {
  JOB_SUMMARY,
  LAST_SYNC_WITH_SERVER,
  TABLE_JOB_TRANSACTION
} from '../../lib/constants'

import {
  keyValueDBService
} from './KeyValueDBService'

import moment from 'moment'
import _ from 'lodash'
import * as realm from '../../repositories/realmdb'


class JobSummary {

  /**
   * 
   * @param {*} jobSummaries 
   */
  async updateJobSummary(jobSummaries) {
    if (_.isUndefined(jobSummaries) || _.isNull(jobSummaries) || _.isEmpty(jobSummaries)) {
      return
    }
    const jobSummariesInStore = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    if (!jobSummariesInStore || !jobSummariesInStore.value) {
      throw new Error('Unable to update Job Summary')
    }
    const jobSummaryIdJobSummaryObjectMap = {}
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    jobSummaries.forEach(jobSummaryObject => {
      jobSummaryIdJobSummaryObjectMap[jobSummaryObject.id] = jobSummaryObject
    })
    jobSummariesInStore.value.forEach(jobSummaryObject => {
      if (jobSummaryIdJobSummaryObjectMap[jobSummaryObject.id]) {
        jobSummaryObject.updatedTime = currentDate
        jobSummaryObject.count = jobSummaryIdJobSummaryObjectMap[jobSummaryObject.id].count
      }
    })
    await keyValueDBService.validateAndUpdateData(JOB_SUMMARY, jobSummariesInStore)
  }

  //TODO remove updateJobSummaryForSync method by passing jobStatusIdJobSummaryMap in every call of updateJobSummary
  async updateJobSummaryForSync(jobSummaries, jobStatusIdJobSummaryMap) {
    if (!jobSummaries || _.isEmpty(jobSummaries)) {
      return
    }

    if (!jobStatusIdJobSummaryMap) {
      throw new Error('Unable to update Job Summary')
    }
    let jobSummaryIdJobSummaryObjectMap = {}
    let currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    jobSummaries.forEach(jobSummaryObject => {
      jobSummaryObject.updatedTime = currentDate
      jobStatusIdJobSummaryMap[jobSummaryObject.jobStatusId] = jobSummaryObject
    })
    await keyValueDBService.validateAndUpdateData(JOB_SUMMARY, Object.values(jobStatusIdJobSummaryMap))
  }

  /**A generic method for getting jobSummary from store given a particular jobStatusId and jobMasterId
   * 
   * @param {*} jobMasterId 
   * @param {*} statusId 
   * 
   * Sample Return Type
   * 
   * {
    * id: 2260120,
    * userId: 4957,
    * hubId: 2759,
    * cityId: 744,
    * companyId: 295,
    * jobStatusId:4814,
    * count:1,
      date:'2017-06-26 00:00:00'
   * }
   */
  async getJobSummaryData(jobMasterId, statusId) {
    const alljobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    if (!alljobSummaryList || !alljobSummaryList.value) {
      throw new Error('Value of JobSummary missing')
    }
    const filteredJobSummaryList = await alljobSummaryList.value.filter(jobSummaryObject => (jobSummaryObject.jobStatusId == statusId && jobSummaryObject.jobMasterId == jobMasterId))
    return filteredJobSummaryList[0]
  }

  async getJobSummaryDataOnLastSync(lastSyncTime) {
    const alljobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    let filteredJobSummaryList = []
    for (let index of alljobSummaryList.value) {
      if (moment(index.updatedTime).isAfter(lastSyncTime.value)) {
        delete index.updatedTime
        filteredJobSummaryList.push(index)
      }
    }
    return filteredJobSummaryList
  }

  getJobSummaryListForSync(jobSummaryList, lastSyncTime) {
    let filteredJobSummaryList = []
    for (let index in jobSummaryList) {
      // If job summary updated time is after last sync time with server then has to be sent to server
      if (moment(jobSummaryList[index].updatedTime).isAfter(lastSyncTime)) {
        delete jobSummaryList[index].updatedTime
        filteredJobSummaryList.push(jobSummaryList[index])
      }
    }
    return filteredJobSummaryList
  }

  /**
   * @param {*} jobSummaryList 
   * @returns
   * {
   *    jobStatusId : jobSummary
   * }
   */
  getJobStatusIdJobSummaryMap(jobSummaryList) {
    let jobStatusIdJobSummaryMap = {}
    for (let index in jobSummaryList) {
      jobStatusIdJobSummaryMap[jobSummaryList[index].jobStatusId] = jobSummaryList[index];
    }
    return jobStatusIdJobSummaryMap
  }
}

export let jobSummaryService = new JobSummary()
