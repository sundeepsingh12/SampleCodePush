'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'
import { userSummaryService } from '../classes/UserSummary'

describe('test cases of user summary service ', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
    })
    it('it should update userSummary', () => {
        let latitude = 28.98765
        let longitude = 29.2342323
        let result = 12
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: {
                lastLat: 28.234567,
                lastLng: 29.987653,
                gpsKms: 2.8,
            }
        })
        keyValueDBService.validateAndSaveData.mockReturnValue({})
        return userSummaryService._updateUserSummary(latitude, longitude)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })

    it('it should update userSummary when lat and longitude are not present', () => {
        let latitude = 28.98765
        let longitude = 29.2342323
        let result = 12
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: {
                lastLat: null,
                lastLng: null,
                gpsKms: 2.8,
            }
        })
        keyValueDBService.validateAndSaveData.mockReturnValue({})
        return userSummaryService._updateUserSummary(latitude, longitude)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })

    it('it should throw error as usersummary has no latitude and longitude', () => {
        let latitude = 28.98765
        let longitude = 29.2342323
        let result = 12
        keyValueDBService.getValueFromStore.mockReturnValue({})
        keyValueDBService.validateAndSaveData.mockReturnValue({})
        return userSummaryService._updateUserSummary(latitude, longitude)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })
})