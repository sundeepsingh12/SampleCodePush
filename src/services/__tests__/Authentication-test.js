'use strict'

import { authenticationService } from '../classes/Authentication'
import { keyValueDBService } from '../classes/KeyValueDBService'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { restAPI } from '../../lib/RestAPI'


const {
    USERNAME,
    PASSWORD,
    REMEMBER_ME,

} = require('../../lib/constants').default

describe('auth service', () => {

    it('should login', () => {
        const username = 'test'
        const password = 'test'
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn()
        restAPI.serviceCall.mockReturnValue('test')
        expect(authenticationService.login(username, password)).toEqual('test')
        expect(restAPI.initialize).toHaveBeenCalledTimes(1)
        expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
    })

    it('should not login and throw error', () => {
        const errorMessage = 'test error'
        try {
            const username = 'test'
            const password = 'test'
            restAPI.initialize = jest.fn(() => {
                throw new Error(errorMessage)
            })
            restAPI.serviceCall = jest.fn()
            restAPI.serviceCall.mockReturnValue('test')
            authenticationService.login(username, password)
        } catch (error) {
            expect(error.message).toEqual(errorMessage)
            expect(restAPI.initialize).toHaveBeenCalledTimes(1)
            expect(restAPI.serviceCall).not.toHaveBeenCalled()
        }
    })

    it('should throw logout error', () => {
        const message = 'Token Missing'
        try {
            authenticationService.logout(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should logout', () => {
        const token = {
            value: null
        }
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn()
        restAPI.serviceCall.mockReturnValue(null)
        expect(authenticationService.logout(token)).toBe(null)
    })

    it('should save login credentials', () => {
        const username = 'test'
        const password = 'test'
        const rememberMe = true
        keyValueDBService.validateAndSaveData = jest.fn()
        authenticationService.saveLoginCredentials(username,password,rememberMe)
        expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(3)
    })

    it('should delete login credentials', () => {
        const username = 'test'
        const password = 'test'
        const rememberMe = false
        keyValueDBService.deleteValueFromStore = jest.fn()
        authenticationService.saveLoginCredentials(username,password,rememberMe)
        expect(keyValueDBService.deleteValueFromStore).toHaveBeenCalledTimes(3)
    })

})