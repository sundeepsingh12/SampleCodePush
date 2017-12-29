'use strict'

import {summaryAndPieChartService} from '../classes/SummaryAndPieChart'
import { jobTransactionService } from '../classes/JobTransaction'
describe('PieChart service', () => {
    const count = { pendingCounts : 2 , successCounts : 2, failCounts : 2 }
    const pendingStatusIds = [12,13]
    const failStatusIds = [14,15]
    const successStatusIds = [16,17] 
    const allJobTransactions = [{
        id: 1,
        jobStatusId: 12
      }, {
        id: 2,
        jobStatusId: 13
      }]
      const failJobTransactions = [{
        id: 3,
        jobStatusId: 14
      }, {
        id: 4,
        jobStatusId: 15
      }]
      const successJobTransactions = [{
        id: 5,
        jobStatusId: 16
      }, {
        id: 6,
        jobStatusId: 17
      }]

    it('should get error from server', () => {
        jobTransactionService.getJobTransactionsForStatusIds = jest.fn()
        jobTransactionService.getJobTransactionsForStatusIds.mockReturnValueOnce(pendingJobTransactions)
                                                            .mockReturnValueOnce(successJobTransactions)
                                                            .mockReturnValueOnce(failJobTransactions)
                                                           
    expect(summaryAndPieChartService.getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds)).toEqual(count)  
    })
})