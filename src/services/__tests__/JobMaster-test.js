'use strict'

import {jobMasterService} from '../classes/JobMaster'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('authActions', () => {
it('should getSessionToken', () => {
  const jobMaster = {
    jobMaster : 'jobMaster'
  }
    const store = mockStore({})
    return store.dispatch(jobMasterService.getJobMaster())
      .then((data) => {
        expect(data).toEqual(jobMaster)
      })
  })
})
