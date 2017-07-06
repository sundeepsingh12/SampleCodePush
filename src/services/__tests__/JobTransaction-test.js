import {
  jobTransactionService
} from '../classes/JobTransaction'

import {
  jobStatusService
} from '../classes/JobStatus'

import * as realm from '../../repositories/realmdb'

describe('test Job Transaction services', () => {
  it('should get unseen transaction job master ids ', () => {
    const unseenTransactions = [{
      id: 1,
      jobMasterId: 12
    }, {
      id: 2,
      jobMasterId: 13
    }]
    const jobMasterIds = [12, 13]
    expect(jobTransactionService.getUnseenTransactionsJobMasterIds(unseenTransactions)).toEqual(jobMasterIds)
  })

  it('should get job transactions on basis of status ids', () => {
    const allJobTransactions = [{
      id: 1,
      jobStatusId: 12
    }, {
      id: 2,
      jobStatusId: 13
    }, {
      id: 3,
      jobStatusId: 14
    }]
    const jobStatusIds = [12, 13]
    const filteredJobTransactions = [{
      id: 1,
      jobStatusId: 12
    }, {
      id: 2,
      jobStatusId: 13
    }]
    expect(jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, jobStatusIds)).toEqual(filteredJobTransactions)
  })

  it('should get JobMasterIdJobStatusIdTransactionIdDtoMap', () => {
    const unseenTransactions = [{
      id: 2560784,
      jobStatusId: 4814,
      jobMasterId: 930
    }]

    const jobMasterIdJobStatusIdTransactionIdDtoMap = {
      930: {
        4814: {
          jobMasterId: 930,
          pendingStatusId: 4813,
          transactionId: "2560784",
          unSeenStatusId: 4814
        }
      }
    }
    jobTransactionService.getUnseenTransactionsJobMasterIds = jest.fn()
    jobTransactionService.getUnseenTransactionsJobMasterIds.mockReturnValueOnce(
      [930]
    )
    jobStatusService.getjobMasterIdStatusIdMap = jest.fn()
    jobStatusService.getjobMasterIdStatusIdMap.mockReturnValueOnce({
      930: 4813
    })
    return jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions).then(data => {
      expect(data).toEqual(jobMasterIdJobStatusIdTransactionIdDtoMap)
      expect(jobTransactionService.getUnseenTransactionsJobMasterIds).toHaveBeenCalledTimes(1)
      expect(jobStatusService.getjobMasterIdStatusIdMap).toHaveBeenCalledTimes(1)
    })
  })

  it('should return an empty map for no unseen transaction', () => {
    const unseenTransactions = {},
      jobMasterIdJobStatusIdTransactionIdDtoMap = {}
    jobTransactionService.getUnseenTransactionsJobMasterIds = jest.fn()
    jobStatusService.getjobMasterIdStatusIdMap = jest.fn()
    return jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions).then(data => {
      expect(data).toEqual(jobMasterIdJobStatusIdTransactionIdDtoMap)
      expect(jobTransactionService.getUnseenTransactionsJobMasterIds).not.toHaveBeenCalled()
      expect(jobStatusService.getjobMasterIdStatusIdMap).not.toHaveBeenCalled()
    })

  })

  it('should update job transaction status id', () => {
    const jobMasterIdTransactionDtoMap = [{
      jobMasterId: 930,
      pendingStatusId: 4813,
      transactionId: "2426803",
      unSeenStatusId: 4814
    }]
    realm.updateTableRecordOnProperty = jest.fn()
    jobTransactionService.updateJobTransactionStatusId(jobMasterIdTransactionDtoMap)
    expect(realm.updateTableRecordOnProperty).toHaveBeenCalledTimes(1)
  })

})
