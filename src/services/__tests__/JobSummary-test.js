import {
  jobSummaryService
} from '../classes/JobSummary'

import {
  keyValueDBService
} from '../classes/KeyValueDBService'
import moment from 'moment'
describe('test for jobSummary Data on Last Sync', () => {
  it('should get job summary data', () => {
    try {
      const jobMasterId = 930,
        statusId = 4814
      const lastSyncTime = { value: '2018-07-01 12:12:12' }
      const updatedJobSummaryData = [{
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        jobMasterId: 930,
        jobStatusId: 4814,
        count: 0
      }, {
        id: 2284604,
        userId: 4954,
        hubId: 2757,
        cityId: 744,
        companyId: 295,
        jobMasterId: 897,
        jobStatusId: 4854,
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
          updatedTime: "2018-07-02 00:00:00",
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
      })
      return jobSummaryService.getJobSummaryDataOnLastSync(lastSyncTime).then(data => {
        expect(data).toEqual(updatedJobSummaryData)
      })
    } catch (error) {
      expect(error.message).toEqual('Value of JobSummary missing')
    }
  })

  it('should get not job summary data on Last Sync', () => {
    const jobMasterId = 930,
      statusId = 4814
    const jobSummaryData = []
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
    return jobSummaryService.getJobSummaryDataOnLastSync().then(data => {
      expect(data).toEqual(jobSummaryData)
    })
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
      4854: 3
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
          count: 0
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
