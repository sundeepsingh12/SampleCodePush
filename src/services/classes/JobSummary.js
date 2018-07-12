import {
  JOB_SUMMARY,
} from '../../lib/constants'

import {
  keyValueDBService
} from './KeyValueDBService'

import moment from 'moment'
import _ from 'lodash'
import {
  UNABLE_TO_UPDATE_JOB_SUMMARY,
} from '../../lib/ContainerConstants'

class JobSummary {

  /**@function updateJobSummary(statusCountMap)
    * 
    * function caculate jobSummary count and save in store
    * 
    *@param {Object} statusCountMap // map of status id and count
    *
    *@description => update jobSummary count and updatedTime and update in store 
    *
    */
  async updateJobSummary(statusCountMap) {
    let jobSummariesInStore = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    if (!jobSummariesInStore || !jobSummariesInStore.value) {
      throw new Error(UNABLE_TO_UPDATE_JOB_SUMMARY)
    }
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
    jobSummariesInStore.value.forEach(jobSummaryObject => {
      jobSummaryObject.updatedTime = currentDate
      if (statusCountMap[jobSummaryObject.jobStatusId]) { // check for jobStatusId in statusCount map
        jobSummaryObject.count = statusCountMap[jobSummaryObject.jobStatusId]
      } else if (jobSummaryObject.count > 0) { //check for jobSummaryObject count greater than 0 whose jobStatusId is not in map of statusCountMap 
        jobSummaryObject.count = 0
      }
    })
    await keyValueDBService.validateAndSaveData(JOB_SUMMARY, jobSummariesInStore.value) // update jobSummary  in store
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
