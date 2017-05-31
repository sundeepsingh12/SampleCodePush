const {
  JOB_STATUS
} = require('../../lib/constants').default

import {
  keyValueDBService
} from './KeyValueDBService'

class JobStatus {

  async getAllUnseenIds() {
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
    const unseenJobStatusIds = jobStatusArray.value.filter(jobStatusObject => jobStatusObject.code == 'UNSEEN')
      .map(unseenJobStatusObject => unseenJobStatusObject.id)
    return unseenJobStatusIds
  }

  async getStatusIdForJobMasterIdAndCode(jobMasterId,code){
    const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
   const jobStatusId = jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == 'UNSEEN' && jobStatusObject.jobMasterId==jobMasterId))
      .map(jobStatusObject => jobStatusObject.id)
      return jobStatusId
  }
}

export let jobStatusService = new JobStatus()
