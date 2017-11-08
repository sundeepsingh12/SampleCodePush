import {
  JOB_SUMMARY
} from '../../lib/constants'

import {
  keyValueDBService
} from './KeyValueDBService'

import _ from 'underscore'

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
      throw new Error('Unable to update Job Summary')
    }
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
      throw new Error('Value of JobSummary missing')
    }
    const filteredJobSummaryList = await alljobSummaryList.value.filter(jobSummaryObject => (jobSummaryObject.jobStatusId == statusId && jobSummaryObject.jobMasterId == jobMasterId))
    return filteredJobSummaryList[0]
  }

  // async getJobSummariesForJobMasterAndStatus(jobMasterIdStatusIdMap){
  //    const jobSummaries = []
  //   const alljobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY)
  //   if(!alljobSummaryList || !alljobSummaryList.value){
  //     throw new Error('Value of JobSummary missing')
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
