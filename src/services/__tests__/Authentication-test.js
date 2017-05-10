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
        expect(authenticationService.login(username,password)).toEqual({"_parts": [["j_username", "test"], ["j_password", "test"], ["_spring_security_remember_me", false], ["submit", "Login"]]})
    })

    it('should logout',() => {
        expect(authenticationService.logout(null)).toEqual(null)
    })

})