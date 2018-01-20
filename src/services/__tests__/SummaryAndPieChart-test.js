'use strict'

import {summaryAndPieChartService} from '../classes/SummaryAndPieChart'
import { jobTransactionService } from '../classes/JobTransaction'
import moment from 'moment'
import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from '../classes/KeyValueDBService'


describe('PieChart service', () => {  // getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds, noNextStatusIds)

  beforeEach(() => {
    realm.getRecordListOnQuery = jest.fn()
    summaryAndPieChartService.isTodaysDateTransactions = jest.fn()
    summaryAndPieChartService.setAllCounts = jest.fn()
   })
    const count = { pendingCounts : 2 , successCounts : 2, failCounts : 2 }
    const pendingStatusIds = [12,13]
    const failStatusIds = [14,15]
    const successStatusIds = [16,17] 
    const noNextStatusIds = [18,19]
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
      realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactionList)
      summaryAndPieChartService.isTodaysDateTransactions.mockReturnValueOnce(allTodayJobTransactions)
      summaryAndPieChartService.setAllCounts.mockReturnValueOnce(count)
      return summaryAndPieChartService.getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds,noNextStatusIds)
          .then((count) =>{
              expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(2)
              expect(summaryAndPieChartService.isTodaysDateTransactions).toHaveBeenCalledTimes(1)
              expect(summaryAndPieChartService.setAllCounts).toHaveBeenCalledTimes(1)                
              expect(count).toEqual(count)                
          })
          // .catch((error) => {
          //     expect(error).toEqual(error)
          //     // expect(jobDetailsService.checkOutForDelivery).not.toHaveBeenCalled()
          // })
  })
})


describe('test cases for set all jobMaster Summary', () => { //setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList,pendingStatusIds,noNextStatusIds)
  const angle  = "28.2554334",radianValue = 0.493150344407976
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
  const pendingStatusIds = [1,2,5,6]
  const noNextStatusIds = [3,4,7,8]
  const jobSummaryList = [
    { jobStatusId: 1 },
    { jobStatusId: 2 },
    { jobStatusId: 3 },
    { jobStatusId: 4 }]
  const jobStatusList = [{
    id: 1,
    jobMasterId: 441,
    statusCategory : 1,
    code: 'PENDING',
    name: 'Unseen'
  }, {
    id: 2,
    jobMasterId: 441,
    statusCategory : 1,
    code: 'PENDING',
    name: 'Pending',
  },
]
  let jobMasterSummaryList = [{
    "1": { "count": 3, "list": [[2, "Unseen", 1], [1, "Pending", 2]] },
    "2": { "count": 0, "list": [] },
    "3": { "count": 0, "list": [] },
    "code": undefined,
    "count": 3,
    "id": 441,
    "identifierColor": undefined,
    "title": undefined
  },
  {
    "1": { "count": 0, "list": [] },
    "2": { "count": 0, "list": [] },
    "3": { "count": 0, "list": [] },
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

  it('should set all data for jobMaster Summary of User', () => {
      realm.getRecordListOnQuery = jest.fn()
      realm.getRecordListOnQuery.mockReturnValue(jobTransactionList)
      expect(summaryAndPieChartService.setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList,pendingStatusIds,noNextStatusIds)).toEqual(jobMasterSummaryList)
  })
 })


 describe('set All count for pieChart', () => {  // setAllCounts(allTransactions,pendingStatusIds,successStatusIds,failStatusIds)
  
    beforeEach(() => {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.validateAndUpdateData = jest.fn()
      summaryAndPieChartService.idDtoMap = jest.fn()
     })
      const count = { pendingCounts : 2 , successCounts : 2, failCounts : 2 }
      const pendingStatusIds = [11,12]
      const failStatusIds = [13,14]
      const successStatusIds = [15,16] 
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
        expect(summaryAndPieChartService.setAllCounts(jobTransactionList,pendingStatusIds,successStatusIds,failStatusIds)).toEqual(undefined)                
            })
  })


  describe('test cases for id DTO map', () => { //idDtoMap(dtoList)
    let dtoList = [1,2,3,4,5,6]
    let listMap = { "11": 1, "12": 1 }
  
    it('should set idDtoList map', () => {
        expect(summaryAndPieChartService.idDtoMap(dtoList)).toEqual(listMap)
    })
   })


   describe('test cases for get all runsheet Summary', () => { //getAllRunSheetSummary()
       const runsheetList =[
      {
       id: 2260,
       userId: 4957,
       hubId: 2759,
       runsheetNumber: "1",
       pendingCount:0,
       successCount: 2,
       failCount: 0
      },
      {
       id: 2261,
       userId: 4957,
       hubId: 2759,
       runsheetNumber: "2",
       pendingCount:0,
       successCount: 1,
       failCount: 0
      },
]
  let data = [["1", 2, 0, 0, undefined], ["2", 1, 0, 0, undefined]]
    it('should set all runSheet summary', () => {
      realm.getRecordListOnQuery = jest.fn()
      realm.getRecordListOnQuery.mockReturnValueOnce(runsheetList)
      expect(summaryAndPieChartService.getAllRunSheetSummary()).toEqual(data)
    })
   })

   describe('test cases for check today date transaction', () => { //isTodaysDateTransactions(jobTransactions,pendingStatusIds,noNextStatusIds)
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

  const pendingStatusIds = [11,12]
  const noNextStatusIds = [13,14]

  const pendingMap = {
    "11": 1,
    "12": 1
  }
  const noNextMap = {
    "13": 1,
    "14": 1
  }
let data = [["1", 2, 0, 0, undefined], ["2", 1, 0, 0, undefined]]

 it('should get all today job transaction ', () => {
  summaryAndPieChartService.idDtoMap = jest.fn()
  summaryAndPieChartService.idDtoMap.mockReturnValue(pendingMap)
                                    .mockReturnValue(noNextMap)
   expect(summaryAndPieChartService.isTodaysDateTransactions(jobTransactionList,pendingStatusIds,noNextStatusIds)).toEqual(undefined)
 })

//  it('should not check aerial distance between user and job location', () => {
//   realm.getRecordListOnQuery = jest.fn()
//   realm.getRecordListOnQuery.mockReturnValue([{
//       id: 3447,
//       latitude: 58.5551,
//       longitude: 77.26751
//   }])
//   expect(jobDetailsService.checkLatLong(jobId,userLat,userLong)).toEqual(true)
// })
})