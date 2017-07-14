const {
  JOB_STATUS
} = require('../../lib/constants').default

import {
  keyValueDBService
} from '../classes/KeyValueDBService'

import {
  jobStatusService
} from '../classes/JobStatus'

import _ from 'underscore'

describe('job status services ', () => {

  it('should fetch job status ids from store ', () => {
    const jobStatusIds = [12],
      statusCode = 'UNSEEN'
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: [{
        id: 12,
        code: 'UNSEEN'
      }, {
        id: 13,
        code: 'PENDING'
      }]
    })
    return jobStatusService.getAllIdsForCode(statusCode).then(data => {
      expect(data).toEqual(jobStatusIds)
    })
  })

  // it('should not fetch jobStatus ids',() => {
  //   const statusCode = 'UNSEEN'
  //   const message = 'Job status missing in store'
  //   keyValueDBService.getValueFromStore = jest.fn()
  //    keyValueDBService.getValueFromStore.mockReturnValue(null)
  //   try{
  //   return jobStatusService.getAllIdsForCode(statusCode).then(data => {
  //     expect(data).toEqual(message)
  //   })
  //   }catch(errror){
      
  //   }
  // })

  it('should get statusId on basis of job master and a code', () => {
    const jobStatusId = 12,
      statusCode = 'UNSEEN',
      jobMasterId = 930
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: [{
        id: 12,
        code: 'UNSEEN',
        jobMasterId: 930
      }, {
        id: 13,
        code: 'PENDING',
        jobMasterId: 930
      }]
    })
    return jobStatusService.getStatusIdForJobMasterIdAndCode(jobMasterId, statusCode).then(data => {
      expect(data).toEqual(jobStatusId)
    })
  })
})

// it('should not get status id', () => {
//   const jobStatusId = 12,
//     statusCode = 'UNSEEN',
//     jobMasterId = 930
//   keyValueDBService.getValueFromStore = jest.fn()
//   keyValueDBService.getValueFromStore.mockReturnValue(null)
//   expect(jobStatusService.getStatusIdForJobMasterIdAndCode(jobMasterId, statusCode)).toThrow('Job status missing in store')
// })

it('should return jobMasterId vs jobStatusIdMap', () => {
  const jobMasterIdJobStatusIdMap = {
      930: 12,
      897: 14
    },
    statusCode = 'UNSEEN',
    jobMasterIdList = [930, 897]
  keyValueDBService.getValueFromStore = jest.fn()
  keyValueDBService.getValueFromStore.mockReturnValueOnce({
    value: [{
      id: 12,
      code: 'UNSEEN',
      jobMasterId: 930
    }, {
      id: 13,
      code: 'PENDING',
      jobMasterId: 930
    }, {
      id: 14,
      code: 'UNSEEN',
      jobMasterId: 897
    }]
  })
  return jobStatusService.getjobMasterIdStatusIdMap(jobMasterIdList, statusCode).then(data => {
    expect(data).toEqual(jobMasterIdJobStatusIdMap)
  })
})
