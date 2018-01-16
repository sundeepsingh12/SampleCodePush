'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'
import sha256 from 'sha256'
import RestAPIFactory from '../../lib/RestAPIFactory'
import { profileService } from '../classes/ProfileService'
import { Toast } from 'native-base'

describe('test cases for getResponse after hitting API', () => {

    const currentPassword = 'User@123'
    const newPassword = 'Xyz@1234'
    const confirmNewPassword = 'Xyz@1234'
    const userPassword = { value: '3e7c19576488862816f13b512cacf3e4ba97dd97243ea0bd6a2ad1642d86ba72' }
    const token = { value: 'XSRF-TOKEN=c7779a5f-4d2a-42d0-a19a-f908bcf49d1e; Path=/, JSESSIONID=dd2fd286-aafb-462d-9b78-f8525cf871a8; Path=/; Secure; HttpOnly' }
    const  userObject = {
        value: {
            username: 'abhishek_div001'
        }
    }

    it('should return and reset the new password', () => {
        const response = { "_40": 0, "_55": null, "_65": 0, "_72": null }
        expect(profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userObject)).toEqual(response)
    })

    it('should return Response', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userObject)
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })

    it('should throw error if userPassword and currentPassword does not match', () => {
        let currentpassword = "Abc123$d"
        const response = undefined
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        expect(profileService.getResponse(currentpassword, newPassword, confirmNewPassword, userPassword, token, userObject)).toEqual(response)
        expect(Toast.show).toHaveBeenCalled()
    })

    it('should throw error if newPassword and confirmNewPassword does not match', () => {
        let newpassword = "Abc123$d"
        const response = undefined
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        expect(profileService.getResponse(currentPassword, newpassword, confirmNewPassword, userPassword, token, userObject)).toEqual(response)
        expect(Toast.show).toHaveBeenCalled()
    })

    it('should throw error if newpassword and currentPassword are same', () => {
        let newpassword = "User@123"
        let confirmnewPassword = "User@123"
        const response = undefined
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        expect(profileService.getResponse(currentPassword, newpassword, confirmnewPassword, userPassword, token, userObject)).toEqual(response)
        expect(Toast.show).toHaveBeenCalled()
    })

    it('should throw error if newpassword is not of the particular format', () => {
        let newpassword = "useruser"
        let confirmnewPassword = "useruser"
        const response = undefined
        Toast.show = jest.fn()
        Toast.show.mockReturnValue({})
        expect(profileService.getResponse(currentPassword, newpassword, confirmnewPassword, userPassword, token, userObject)).toEqual(response)
        expect(Toast.show).toHaveBeenCalled()
    })
})

