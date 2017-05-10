'use strict'

import {jobMasterService} from '../classes/JobMaster'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

jest.mock('../../lib/RestAPIFactory')
jest.mock('../../lib/RestAPI')

describe('job master services', () => {
  function checkError(message) {
    jobMasterService.checkIfHubAndImeiIsValid(message);
  }

  it('download job master with empty request',() => {
    const deviceSIM = null
    const deviceIMEI = null
    const user = null
    expect(jobMasterService.downloadJobMaster(deviceIMEI,deviceSIM,user)).toEqual('')
  })

  it('download job master with empty request',() => {
    const deviceSIM = {}
    const deviceIMEI = {}
    const user = {
      value : {
        company : {
          id : 1,
          currentJobMasterVersion : 1,
        }
      }
    }
    expect(jobMasterService.downloadJobMaster(deviceIMEI,deviceSIM,user)).toEqual("{\"deviceIMEI\":{},\"deviceSIM\":{},\"currentJobMasterVersion\":1,\"deviceCompanyId\":1}")
  })

  it('check message from server',() => {
    const message = 'Access is denied'
    try {
    jobMasterService.checkIfHubAndImeiIsValid(message)
  } catch(error) {
     expect(error).toBe(message)
    }
   
  })

  it('check message from server',() => {
    const message = 'Verified IMEI not valid for that HUB!!!'
    try {
    jobMasterService.checkIfHubAndImeiIsValid(message)
  } catch(error) {
     expect(error).toBe(message)
    }
  })

  it('check message from server',() => {
    const message = 'IMEI Not Verified. Please verify it from server.'
    try {
    jobMasterService.checkIfHubAndImeiIsValid(message)
  } catch(error) {
     expect(error).toBe(message)
    }
  })
})
