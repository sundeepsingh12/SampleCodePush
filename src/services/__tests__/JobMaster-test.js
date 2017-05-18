'use strict'

import { jobMasterService } from '../classes/JobMaster'
import { keyValueDBService } from '../classes/KeyValueDBService'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moment from 'moment'

jest.mock('../../lib/RestAPIFactory')
jest.mock('../../lib/RestAPI')

describe('job master services', () => {

  it('download job master with empty request', () => {
    const deviceSIM = null
    const deviceIMEI = null
    const user = null
    const token = {
      value: null
    }
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual('')
  })

  it('throw user null error', () => {
    const message = 'Cannot read property \'value\' of null'
    try {
      const deviceSIM = {}
      const deviceIMEI = {}
      const user = null
      const token = {
        value: null
      }
      jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })

  it('download job master with request', () => {
    const deviceSIM = {
      value: {}
    }
    const deviceIMEI = {
      value: {}
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
    expect(jobMasterService.downloadJobMaster(deviceIMEI, deviceSIM, user, token)).toEqual("{\"deviceIMEI\":{},\"deviceSIM\":{},\"currentJobMasterVersion\":1,\"deviceCompanyId\":1}")
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
      jobMasterService.matchServerTimeWithMobileTime(serverTime)
    }
    catch (error) {
      expect(error.message).toEqual("Server Time not same as mobile time")
    }
  })

  // it('should throw time format invalid', () => {
  //   try {
  //     const serverTime = 'abcd'
  //     jobMasterService.matchServerTimeWithMobileTime(serverTime)
  //   }
  //   catch (error) {
  //     expect(error.message).toEqual("Server Time format incorrect")
  //   }
  // })

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
