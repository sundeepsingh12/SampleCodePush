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
import {
UNABLE_TO_UPDATE_JOB_SUMMARY,
VALUE_OF_JOBSUMMARY_IS_MISSING,
} from '../../lib/ContainerConstants'

class JobSummary {

  /**
   * 
   * @param {*} jobSummaries 
   */
  async updateJobSummary(jobSummaries) {
    if(_.isUndefined(jobSummaries) || _.isNull(jobSummaries) || _.isEmpty(jobSummaries)) {
      return
    }
    const jobSummariesInStore = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    if(!jobSummariesInStore || !jobSummariesInStore.value){
      throw new Error(UNABLE_TO_UPDATE_JOB_SUMMARY)
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
    if(!alljobSummaryList || !alljobSummaryList.value){
      throw new Error(VALUE_OF_JOBSUMMARY_IS_MISSING)
    }
    const filteredJobSummaryList = await alljobSummaryList.value.filter(jobSummaryObject => (jobSummaryObject.jobStatusId == statusId && jobSummaryObject.jobMasterId == jobMasterId))
    return filteredJobSummaryList[0]
  }

  async getJobSummaryDataOnLastSync(lastSyncTime) {
    const alljobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
    let filteredJobSummaryList = []
    if(!alljobSummaryList || !alljobSummaryList.value){
      return filteredJobSummaryList
      // throw new Error(VALUE_OF_JOBSUMMARY_IS_MISSING)
    }
    for(let index of alljobSummaryList.value){
      if(moment(index.updatedTime).isAfter(lastSyncTime.value)){
        delete index.updatedTime 
        filteredJobSummaryList.push(index)       
      }
    }    
    return filteredJobSummaryList
  }

  // async getJobSummariesForJobMasterAndStatus(jobMasterIdStatusIdMap){
  //    const jobSummaries = []
  //   const alljobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
  //   if(!alljobSummaryList || !alljobSummaryList.value){
  //     throw new Error(VALUE_OF_JOBSUMMARY_IS_MISSING)
  //   }
  //    for (let jobMasterId in jobMasterIdStatusIdMap) {
  //         const filteredJobSummaryList =  alljobSummaryList.value.filter(jobSummaryObject => (jobSummaryObject.jobStatusId == jobMasterIdStatusIdMap[jobMasterId] && jobSummaryObject.jobMasterId == jobMasterId))
  //         filteredJobSummaryList.count = jobMasterIdStatusIdMap[jobMasterId].split(":")[1]
  //         jobSummaries.push(filteredJobSummaryList[0])
  //  }
  //  return jobSummaries
  // }
}

export let jobSummaryService = new JobSummary()
