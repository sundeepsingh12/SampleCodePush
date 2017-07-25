import { jobTransactionService } from '../classes/JobTransaction'
import { jobStatusService } from '../classes/JobStatus'
import { jobAttributeMasterService } from '../classes/JobAttributeMaster'
import { jobService } from '../classes/Job'
import { jobDataService } from '../classes/JobData'
import { fieldDataService } from '../classes/FieldData'
import { customerCareService } from '../classes/CustomerCare'
import { smsTemplateService } from '../classes/SMSTemplate'

import * as realm from '../../repositories/realmdb'

// describe('test cases for setTransactionCustomizationDynamicParameters', () => {
//   const jobTransaction = null
//   const job = null
//   const finaltext = ''
//   it('should not set any dynamic parameters', () => {
//     jobTransactionService
//   })
// })

describe('test cases for setTransactionDisplayDetails', () => {
  const customizationObject = null
  const jobTransaction = null
  const job = null
  const jobDataForJobId = null
  const fieldDataForJobTransactionId = null
  const finalText = null

  it('should set display details empty', () => {
    jobTransactionService.setTransactionCustomizationDynamicParameters = jest.fn()
    jobTransactionService.setTransactionCustomizationDynamicParameters.mockReturnValue('dynamic parameters')
    jobTransactionService.setTransactionCustomizationJobAttributes = jest.fn()
    jobTransactionService.setTransactionCustomizationJobAttributes.mockReturnValue('job attributes')
    jobTransactionService.setTransactionCustomizationFieldAttributes = jest.fn()
    jobTransactionService.setTransactionCustomizationFieldAttributes.mockReturnValue('field attributes')
    expect(jobTransactionService.setTransactionDisplayDetails(customizationObject, jobTransaction, job, finalText)).toEqual('')
  })

  it('should set display details ', () => {
    const customizationObject1 = {}
    jobTransactionService.setTransactionCustomizationDynamicParameters = jest.fn()
    jobTransactionService.setTransactionCustomizationDynamicParameters.mockReturnValue('dynamic parameters')
    jobTransactionService.setTransactionCustomizationJobAttributes = jest.fn()
    jobTransactionService.setTransactionCustomizationJobAttributes.mockReturnValue('job attributes')
    jobTransactionService.setTransactionCustomizationFieldAttributes = jest.fn()
    jobTransactionService.setTransactionCustomizationFieldAttributes.mockReturnValue('field attributes')
    const result = 'field attributes'
    expect(jobTransactionService.setTransactionDisplayDetails(customizationObject1, jobTransaction, job, finalText)).toEqual(result)
  })

})

describe('test cases for prepareJobCustomizationList', () => {
  const jobMap = {
    2: {
      id: 2,
      jobMasterId: 3
    },
    3: {
      id: 3,
      jobMasterId: 3
    }
  }

  const jobDataDetailsForListing = {
    jobDataMap: {
      2: {
        30: {
          id: 21,
          jobId: 2,
          value: 'xyz',
          jobAttributeMasterId: 30
        },
        31: {
          id: 22,
          jobId: 2,
          value: 'abc',
          jobAttributeMasterId: 31
        }
      },
      3: {
        30: {
          id: 31,
          jobId: 3,
          value: 'xyz',
          jobAttributeMasterId: 30
        },
        31: {
          id: 32,
          jobId: 3,
          value: 'abc',
          jobAttributeMasterId: 31
        }
      }
    }
  }

  const fieldDataMap = {
    1: {
      40: {
        id: 100,
        jobTransactionId: 1,
        fieldAttributeMasterId: 40
      },
      41: {
        id: 101,
        jobTransactionId: 1,
        fieldAttributeMasterId: 41
      }
    },
    2: {
      40: {
        id: 102,
        jobTransactionId: 2,
        fieldAttributeMasterId: 40
      },
      41: {
        id: 103,
        jobTransactionId: 2,
        fieldAttributeMasterId: 41
      }
    }
  }

  const jobMasterIdCustomizationMap = {
    3: {
      1: {
        jobMasterId: 3,
        appJobListMasterId: 1,
      },
      2: {
        jobMasterId: 3,
        appJobListMasterId: 2,
      },
      3: {
        jobMasterId: 3,
        appJobListMasterId: 3,
      },
    }
  }
  const jobAttributeMasterMap = {}
  const jobAttributeStatusMap = {}
  const customerCareMap = {}
  const smsTemplateMap = {}


  it('should prepare job customization list', () => {
    const jobTransactionMap = {
      1: {
        id: 1,
        jobId: 2,
        jobMasterId: 3,
        seqSelected: 10,
        jobStatusId: 11,
        referenceNumber: 'refno'
      },
      2: {
        id: 2,
        jobId: 3,
        jobMasterId: 3,
        seqSelected: 12,
        jobStatusId: 11,
        referenceNumber: 'refno'
      }
    }

    const result = [
      {
        line1: 'xyz',
        line2: 'abc',
        circleLine1: 'lmn',
        circleLine2: 'def',
        id: 1,
        jobSwipableDetails: 'test1',
        seqSelected: 10,
        statusId: 11
      },
      {
        line1: 'test',
        line2: 'test',
        circleLine1: 'test',
        circleLine2: 'test',
        id: 2,
        jobSwipableDetails: 'test2',
        seqSelected: 12,
        statusId: 11
      }
    ]
    jobTransactionService.setTransactionDisplayDetails = jest.fn()
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('xyz')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('abc')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('lmn')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('def')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValue('test')
    jobTransactionService.setJobSwipableDetails = jest.fn()
    jobTransactionService.setJobSwipableDetails.mockReturnValueOnce('test1')
    jobTransactionService.setJobSwipableDetails.mockReturnValueOnce('test2')
    expect(jobTransactionService.prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap)).toEqual(result)
    expect(jobTransactionService.setTransactionDisplayDetails).toHaveBeenCalledTimes(8)
    expect(jobTransactionService.setJobSwipableDetails).toHaveBeenCalledTimes(2)
  })

  it('should prepare job customization list', () => {
    const jobTransactionMap = {
      1: {
        id: 1,
        jobId: 2,
        jobMasterId: 3,
        seqSelected: 10,
        jobStatusId: 11,
        referenceNumber: 'refno'
      },
      2: {
        id: 2,
        jobId: 3,
        jobMasterId: 4,
        seqSelected: 12,
        jobStatusId: 11,
        referenceNumber: 'refno'
      }
    }
    const result = [
      {
        line1: 'xyz',
        line2: 'abc',
        circleLine1: 'lmn',
        circleLine2: 'def',
        id: 1,
        jobSwipableDetails: 'test1',
        seqSelected: 10,
        statusId: 11
      },
      {
        line1: 'refno',
        line2: '',
        circleLine1: '',
        circleLine2: '',
        id: 2,
        jobSwipableDetails: 'test2',
        seqSelected: 12,
        statusId: 11
      }
    ]
    jobTransactionService.setTransactionDisplayDetails = jest.fn()
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('xyz')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('abc')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('lmn')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValueOnce('def')
    jobTransactionService.setTransactionDisplayDetails.mockReturnValue('test')
    jobTransactionService.setJobSwipableDetails = jest.fn()
    jobTransactionService.setJobSwipableDetails.mockReturnValueOnce('test1')
    jobTransactionService.setJobSwipableDetails.mockReturnValueOnce('test2')
    expect(jobTransactionService.prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap)).toEqual(result)
    expect(jobTransactionService.setTransactionDisplayDetails).toHaveBeenCalledTimes(4)
    expect(jobTransactionService.setJobSwipableDetails).toHaveBeenCalledTimes(2)
  })
})

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

  // it('should get job transactions on basis of status ids', () => {
  //   const allJobTransactions = [{
  //     id: 1,
  //     jobStatusId: 12
  //   }, {
  //     id: 2,
  //     jobStatusId: 13
  //   }, {
  //     id: 3,
  //     jobStatusId: 14
  //   }]
  //   const jobStatusIds = [12, 13]
  //   const filteredJobTransactions = [{
  //     id: 1,
  //     jobStatusId: 12
  //   }, {
  //     id: 2,
  //     jobStatusId: 13
  //   }]
  //   expect(jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, jobStatusIds)).toEqual(filteredJobTransactions)
  // })

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

  it('should return jobTransaction map and query for job,job data ,field data table', () => {
    const jobTransactionList = [
      {
        id: '1',
        jobId: '1'
      },
      {
        id: '2',
        jobId: '2'
      },
      {
        id: '3',
        jobId: '4'
      },
      {
        id: '6',
        jobId: '10'
      }
    ]

    const jobTransactionMap = {
      1: {
        id: '1',
        jobId: '1'
      },
      2: {
        id: '2',
        jobId: '2'
      },
      3: {
        id: '3',
        jobId: '4'
      },
      6: {
        id: '6',
        jobId: '10'
      }
    }

    const jobQuery = 'id = 1 OR id = 2 OR id = 4 OR id = 10'
    const jobTransactionQuery = 'id = 1 OR id = 2 OR id = 3 OR id = 6'
    const jobDataQuery = 'jobId = 1 OR jobId = 2 OR jobId = 4 OR jobId = 10'
    const fieldDataQuery = 'jobTransactionId = 1 OR jobTransactionId = 2 OR jobTransactionId = 3 OR jobTransactionId = 6'

    const result = {
      jobTransactionMap,
      jobQuery,
      jobTransactionQuery,
      jobDataQuery,
      fieldDataQuery
    }

    expect(jobTransactionService.getJobTransactionMapAndQuery(jobTransactionList)).toEqual(result)
  })

  it('should return jobTransaction map and query for job,job data ,field data table', () => {
    const jobTransactionList = null

    const jobTransactionMap = {}

    const jobQuery = ''
    const jobTransactionQuery = ''
    const jobDataQuery = ''
    const fieldDataQuery = ''

    const result = {
      jobTransactionMap,
      jobQuery,
      jobTransactionQuery,
      jobDataQuery,
      fieldDataQuery
    }
    expect(jobTransactionService.getJobTransactionMapAndQuery(jobTransactionList)).toEqual(result)
  })

  it('should prepare empty job customization list', () => {
    const jobTransactionMap = {}
    const jobMap = {}
    const jobDataDetailsForListing = {}
    const fieldDataMap = {}
    const jobMasterIdCustomizationMap = {}
    const jobAttributeMasterMap = {}
    const jobAttributeStatusMap = {}
    const customerCareMap = {}
    const smsTemplateMap = {}
    jobTransactionService.setTransactionDisplayDetails = jest.fn()
    jobTransactionService.setJobSwipableDetails = jest.fn()

    expect(jobTransactionService.prepareJobCustomizationList(jobTransactionMap, jobMap, jobDataDetailsForListing, fieldDataMap, jobMasterIdCustomizationMap, jobAttributeMasterMap, jobAttributeStatusMap, customerCareMap, smsTemplateMap)).toEqual([])
    expect(jobTransactionService.setTransactionDisplayDetails).not.toHaveBeenCalled()
    expect(jobTransactionService.setJobSwipableDetails).not.toHaveBeenCalled()
  })

  it('should return a empty job transaction customization list', () => {
    const jobMasterIdCustomizationMap = {}
    const jobAttributeMasterList = []
    const jobAttributeStatusList = []
    const customerCareList = []
    const smsTemplateList = []
    jobAttributeMasterService.getJobAttributeMasterMap = jest.fn()
    jobAttributeMasterService.getJobAttributeStatusMap = jest.fn()
    customerCareService.getCustomerCareMap = jest.fn()
    smsTemplateService.getSMSTemplateMap = jest.fn()
    realm.getRecordListOnQuery = jest.fn()
    realm.getRecordListOnQuery.mockReturnValue([])
    jobTransactionService.getJobTransactionMapAndQuery = jest.fn()
    jobService.getJobMap = jest.fn()
    jobDataService.getJobDataDetailsForListing = jest.fn()
    fieldDataService.getFieldDataMap = jest.fn()
    jobTransactionService.prepareJobCustomizationList = jest.fn()

    expect(jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap, jobAttributeMasterList, jobAttributeStatusList, customerCareList, smsTemplateList)).toEqual([])
    expect(jobAttributeMasterService.getJobAttributeMasterMap).toHaveBeenCalledTimes(1)
    expect(jobAttributeMasterService.getJobAttributeStatusMap).toHaveBeenCalledTimes(1)
    expect(customerCareService.getCustomerCareMap).toHaveBeenCalledTimes(1)
    expect(smsTemplateService.getSMSTemplateMap).toHaveBeenCalledTimes(1)
    expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
    expect(jobTransactionService.getJobTransactionMapAndQuery).not.toHaveBeenCalled()
    expect(jobTransactionService.prepareJobCustomizationList).not.toHaveBeenCalled()
    expect(jobService.getJobMap).not.toHaveBeenCalled()
    expect(jobDataService.getJobDataDetailsForListing).not.toHaveBeenCalled()
    expect(fieldDataService.getFieldDataMap).not.toHaveBeenCalled()
  })

  it('should return a job transaction customization list', () => {
    const jobMasterIdCustomizationMap = {}
    const jobAttributeMasterList = []
    const jobAttributeStatusList = []
    const customerCareList = []
    const smsTemplateList = []
    const jobTransactionList = [
      {
        id: '1'
      }
    ]

    const jobTransactionObject = {
      jobTransactionMap: {}
    }

    const jobTransactionCustomizationList = {
      line1: 'xyz',
      line2: 'abc',
      seqSelected: 1
    }
    jobAttributeMasterService.getJobAttributeMasterMap = jest.fn()
    jobAttributeMasterService.getJobAttributeStatusMap = jest.fn()
    customerCareService.getCustomerCareMap = jest.fn()
    smsTemplateService.getSMSTemplateMap = jest.fn()
    realm.getRecordListOnQuery = jest.fn()
    realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactionList)
    realm.getRecordListOnQuery.mockReturnValue([])
    jobTransactionService.getJobTransactionMapAndQuery = jest.fn()
    jobTransactionService.getJobTransactionMapAndQuery.mockReturnValue(jobTransactionObject)
    jobService.getJobMap = jest.fn()
    jobDataService.getJobDataDetailsForListing = jest.fn()
    fieldDataService.getFieldDataMap = jest.fn()
    jobTransactionService.prepareJobCustomizationList = jest.fn()
    jobTransactionService.prepareJobCustomizationList.mockReturnValue(jobTransactionCustomizationList)

    expect(jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap, jobAttributeMasterList, jobAttributeStatusList, customerCareList, smsTemplateList)).toEqual(jobTransactionCustomizationList)
    expect(jobAttributeMasterService.getJobAttributeMasterMap).toHaveBeenCalledTimes(1)
    expect(jobAttributeMasterService.getJobAttributeStatusMap).toHaveBeenCalledTimes(1)
    expect(customerCareService.getCustomerCareMap).toHaveBeenCalledTimes(1)
    expect(smsTemplateService.getSMSTemplateMap).toHaveBeenCalledTimes(1)
    expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(4)
    expect(jobTransactionService.getJobTransactionMapAndQuery).toHaveBeenCalledTimes(1)
    expect(jobTransactionService.prepareJobCustomizationList).toHaveBeenCalledTimes(1)
    expect(jobService.getJobMap).toHaveBeenCalledTimes(1)
    expect(jobDataService.getJobDataDetailsForListing).toHaveBeenCalledTimes(1)
    expect(fieldDataService.getFieldDataMap).toHaveBeenCalledTimes(1)
  })

})
