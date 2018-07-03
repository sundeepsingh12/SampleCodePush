import { jobStatusService } from '../classes/JobStatus'
import { jobSummaryService } from '../classes/JobSummary'
import { keyValueDBService } from '../classes/KeyValueDBService'
import { userSummaryService } from '../classes/UserSummary';
import * as realm from '../../repositories/realmdb'
import { RUNSHEET_MISSING } from '../../lib/ContainerConstants'
import { runSheetService } from '../classes/RunSheet'
import JobTransaction from '../../repositories/schema/jobTransaction';


describe('test for build runsheetList and update user and job summary', () => {

  jobSummaryService.updateJobSummary = jest.fn()
  realm.getRecordListOnQuery = jest.fn()
  userSummaryService.updateUserSummaryCount = jest.fn()
  const count = { pendingCounts: 2, successCounts: 2, failCounts: 2 }
  const allStatusMap = { "12": 1, "13": 1, "14": 2, "15": 3 }
  const noNextStatusMap = { "15": 3, "16": 3 }
  const allTodayJobTransactions = [{
    id: 1,
    jobStatusId: 12
  }, {
    id: 2,
    jobStatusId: 13
  },
  {
    id: 3,
    jobStatusId: 14
  },
  {
    id: 4,
    jobStatusId: 15
  }
  ]

  const runsheetList = [
    {
      id: 1,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "1",
      pendingCount: 0,
      successCount: 0,
      failCount: 0
    },
    {
      id: 2,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "2",
      pendingCount: 0,
      successCount: 0,
      failCount: 0
    },
  ]

  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 12,
    runsheetId: 1,
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 13,
    runsheetId: 2,
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 12,
    runsheetId: 1,
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 15,
    runsheetId: 2,
  },]

  it('should get runSheetList', () => {
    const jobMasterId = 930,
      statusId = 4814
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
    realm.getRecordListOnQuery.mockReturnValueOnce(runsheetList)
    runSheetService.buildRunSheetListAndUpdateJobAndUserSummary(jobTransactionList, allStatusMap).then((data) => {
      expect(data).toEqual(runsheetList)
      expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
    })
  })
})



describe('test case for update runsheet db', () => {  // getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds, noNextStatusIds)

  beforeEach(() => {
    keyValueDBService.getValueFromStore = jest.fn()
    realm.getRecordListOnQuery = jest.fn()
    jobStatusService.getStatusIdsForAllStatusCategory = jest.fn()
    runSheetService.buildRunSheetListAndUpdateJobAndUserSummary = jest.fn()
    realm.performBatchSave = jest.fn()
  })
  const jobMasterList = {
    value: [{
      id: 1
    },
    {
      id: 2
    }]
  }
  const count = { pendingCounts: 2, successCounts: 2, failCounts: 2 }
  const allStatusMap = { "12": 1, "13": 1, "14": 2 }
  const noNextStatusMap = { "15": 3, "16": 3 }
  const allTodayJobTransactions = [{
    id: 1,
    jobStatusId: 12
  }, {
    id: 2,
    jobStatusId: 13
  }]

  const runsheetList = [
    {
      id: 2260,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "1",
      pendingCount: 0,
      successCount: 2,
      failCount: 0
    },
    {
      id: 2261,
      userId: 4957,
      hubId: 2759,
      runsheetNumber: "2",
      pendingCount: 0,
      successCount: 1,
      failCount: 0
    },
  ]

  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 1,
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 12,
    runsheetId: 2,
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 3,
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 13,
    runsheetId: 4,
  },
  ]

  it('should update runsheet db', () => {
    keyValueDBService.getValueFromStore.mockReturnValueOnce(jobMasterList)
    realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactionList)
    jobStatusService.getStatusIdsForAllStatusCategory.mockReturnValueOnce({ allStatusMap })
    runSheetService.buildRunSheetListAndUpdateJobAndUserSummary.mockReturnValueOnce(runsheetList)
    return runSheetService.updateRunSheetUserAndJobSummary()
      .then((count) => {
        expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(2)
        expect(jobStatusService.getStatusIdsForAllStatusCategory).toHaveBeenCalledTimes(1)
        expect(runSheetService.buildRunSheetListAndUpdateJobAndUserSummary).toHaveBeenCalledTimes(1)
      })
  })
})

describe('test cases for getRunsheets', () => {
  it('should return list of runsheet', () => {
    realm.getRecordListOnQuery = jest.fn()
    realm.getRecordListOnQuery.mockReturnValue([{ runsheetNumber: 123 }])
    expect(runSheetService.getRunsheets()).toEqual([123])
  })

  it('should throw runsheet missing error', () => {
    const message = RUNSHEET_MISSING
    try {
      realm.getRecordListOnQuery = jest.fn()
      realm.getRecordListOnQuery.mockReturnValue([])
      runSheetService.getRunsheets()
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })
})



describe('test cases for getOpenRunsheets', () => {
  it('should return list of open runsheet', () => {
    realm.getRecordListOnQuery = jest.fn()
    realm.getRecordListOnQuery.mockReturnValue([{ runsheetNumber: 123 }])
    expect(runSheetService.getOpenRunsheets()).toEqual([{ runsheetNumber: 123 }])
  })
})

describe('test cases for filterTransactionOnRunsheetIdPresentAndPrepareTransactionQuery', () => {
  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 1,
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 12,
    runsheetId: 2,
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 3,
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 13,
    runsheetId: 4,
  },
  ]
  it('should filter Transaction On RunsheetId Present And PrepareTransaction Query', () => {
    let data = {
      "jobTransactionListWithRunsheetId":
        [{ "id": 2521299, "jobMasterId": 3, "jobStatusId": 11, "runsheetId": 1 },
        { "id": 2521219, "jobMasterId": 4, "jobStatusId": 12, "runsheetId": 2 },
        { "id": 2521229, "jobMasterId": 3, "jobStatusId": 11, "runsheetId": 3 },
        { "id": 2521239, "jobMasterId": 3, "jobStatusId": 13, "runsheetId": 4 }],
      "jobTransactionListWithRunsheetIdQuery": "id = 2521299 OR id = 2521219 OR id = 2521229 OR id = 2521239"
    }
    expect(runSheetService.filterTransactionOnRunsheetIdPresentAndPrepareTransactionQuery(jobTransactionList)).toEqual(data)
  })
})