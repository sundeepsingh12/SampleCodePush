import {
  jobSummaryService
} from '../classes/JobSummary'

import {
  keyValueDBService
} from '../classes/KeyValueDBService'
import moment from 'moment'
describe('test for jobSummary Data on Last Sync', () => {
  it('should get job summary data', () => {
    const updatedJobSummaryData = [{
      id: 2284604,
      userId: 4954,
      hubId: 2757,
      cityId: 744,
      companyId: 295,
      jobMasterId: 930,
      jobStatusId: 4814,
      count: 0
    }]
    let jobSummaryListValue = {
      value: [{
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        updatedTime: "2018-07-02 00:00:20",
        jobMasterId: 930,
        jobStatusId: 4814,
        count: 0
      }, {
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        updatedTime: "2018-07-02 00:00:00",
        jobMasterId: 897,
        jobStatusId: 4854,
        count: 0
      }]
    }
    let lastSyncTime = '2018-07-02 00:00:00'
    expect(jobSummaryService.getJobSummaryListForSync(jobSummaryListValue.value, lastSyncTime)).toEqual(updatedJobSummaryData)
  })

  it('should get not job summary data on Last Sync', () => {
    const jobMasterId = 930,
      statusId = 4814
    const jobSummaryData = []
    let jobSummaryList = null
    let lastSyncTime = '2018-07-02 00:00:00'
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
    expect(jobSummaryService.getJobSummaryListForSync(jobSummaryList, lastSyncTime)).toEqual(jobSummaryData)
  })
})


describe('test for update JobSUmmary In Store', () => {

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
    const statusCountMap = {
      4814: 2,
    }
    const currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.validateAndSaveData = jest.fn()
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
          count: 1
        }]
      })
      const updatedJobSummaryData = {
        value: [{
          id: 2284604,
          userId: 4954,
          hubId: 2757,
          cityId: 744,
          companyId: 295,
          date: "2017-07-02 00:00:00",
          jobMasterId: 930,
          jobStatusId: 4814,
          count: 2
        }, {
          id: 2284604,
          userId: 4954,
          hubId: 2757,
          cityId: 744,
          companyId: 295,
          date: "2017-07-02 00:00:00",
          jobMasterId: 897,
          jobStatusId: 4854,
          count: 3
        }]
      }
      return jobSummaryService.updateJobSummary(statusCountMap).then(data => {
        expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
        expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
      })
    } catch (error) {
      expect(error.message).toEqual('JOB_SUMMARY validation failed')
    }

  })
})


describe('test for map of statusId and jobSummary', () => {
  it('should get map of statusId and job summary data', () => {
    const updatedJobSummaryData = {
      "4814": {
        "cityId": 744,
        "companyId": 295,
        "count": 0,
        "hubId": 2757,
        "id": 2284604,
        "jobMasterId": 930,
        "jobStatusId": 4814,
        "updatedTime": "2018-07-02 00:00:20",
        "userId": 4954
      },
      "4853": {
        "cityId": 744,
        "companyId": 295,
        "count": 1,
        "hubId": 2757,
        "id": 2284605,
        "jobMasterId": 897,
        "jobStatusId": 4853,
        "updatedTime": "2018-07-02 00:00:00",
        "userId": 4954
      },
      "4854": {
        "cityId": 744,
        "companyId": 295, "count": 2,
        "hubId": 2757,
        "id": 2284606,
        "jobMasterId": 897,
        "jobStatusId": 4854,
        "updatedTime": "2018-07-02 00:00:00",
        "userId": 4954
      }
    }

    let jobSummaryListValue = [{
      id: 2284604,
      userId: 4954,
      hubId: 2757,
      cityId: 744,
      companyId: 295,
      updatedTime: "2018-07-02 00:00:20",
      jobMasterId: 930,
      jobStatusId: 4814,
      count: 0
    }, {
      id: 2284605,
      userId: 4954,
      hubId: 2757,
      cityId: 744,
      companyId: 295,
      updatedTime: "2018-07-02 00:00:00",
      jobMasterId: 897,
      jobStatusId: 4853,
      count: 1
    }, {
      id: 2284606,
      userId: 4954,
      hubId: 2757,
      cityId: 744,
      companyId: 295,
      updatedTime: "2018-07-02 00:00:00",
      jobMasterId: 897,
      jobStatusId: 4854,
      count: 2
    }
    ]
    expect(jobSummaryService.getJobStatusIdJobSummaryMap(jobSummaryListValue)).toEqual(updatedJobSummaryData)
  })
})