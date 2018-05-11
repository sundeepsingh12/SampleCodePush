'use strict'

import { jobMasterService } from '../classes/JobMaster'
import { keyValueDBService } from '../classes/KeyValueDBService'
import { restAPI } from '../../lib/RestAPI'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moment from 'moment'

describe('test cases for prepareCustomizationListMap', () => {

  it('should return null for undefined jobListCustomizationList', () => {
    expect(jobMasterService.prepareCustomizationListMap(undefined)).toEqual(null)
  })

  it('should return empty jobMasterIdCustomizationMap for empty jobListCustomizationList', () => {
    expect(jobMasterService.prepareCustomizationListMap([])).toEqual({})
  })

  it('should return jobMasterIdCustomizationMap for specified jobListCustomizationList', () => {
    const jobListCustomization = [
      {
        appJobListMasterId: 1,
        jobMasterId: 10,
        value: 'xyz'
      },
      {
        appJobListMasterId: 2,
        jobMasterId: 10,
        value: 'abc'
      },
      {
        appJobListMasterId: 1,
        jobMasterId: 11,
        value: 'iop'
      },
      {
        appJobListMasterId: 3,
        jobMasterId: 11,
        value: 'xyz'
      },
    ]

    const jobMasterIdCustomizationMap = {
      10: {
        1: {
          appJobListMasterId: 1,
          jobMasterId: 10,
          value: 'xyz'
        },
        2: {
          appJobListMasterId: 2,
          jobMasterId: 10,
          value: 'abc'
        }
      },
      11: {
        1: {
          appJobListMasterId: 1,
          jobMasterId: 11,
          value: 'iop'
        },
        3: {
          appJobListMasterId: 3,
          jobMasterId: 11,
          value: 'xyz'
        }
      }
    }
    expect(jobMasterService.prepareCustomizationListMap(jobListCustomization)).toEqual(jobMasterIdCustomizationMap)
  })

})

describe('test cases for prepareTabStatusIdMap', () => {

  it('should return null for undefined statusList', () => {
    expect(jobMasterService.prepareTabStatusIdMap(undefined)).toEqual(null)
  })

  it('should return empty tabIdStatusIdsMap for empty statusList', () => {
    expect(jobMasterService.prepareTabStatusIdMap([])).toEqual({})
  })

  it('should return tabIdStatusIdsMap for statusList', () => {
    const jobStatusList = [
      {
        id: 1,
        tabId: 1
      },
      {
        id: 2,
        tabId: 1
      },
      {
        id: 3,
        tabId: 2
      },
      {
        id: 4,
        tabId: 2
      },
      {
        id: 5,
        tabId: 2
      },
    ]

    const tabIdStatusIdsMap = {
      1: [
        1,
        2
      ],
      2: [
        3,
        4,
        5
      ]
    }
    expect(jobMasterService.prepareTabStatusIdMap(jobStatusList)).toEqual(tabIdStatusIdsMap)
  })

})

describe('test cases for validateAndSortTabList', () => {

  it('should return null for undefined tab list ', () => {
    expect(jobMasterService.validateAndSortTabList(undefined)).toEqual(null)
  })

  it('should return empty tab list for empty tab list ', () => {
    expect(jobMasterService.validateAndSortTabList([])).toEqual([])
  })

  it('should filter and sort tab list', () => {
    const tabList = [
      {
        name: 'XYZ',
        isDefault: false
      },
      {
        name: 'ABC',
        isDefault: false
      },
      {
        name: 'HIDDEN',
        isDefault: false
      },
      {
        name: 'JKL',
        isDefault: true
      },
      {
        name: 'IOT',
        isDefault: false
      }
    ]

    const result = [
      {
        name: 'JKL',
        isDefault: true
      },
      {
        name: 'XYZ',
        isDefault: false
      },
      {
        name: 'ABC',
        isDefault: false
      },
      {
        name: 'IOT',
        isDefault: false
      }
    ]

    expect(jobMasterService.validateAndSortTabList(tabList)).toEqual(result)
  })

})

describe('job master services', () => {

  it('download job master with empty request', () => {
    const deviceSIM = null
    const deviceIMEI = null
    const user = null
    const token = {
      value: null
    }
    restAPI.initialize = jest.fn()
    restAPI.serviceCall = jest.fn((data) => {
      return data
    })
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual('')
    expect(restAPI.initialize).toHaveBeenCalledTimes(1)
    expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
  })

  it('download job master with empty request when user null', () => {
    const deviceSIM = {}
    const deviceIMEI = {}
    const user = null
    const token = {
      value: null
    }
    restAPI.initialize = jest.fn()
    restAPI.serviceCall = jest.fn((data) => {
      return data
    })
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual('')
    expect(restAPI.initialize).toHaveBeenCalledTimes(1)
    expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
  })

  it('download job master with request body of only user', () => {
    const deviceSIM = null
    const deviceIMEI = null
    const user = {
      value: {
        company: {
          id: 1,
          currentJobMasterVersion: 1,
        }
      }
    }
    const token = {
      value: null
    }
    restAPI.initialize = jest.fn()
    restAPI.serviceCall = jest.fn((data) => {
      return data
    })
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual('{\"deviceIMEI\":{},\"deviceSIM\":{},\"currentJobMasterVersion\":1,\"deviceCompanyId\":1}')
    expect(restAPI.initialize).toHaveBeenCalledTimes(1)
    expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
  })

  it('download job master with request body of only user when deviceSIM null', () => {
    const deviceSIM = null
    const deviceIMEI = {
      value: {
        test: 'test'
      }
    }
    const user = {
      value: {
        company: {
          id: 1,
          currentJobMasterVersion: 1,
        }
      }
    }
    const token = {
      value: null
    }
    restAPI.initialize = jest.fn()
    restAPI.serviceCall = jest.fn((data) => {
      return data
    })
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual('{\"deviceIMEI\":{},\"deviceSIM\":{},\"currentJobMasterVersion\":1,\"deviceCompanyId\":1}')
    expect(restAPI.initialize).toHaveBeenCalledTimes(1)
    expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
  })

  it('download job master with request body of only user when deviceSIM null', () => {
    const deviceIMEI = null
    const deviceSIM = {
      value: {
        test: 'test'
      }
    }
    const user = {
      value: {
        company: {
          id: 1,
          currentJobMasterVersion: 1,
        }
      }
    }
    const token = {
      value: null
    }
    restAPI.initialize = jest.fn()
    restAPI.serviceCall = jest.fn((data) => {
      return data
    })
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual('{\"deviceIMEI\":{},\"deviceSIM\":{},\"currentJobMasterVersion\":1,\"deviceCompanyId\":1}')
    expect(restAPI.initialize).toHaveBeenCalledTimes(1)
    expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
  })

  it('download job master with request body', () => {
    const deviceSIM = {
      value: {
        test: 'test'
      }
    }
    const deviceIMEI = {
      value: {
        test: 'test'
      }
    }
    const user = {
      value: {
        company: {
          id: 1,
          currentJobMasterVersion: 1,
        }
      }
    }
    const token = {
      value: null
    }
    restAPI.initialize = jest.fn()
    restAPI.serviceCall = jest.fn((data) => {
      return data
    })
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual('{\"deviceIMEI\":{\"test\":\"test\"},\"deviceSIM\":{\"test\":\"test\"},\"currentJobMasterVersion\":1,\"deviceCompanyId\":1}')
    expect(restAPI.initialize).toHaveBeenCalledTimes(1)
    expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
  })

  it('should throw token error', () => {
    const deviceSIM = null
    const deviceIMEI = null
    const user = null
    const token = null
    const message = 'Token Missing'
    try {
      jobMasterService.downloadJobMaster(null)
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })

  it('should match server time with mobile time', () => {
    const serverTime = moment()
    expect(jobMasterService.matchServerTimeWithMobileTime(serverTime)).toEqual(true)
  })

  it('should throw time mismatch', () => {
    try {
      let serverTime = moment()
      serverTime.subtract(20, 'm')
      jobMasterService.matchServerTimeWithMobileTime(serverTime.format('YYYY-MM-DD HH:mm:ss'))
    }
    catch (error) {
      expect(error.message).toEqual("Time mismatch. Please correct time on Device")
    }
  })

  it('should throw time format invalid', () => {
    try {
      const serverTime = 'abcd'
      jobMasterService.matchServerTimeWithMobileTime(serverTime)
    }
    catch (error) {
      expect(error.message).toEqual("Server time format incorrect")
    }
  })

  it('should save job master', () => {
    const json = {
      jobMaster: [],
      user: {},
      jobAttributeMaster: [],
      jobAttributeValueMaster: [],
      fieldAttributeMaster: [],
      fieldAttributeValueMaster: [],
      jobStatus: [],
      modulesCustomization: [],
      jobListCustomization: [],
      appJobStatusTabs: [],
      jobMasterMoneyTransactionModes: [],
      customerCareList: [],
      smsTemplatesList: [],
      fieldAttributeMasterStatuses: [],
      fieldAttributeMasterValidations: [],
      fieldAttributeMasterValidationConditions: [],
      smsJobStatuses: [],
      userSummary: {},
      jobSummary: [],
    }
    keyValueDBService.validateAndSaveData = jest.fn()
    keyValueDBService.validateAndSaveData.mockReturnValue(null)
    jobMasterService.prepareCustomizationListMap = jest.fn()
    jobMasterService.validateAndSortTabList = jest.fn()
    return jobMasterService.saveJobMaster(json)
      .then(() => {
        expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(26)
        expect(jobMasterService.prepareCustomizationListMap).toHaveBeenCalledTimes(1)
        expect(jobMasterService.validateAndSortTabList).toHaveBeenCalledTimes(1)
      })
  })

  it('should not save job master and throw error', () => {
    const errorMessage = 'test error'
    const json = {
      jobMaster: {},
      user: {},
      jobAttributeMaster: {},
      jobAttributeValueMaster: {},
      fieldAttributeMaster: {},
      fieldAttributeValueMaster: {},
      jobStatus: {},
      modulesCustomization: {},
      jobListCustomization: {},
      appJobStatusTabs: {},
      jobMasterMoneyTransactionModes: {},
      customerCareList: {},
      smsTemplatesList: {},
      fieldAttributeMasterStatuses: {},
      fieldAttributeMasterValidations: {},
      fieldAttributeMasterValidationConditions: {},
      smsJobStatuses: {},
      userSummary: {},
      jobSummary: {},
    }
    keyValueDBService.validateAndSaveData = jest.fn(() => {
      throw new Error(errorMessage)
    })
    return jobMasterService.saveJobMaster(json)
      .catch((error) => {
        expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1)
        expect(error.message).toEqual(errorMessage)
      })
  })

  // it('It should get job master from JobMasterList', () => {
  //   let jobMasterId = 441
  //   const jobMasterList = {
  //     value: [
  //       {
  //         id: 441,
  //         enableLocationMismatch: false,
  //         enableManualBroadcast: false,
  //         enableMultipartAssignment: false,
  //         enableOutForDelivery: false,
  //         enableResequenceRestriction: true
  //       },
  //       {
  //         id: 442,
  //         enableLocationMismatch: false,
  //         enableManualBroadcast: false,
  //         enableMultipartAssignment: false,
  //         enableOutForDelivery: false,
  //         enableResequenceRestriction: false
  //       }
  //     ]
  //   }

  //   const result = [
  //     {
  //       id: 441,
  //       enableLocationMismatch: false,
  //       enableManualBroadcast: false,
  //       enableMultipartAssignment: false,
  //       enableOutForDelivery: false,
  //       enableResequenceRestriction: true
  //     }]

  //   expect(jobMasterService.getJobMaterFromJobMasterLists(jobMasterId, jobMasterList)).toEqual(result)
  // })

})


