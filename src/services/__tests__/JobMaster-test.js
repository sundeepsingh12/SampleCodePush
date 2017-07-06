'use strict'

import { jobMasterService } from '../classes/JobMaster'
import { keyValueDBService } from '../classes/KeyValueDBService'
import { restAPI } from '../../lib/RestAPI'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moment from 'moment'

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
      value : {
        test : 'test'
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
      value : {
        test : 'test'
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
        test : 'test'
      }
    }
    const deviceIMEI = {
      value: {
        test : 'test'
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
    keyValueDBService.validateAndSaveData = jest.fn()
    keyValueDBService.validateAndSaveData.mockReturnValue(null)
    return jobMasterService.saveJobMaster(json)
      .then(() => {
        expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(19)
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


})
