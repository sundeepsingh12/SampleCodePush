'use strict'

import {deviceVerificationService} from '../classes/DeviceVerification'
import CONFIG from '../../lib/config'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'


jest.mock('../../lib/RestAPIFactory')
jest.mock('../../lib/RestAPI')


const {
    DEVICE_IMEI,
    DEVICE_SIM
} = require('../../lib/constants').default

describe('device verification',() => {
    it('is device locally verified',() => {
        const deviceIMEI = null
        const deviceSIM = null
        const user = {
            value : {
                company : {
                    id : 1,
                    hubId : 1,
                }
            }
        }
        expect(deviceVerificationService.checkAsset(deviceIMEI,deviceSIM,user)).toBeFalsy()
    })

    it('is device verified on server',() => {
        const deviceSIM = {
            isVerified : true
        }
        expect(deviceVerificationService.checkIfSimValidOnServer(deviceSIM)).toBeTruthy()
    })

})