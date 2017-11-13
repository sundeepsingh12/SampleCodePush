'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'
import sha256 from 'sha256'
import {

} from '../../lib/AttributeConstants'
import RestAPIFactory from '../../lib/RestAPIFactory'

import { profileService } from '../classes/ProfileService'

describe('test cases for getResponse after hitting API', () => {

    const currentPassword = 'User@123'
    const newPassword = 'Xyz@1234'
    const confirmNewPassword = 'Xyz@1234'
    const userPassword = { value: '3e7c19576488862816f13b512cacf3e4ba97dd97243ea0bd6a2ad1642d86ba72' }
    const token = { value: 'XSRF-TOKEN=c7779a5f-4d2a-42d0-a19a-f908bcf49d1e; Path=/, JSESSIONID=dd2fd286-aafb-462d-9b78-f8525cf871a8; Path=/; Secure; HttpOnly' }
    const userName = 'abhishek_div001'

    it('should return and reset the new password', () => {
        const response = {"_40": 0, "_55": null, "_65": 0, "_72": null}
        expect(profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userName)).toEqual(response)
    })

        it('should return Response', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        profileService.getResponse(currentPassword, newPassword, confirmNewPassword, userPassword, token, userName)
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })
})

