'use strict'

import {authenticationService} from '../classes/Authentication'
import CONFIG from '../../lib/config'

jest.mock('../../lib/RestAPIFactory')
jest.mock('../../lib/RestAPI')

const {
    USERNAME,
    PASSWORD,
    REMEMBER_ME,

} = require('../../lib/constants').default

describe('auth service', () => {

    it('should login',() => {
        const username = 'test'
        const password = 'test'
        const res = {
        'status': 401
        }
        expect(authenticationService.login(username,password)).toEqual(res)
    })
})