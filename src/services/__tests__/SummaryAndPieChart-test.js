'use strict'

import { summaryAndPieChartService } from '../classes/SummaryAndPieChart'
import { jobTransactionService } from '../classes/JobTransaction'
import { jobMasterService } from '../classes/JobMaster'
import { jobStatusService } from '../classes/JobStatus'
import moment from 'moment'
import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from '../classes/KeyValueDBService'

describe('test cases getTransaction for piechart and summary', () => { //idDtoMap(dtoList)
  let allPendingFailSuccessIds = [1, 2, 3, 4, 5, 6]
  let jobMasterList = [1,2]
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
    jobStatusId: 1,
    runsheetId: 1,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 2,
    runsheetId: 2,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 1,
    runsheetId: 3,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 3,
    runsheetId: 4,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },

  ]

  it('should get transaction list for piechart', () => {
    realm.getRecordListOnQuery = jest.fn()
    realm.getRecordListOnQuery.mockReturnValueOnce(runsheetList)
    realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactionList)
    expect(summaryAndPieChartService.getTransactionsForPieChartAndSummary(allPendingFailSuccessIds, jobMasterList)).toEqual(jobTransactionList)
  })
})

describe('test cases for build jobMaster Summary list', () => { //idDtoMap(dtoList)
  let dtoList = [1, 2, 3, 4, 5, 6]
  let jobStatusIdCountMap = { "1": 0, "2": 1, "3": 1, "4": 0 }
  const jobMasterSummaryList = {
    '441':
      {
        '1': { count: 0, list: [] },
        '2': { count: 0, list: [] },
        '3': { count: 0, list: [] },
        id: 441,
        code: undefined,
        cashCollected: 0,
        cashCollectedByCard: 0,
        cashPayment: 0,
        identifierColor: undefined,
        title: undefined,
        count: 0
      },
    '442':
      {
        '1': { count: 0, list: [] },
        '2': { count: 0, list: [] },
        '3': { count: 0, list: [] },
        id: 442,
        code: undefined,
        cashCollected: 0,
        cashCollectedByCard: 0,
        cashPayment: 0,
        identifierColor: undefined,
        title: undefined,
        count: 0
      }
  }
  const jobStatusList = [{
    id: 1,
    jobMasterId: 441,
    statusCategory: 1,
    code: 'PENDING',
    name: 'Unseen'
  }, {
    id: 2,
    jobMasterId: 441,
    statusCategory: 1,
    code: 'PENDING',
    name: 'Pending',
  },
  ]
  let listMap = [{
    "1": {
      "count": 1,
      "list": [{ "count": 0, "id": 1, "name": "Unseen" },
      { "count": 1, "id": 2, "name": "Pending" }]
    },
    "2": { "count": 0, "list": [] }, "3": { "count": 0, "list": [] },
    "cashCollected": 0,
    "cashCollectedByCard": 0,
    "cashPayment": 0,
    "code": undefined,
    "count": 1, "id": 441,
    "identifierColor": undefined,
    "title": undefined
  },
  {
    "1": { "count": 0, "list": [] },
    "2": { "count": 0, "list": [] },
    "3": { "count": 0, "list": [] },
    "cashCollected": 0,
    "cashCollectedByCard": 0,
    "cashPayment": 0,
    "code": undefined,
    "count": 0,
    "id": 442,
    "identifierColor": undefined,
    "title": undefined
  }]

  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 1,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 12,
    runsheetId: 2,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 14,
    runsheetId: 3,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 13,
    runsheetId: 4,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },

  ]

  it('should build jobMaster Summary List', () => {
    expect(summaryAndPieChartService.buildJobMasterSummaryList(jobStatusList, jobMasterSummaryList, jobStatusIdCountMap)).toEqual(listMap)
  })
})
describe('set All count for pieChart', () => {  // setAllCounts(allTransactions,pendingStatusIds,successStatusIds,failStatusIds)

  beforeEach(() => {
    keyValueDBService.getValueFromStore = jest.fn()
    keyValueDBService.validateAndUpdateData = jest.fn()
    summaryAndPieChartService.idDtoMap = jest.fn()
  })
  const count = { pendingCounts: 0, successCounts: 0, failCounts: 0 }
  const pendingStatusIds = [11, 12]
  const failStatusIds = [13, 14]
  const successStatusIds = [15, 16]
  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 1,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 12,
    runsheetId: 2,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 14,
    runsheetId: 3,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 13,
    runsheetId: 4,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },

  ]
  let userSummary = {
    value: {
      hubId: 24629,
      id: 233438,
      lastBattery: 54,
      lastCashCollected: 0,
      lastLat: 28.5555772,
      lastLng: 77.2675903,
    }
  }
  const pendingMap = {
    "11": 1,
    "12": 1
  }
  const successMap = {
    "13": 1,
    "14": 1
  }
  const failMap = {
    "15": 1,
    "16": 1
  }
   

  it('should set all count for piechart of user', () => {
    keyValueDBService.getValueFromStore.mockReturnValueOnce(userSummary)
    summaryAndPieChartService.idDtoMap.mockReturnValueOnce(pendingMap)
      .mockReturnValueOnce(failMap)
      .mockReturnValueOnce(successMap)
    expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(0)
    expect(summaryAndPieChartService.idDtoMap).toHaveBeenCalledTimes(0)
    expect(keyValueDBService.validateAndUpdateData).toHaveBeenCalledTimes(0)
    expect(summaryAndPieChartService.setAllCounts(jobTransactionList, pendingStatusIds, successStatusIds, failStatusIds)).toEqual(count)
  })
})

describe('test cases for create status count map on transactions', () => { //getAllRunSheetSummary()
  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 1,
    runsheetId: 1,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 2,
    runsheetId: 2,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 1,
    runsheetId: 3,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 3,
    runsheetId: 4,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },

  ]
  const jobMasterSummaryList = {
    '441':
      {
        '1': { count: 0, list: [] },
        '2': { count: 0, list: [] },
        '3': { count: 0, list: [] },
        id: 441,
        code: undefined,
        cashCollected: 0,
        cashCollectedByCard: 0,
        cashPayment: 0,
        identifierColor: undefined,
        title: undefined,
        count: 0
      },
    '442':
      {
        '1': { count: 0, list: [] },
        '2': { count: 0, list: [] },
        '3': { count: 0, list: [] },
        id: 442,
        code: undefined,
        cashCollected: 0,
        cashCollectedByCard: 0,
        cashPayment: 0,
        identifierColor: undefined,
        title: undefined,
        count: 0
      }
  }
  const jobSummaryList = [
    { jobStatusId: 1 },
    { jobStatusId: 2 },
    { jobStatusId: 3 },
    { jobStatusId: 4 }]
  const noNextStatusMap = [1, 3, 8, 12]
  let data = { "1": 0, "2": 1, "3": 1, "4": 0 }
  it('should create count map of status', () => {
    expect(summaryAndPieChartService.createJobStatusCountMap(jobTransactionList, noNextStatusMap, jobSummaryList, jobMasterSummaryList)).toEqual(data)
  })
})

describe('PieChart service', () => {  // getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds, noNextStatusIds)

  beforeEach(() => {
    realm.getRecordListOnQuery = jest.fn()
    summaryAndPieChartService.getTransactionsForPieChartAndSummary = jest.fn()
    jobStatusService.getStatusIdsForAllStatusCategory = jest.fn()
    summaryAndPieChartService.isTodaysDateTransactions = jest.fn()
    summaryAndPieChartService.setAllCounts = jest.fn()
    jobMasterService.getJobMasterIdList = jest.fn()
  })
  const count = { pendingCounts: 2, successCounts: 2, failCounts: 2 }
  const allPendingSuccessFailIds = [12, 13, 14, 15, 16, 17]
  const allStatusMap = {
    11: 1,
    12: 1,
    13: 2,
    14: 3,
    15: 3
  }
  const noNextStatusMap = {
    16: true,
    17: true
  }
  const jobMasterList = [3,4,5,6]

  const allTodayJobTransactions = [{
    id: 1,
    jobStatusId: 12
  }, {
    id: 2,
    jobStatusId: 13
  }]

  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 1,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 12,
    runsheetId: 2,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 11,
    runsheetId: 3,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 13,
    runsheetId: 4,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },

  ]

  it('should get all count for piechart of user', () => {
    let countData = {"failCounts": 2, "pendingCounts": 2, "successCounts": 2};
    jobStatusService.getStatusIdsForAllStatusCategory.mockReturnValueOnce({ allStatusMap, noNextStatusMap })
    jobMasterService.getJobMasterIdList.mockReturnValueOnce(jobMasterList)
    summaryAndPieChartService.getTransactionsForPieChartAndSummary.mockReturnValueOnce(jobTransactionList)
    summaryAndPieChartService.isTodaysDateTransactions.mockReturnValueOnce(allTodayJobTransactions)
    summaryAndPieChartService.setAllCounts.mockReturnValueOnce(countData)
    return summaryAndPieChartService.getAllStatusIdsCount()
      .then((count) => {
        expect(jobStatusService.getStatusIdsForAllStatusCategory).toHaveBeenCalledTimes(1)
        expect(summaryAndPieChartService.isTodaysDateTransactions).toHaveBeenCalledTimes(1)
        expect(summaryAndPieChartService.setAllCounts).toHaveBeenCalledTimes(1)
        expect(count).toEqual(countData)
      })
  })

  it('should get all count for piechart of user of selected jobMaster', () => {
    let countData = {"failCounts": 2, "pendingCounts": 2, "successCounts": 2};
    jobStatusService.getStatusIdsForAllStatusCategory.mockReturnValueOnce({ allStatusMap, noNextStatusMap })
    summaryAndPieChartService.getTransactionsForPieChartAndSummary.mockReturnValueOnce(jobTransactionList)
    summaryAndPieChartService.isTodaysDateTransactions.mockReturnValueOnce(allTodayJobTransactions)
    summaryAndPieChartService.setAllCounts.mockReturnValueOnce(count)
    return summaryAndPieChartService.getAllStatusIdsCount(jobMasterList)
      .then((count) => {
        expect(jobStatusService.getStatusIdsForAllStatusCategory).toHaveBeenCalledTimes(1)
        expect(summaryAndPieChartService.isTodaysDateTransactions).toHaveBeenCalledTimes(1)
        expect(summaryAndPieChartService.setAllCounts).toHaveBeenCalledTimes(1)
        expect(count).toEqual(countData)
      })
  })
})


describe('test cases for set all jobMaster Summary', () => { //setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList,pendingStatusIds,noNextStatusIds)
  beforeEach(() => {
    summaryAndPieChartService.getTransactionsForPieChartAndSummary = jest.fn()
    // summaryAndPieChartService.createJobStatusCountMap = jest.fn()
    // summaryAndPieChartService.buildJobMasterSummaryList = jest.fn()
  })
  const angle = "28.2554334", radianValue = 0.493150344407976
  let jobTransaction = {
    id: 3447,
    latitude: 28.55542,
    longitude: 77.267463
  }
  const jobMasterList = [
    {
      id: 441,
      enableLocationMismatch: false,
      enableManualBroadcast: false,
      enableMultipartAssignment: false,
      enableOutForDelivery: false,
      enableResequenceRestriction: true
    },
    {
      id: 442,
      enableLocationMismatch: false,
      enableManualBroadcast: false,
      enableMultipartAssignment: false,
      enableOutForDelivery: false,
      enableResequenceRestriction: false
    }
  ]
  const pendingStatusIds = [1, 2, 5, 6]
  const noNextStatusIds = [3, 4, 7, 8]
  const jobSummaryList = [
    { jobStatusId: 1 },
    { jobStatusId: 2 },
    { jobStatusId: 3 },
    { jobStatusId: 4 }]
  const jobStatusList = [{
    id: 1,
    jobMasterId: 441,
    statusCategory: 1,
    code: 'PENDING',
    name: 'Unseen'
  }, {
    id: 2,
    jobMasterId: 441,
    statusCategory: 1,
    code: 'PENDING',
    name: 'Pending',
  },
  ]
  let jobMasterSummaryList = [
    {
      "1":
        {
          "count": 1,
          "list": [{
            "count": 0,
            "id": 1,
            "name": "Unseen"
          }, {
            "count": 1,
            "id": 2,
            "name": "Pending"
          }
          ]
        }, "2": {
          "count": 0,
          "list": []
        },
      "3": {
        "count": 0,
        "list": []
      },
      "cashCollected": 0,
      "cashCollectedByCard": 0,
      "cashPayment": 0,
      "code": undefined,
      "count": 1,
      "id": 441,
      "identifierColor": undefined,
      "title": undefined
    },
    {
      "1": {
        "count": 0,
        "list": []
      },
      "2": {
        "count": 0,
        "list": []
      },
      "3": {
        "count": 0,
        "list": []
      },
      "cashCollected": 0,
      "cashCollectedByCard": 0,
      "cashPayment": 0,
      "code": undefined,
      "count": 0,
      "id": 442,
      "identifierColor": undefined,
      "title": undefined
    }]


  const jobTransactionList = [{
    id: 2521299,
    jobMasterId: 3,
    jobStatusId: 1,
    runsheetId: 1,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 2,
    runsheetId: 2,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 1,
    runsheetId: 3,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 3,
    runsheetId: 4,
    lastUpdatedAtServer: moment().format('YYYY-MM-DD'),
  },

  ]
  let data = { "1": 0, "2": 1, "3": 1, "4": 0 }
  let listMap = [{
    "1": {
      "count": 1,
      "list": [{ "count": 0, "id": 1, "name": "Unseen" },
      { "count": 1, "id": 2, "name": "Pending" }]
    },
    "2": { "count": 0, "list": [] }, "3": { "count": 0, "list": [] },
    "cashCollected": 0,
    "cashCollectedByCard": 0,
    "cashPayment": 0,
    "code": undefined,
    "count": 1, "id": 441,
    "identifierColor": undefined,
    "title": undefined
  },
  {
    "1": { "count": 0, "list": [] },
    "2": { "count": 0, "list": [] },
    "3": { "count": 0, "list": [] },
    "cashCollected": 0,
    "cashCollectedByCard": 0,
    "cashPayment": 0,
    "code": undefined,
    "count": 0,
    "id": 442,
    "identifierColor": undefined,
    "title": undefined
  }]

  it('should set all data for jobMaster Summary of User', () => {
    realm.getRecordListOnQuery = jest.fn()
    summaryAndPieChartService.getTransactionsForPieChartAndSummary.mockReturnValue(jobTransactionList)
    // summaryAndPieChartService.createJobStatusCountMap.mockReturnValueOnce(data)
    // summaryAndPieChartService.buildJobMasterSummaryList.mockReturnValueOnce(listMap)
    expect(summaryAndPieChartService.setAllJobMasterSummary(jobMasterList, jobStatusList, jobSummaryList, pendingStatusIds, noNextStatusIds)).toEqual(jobMasterSummaryList)
  })
})



describe('test cases for check today date transaction', () => { //isTodaysDateTransactions(jobTransactions,pendingStatusIds,noNextStatusIds)
  const jobTransactionList = [{
    jobStatusId: 1,
    runsheetId: 1,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521219,
    jobMasterId: 4,
    jobStatusId: 2,
    runsheetId: 2,
    lastUpdatedAtServer: new Date(),
  },
  {
    id: 2521229,
    jobMasterId: 3,
    jobStatusId: 13,
    runsheetId: 3,
    lastUpdatedAtServer: '2018-12-10 12:12:12',
  },
  {
    id: 2521239,
    jobMasterId: 3,
    jobStatusId: 3,
    runsheetId: 4,
    lastUpdatedAtServer: new Date(),
  },

  ]
  const noNextMap = {
    "1": 1,
    "14": 1
  }
  let data = [{"id": 1, "jobStatusId": 12}, {"id": 2, "jobStatusId": 13}]

  it('should get all today job transaction ', () => {
    expect(summaryAndPieChartService.isTodaysDateTransactions(jobTransactionList, noNextMap)).toEqual(undefined)
  })
})


describe('test cases for get all runsheet Summary', () => { //getAllRunSheetSummary()
  let data = [["1", 2, 0, 0, undefined], ["2", 1, 0, 0, undefined]]
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
  it('should set all runSheet summary', () => {
    realm.getRecordListOnQuery = jest.fn()
    realm.getRecordListOnQuery.mockReturnValueOnce(runsheetList)
    expect(summaryAndPieChartService.getAllRunSheetSummary()).toEqual(data)
  })
})

