'use strict'

import { jobMasterService } from '../classes/JobMaster'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

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
    const deviceSIM = {}
    const deviceIMEI = {}
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

})
