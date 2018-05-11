'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'
import sha256 from 'sha256'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { profileService } from '../classes/ProfileService'
import { Toast } from 'native-base'

import {
    CHECK_IF_PASSWORD_ENTERED,
    CHECK_CURRENT_PASSWORD,
    MATCH_NEW_AND_CONFIRM_PASSWORD,
    VALIDATE_PASSWORD,
    CURRENT_AND_NEW_PASSWORD_CHECK,
    UNSAVED_PASSWORD,
    OK,
    USERNAME_IS_MISSING
} from '../../lib/ContainerConstants'

describe('test cases for getResponse after hitting API', () => {

    const currentPassword = 'User@123'
    const newPassword = 'Xyz@1234'
    const confirmNewPassword = 'Xyz@1234'
    const userPassword = { value: '3e7c19576488862816f13b512cacf3e4ba97dd97243ea0bd6a2ad1642d86ba72' }
    const token = { value: 'XSRF-TOKEN=c7779a5f-4d2a-42d0-a19a-f908bcf49d1e; Path=/, JSESSIONID=dd2fd286-aafb-462d-9b78-f8525cf871a8; Path=/; Secure; HttpOnly' }
    const userObject = {
        value: {
            username: 'abhishek_div001'
        }
    }



    it('throw error when user object is null', () => {
        try {
            expect(profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, null)).toEqual(response)
        } catch (error) {
            expect(error.message).toEqual(USERNAME_IS_MISSING)
        }
    })

    it('throw error when user password is null', () => {
        try {
            expect(profileService.getResponse(currentPassword, newPassword, confirmNewPassword, null, token, userObject)).toEqual(response)
        } catch (error) {
            expect(error.message).toEqual(UNSAVED_PASSWORD)
        }
    })

    it('throw error when current passowrd not equal to user password', () => {
        try {
            expect(profileService.getResponse('abc', newPassword, confirmNewPassword, userPassword, token, userObject)).toEqual(response)
        } catch (error) {
            expect(error.message).toEqual(CHECK_CURRENT_PASSWORD)
        }
    })

    it('throw error when new password not equal to confirm new password', () => {
        try {
            expect(profileService.getResponse(currentPassword, newPassword, 'abc', userPassword, token, userObject)).toEqual(response)
        } catch (error) {
            expect(error.message).toEqual(MATCH_NEW_AND_CONFIRM_PASSWORD)
        }
    })

    it('throw error when current passowrd equal to new password', () => {
        try {
            expect(profileService.getResponse(currentPassword, currentPassword, currentPassword, userPassword, token, userObject)).toEqual(response)
        } catch (error) {
            expect(error.message).toEqual(CURRENT_AND_NEW_PASSWORD_CHECK)
        }
    })

    it('get response from server', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue('result');
        expect(profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userObject)).toEqual('result')
    })
})

