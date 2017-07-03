import {
  jobSummaryService
} from '../classes/JobSummary'

import {
  keyValueDBService
} from '../classes/KeyValueDBService'

describe('test job summary services', () => {
  it('should not get job summary', () => {
    try {
      const jobMasterId = 930,
        statusId = 4814
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue(null)
      jobSummaryService.getJobSummaryData(jobMasterId, statusId)
    } catch (error) {
      expect(error.message).toEqual('Value of JobSummary missing')
    }
  })

  it('should get job summary from job master id and status id', () => {
    const jobMasterId = 930,
      statusId = 4814
    const jobSummaryData = {
      id: 2284604,
      userId: 4954,
      hubId: 2757,
      cityId: 744,
      companyId: 295,
      date: "2017-07-02 00:00:00",
      jobMasterId: 930,
      jobStatusId: 4814,
      count: 0
    }
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: [{
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        date: "2017-07-02 00:00:00",
        jobMasterId: 930,
        jobStatusId: 4814,
        count: 0
      }, {
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        date: "2017-07-02 00:00:00",
        jobMasterId: 897,
        jobStatusId: 4854,
        count: 0
      }]
    })
    return jobSummaryService.getJobSummaryData(jobMasterId, statusId).then(data => {
      expect(data).toEqual(jobSummaryData)
    })
  })

  it('should not update job summary', () => {
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue(null)
      jobSummaryService.updateJobSummary()
    } catch (error) {
      expect(error.message).toEqual('Unable to update Job Summary')
    }
  })

  it('should update job summary in store', () => {
    const jobSummary = [{
      id: 2284604,
      userId: 4954,
      hubId: 2757,
      cityId: 744,
      companyId: 295,
      date: "2017-07-02 00:00:00",
      jobMasterId: 930,
      jobStatusId: 4814,
      count: 0
    }]
     keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce({
      value: [{
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        date: "2017-07-02 00:00:00",
        jobMasterId: 930,
        jobStatusId: 4814,
        count: 0
      }, {
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        date: "2017-07-02 00:00:00",
        jobMasterId: 897,
        jobStatusId: 4854,
        count: 0
      }]
    })
    keyValueDBService.validateAndUpdateData = jest.fn()
    keyValueDBService.validateAndUpdateData.mockReturnValue(null)
    return jobSummaryService.updateJobSummary(jobSummary)
      .then(() => {
        expect(keyValueDBService.validateAndUpdateData).toHaveBeenCalledTimes(1)
      })
  })
})
