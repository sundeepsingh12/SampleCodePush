import { runSheetService } from '../classes/RunSheet'
import { jobStatusService } from '../classes/JobStatus'
import * as realm from '../../repositories/realmdb'


describe('test cases for id DTO map', () => { //idDtoMap(dtoList)
    let dtoList = [1,2,3,4,5,6]
    let listMap = { "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1 }
  
    it('should set idDtoList map', () => {
        expect(runSheetService.idDtoMap(dtoList,1)).toEqual(listMap)
    })
   })


describe('test case for update runsheet db', () => {  // getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds, noNextStatusIds)
    
      beforeEach(() => {
        realm.getRecordListOnQuery = jest.fn()
        jobStatusService.getStatusIdsForAllStatusCategory = jest.fn()
        runSheetService.idDtoMap = jest.fn()
        realm.getAll = jest.fn()
        realm.performBatchSave = jest.fn()
       })
        const count = { pendingCounts : 2 , successCounts : 2, failCounts : 2 }
        const pendingStatusIds = [12,13]
        const failStatusIds = [14,15]
        const successStatusIds = [16,17] 
        const noNextStatusIds = [18,19]
        const pendingStatusMap = { "12": 1, "13": 1}
        const failStatusMap = { "13": 2, "14":2}
        const successStatusMap = { "15": 3, "16":3}
        const allTodayJobTransactions = [{
            id: 1,
            jobStatusId: 12
          }, {
            id: 2,
            jobStatusId: 13
          }]

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
          realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactionList)
          jobStatusService.getStatusIdsForAllStatusCategory.mockReturnValueOnce({pendingStatusIds,failStatusIds,successStatusIds,noNextStatusIds})
          runSheetService.idDtoMap.mockReturnValueOnce(pendingStatusMap)
                                  .mockReturnValueOnce(failStatusMap)
                                  .mockReturnValueOnce(successStatusMap)
          realm.getAll.mockReturnValueOnce(runsheetList)
          return runSheetService.updateRunSheetSummary()
              .then((count) =>{
                  expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
                  expect(jobStatusService.getStatusIdsForAllStatusCategory).toHaveBeenCalledTimes(1)
                  expect(runSheetService.idDtoMap).toHaveBeenCalledTimes(3)                
                  expect(realm.getAll).toHaveBeenCalledTimes(1)                
              })
      })
    })