const {
  JOB_STATUS
} = require('../../lib/constants').default

import {
  keyValueDBService
} from './KeyValueDBService'

import _ from 'underscore'

describe('job status services ',()=>{

  it('should fetch job status ids from store ',()=>{
     const store = mockStore({})
     const jobStatusIds = []
     const statusCode = 'UNSEEN'
     keyValueDBService.getValueFromStore = jest.fn()
       keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: [{id:12,code:'UNSEEN'}]})
        expect(getAllIdsForCode(statusCode)).toEqual()
  })

})
  // async getAllIdsForCode(statusCode) {
  //   const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
  //   const jobStatusIds = await jobStatusArray.value.filter(jobStatusObject => jobStatusObject.code == statusCode)
  //     .map(jobStatusObject => jobStatusObject.id)
  //   return jobStatusIds
  // }

  // /**Generic method for getting particular status id of a particular job master and job status code
  //  * 
  //  * @param {*} jobMasterId 
  //  * @param {*} code 
  //  */
  // async getStatusIdForJobMasterIdAndCode(jobMasterId, jobStatusCode) {
  //   const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
  //   const jobStatusId = await jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobStatusObject.jobMasterId == jobMasterId))
  //     .map(jobStatusObject => jobStatusObject.id)
  //   return jobStatusId[0]
  // }

  // /**
  //  * 
  //  * @param {*} jobMasterIdList 
  //  * @param {*} jobStatusCode 
  //  */
  // async getjobMasterIdStatusIdMap(jobMasterIdList, jobStatusCode) {
  //   let jobMasterIdStatusIdMap = {}
  //   const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)
  //   const filteredJobStatusArray = await jobStatusArray.value.filter(jobStatusObject => (jobStatusObject.code == jobStatusCode && jobMasterIdList.includes(jobStatusObject.jobMasterId)))
  //   filteredJobStatusArray.forEach(jobStatusObject => {
  //     jobMasterIdStatusIdMap[jobStatusObject.jobMasterId] = jobStatusObject.id
  //   })
  //   return jobMasterIdStatusIdMap
  // }


