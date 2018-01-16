'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'
import { userEventLogService } from '../classes/UserEvent'
import { LOGIN_SUCCESSFUL } from '../../lib/AttributeConstants'
import { LAST_SYNC_WITH_SERVER } from '../../lib/constants'

describe('test cases of user Event service addUserEventLog', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
    })
    it('it should add user event log', () => {
        let userDetails = {
            value:
                {
                    userId: 12,
                    company: { id: 23 },
                    hubId: 34,
                    cityId: 45
                }
        }
        let userSummary = {
            value: {
                lastLng: 27.345678,
                lastLat: 29.45678,
            }
        }
        let eventID = 1
        let description = ""
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userDetails)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userSummary)
        keyValueDBService.validateAndSaveData.mockReturnValue({})
        return userEventLogService.addUserEventLog(eventID, description)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })

    it('it should add user event log', () => {
        let userDetails = {
            value:
                {
                    userId: 12,
                    company: { id: 23 },
                    hubId: 34,
                    cityId: 45
                }
        }
        let userSummary = {
            value: {
                lastLng: 27.345678,
                lastLat: 29.45678,
            }
        }
        let eventID = 1
        let description = ""
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userDetails)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userSummary)
        keyValueDBService.validateAndSaveData.mockReturnValue({})
        return userEventLogService.addUserEventLog(eventID, description)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })

    it('it should add user event log', () => {
        let userDetails = {
            value:
                {
                    userId: 12,
                    company: { id: 23 },
                    hubId: 34,
                    cityId: 45
                }
        }
        let userSummary = {
            value: {
                lastLng: null,
                lastLat: null,
            }
        }
        let eventID = 1
        let description = ""
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userDetails)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userSummary)
        keyValueDBService.validateAndSaveData.mockReturnValue({})
        return userEventLogService.addUserEventLog(eventID, description)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })
})

describe('test cases of user Event service getUserEventLog', () => {
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
    })
    let lastSyncTime = {
        value: "2018-01-11 13:30:30"
    }
    let userEventLogObject = {
        value: [{
            userId: 12,
            companyId: 23,
            hubId: 34,
            cityId: 45,
            eventId: 1,
            description: "",
            latitude: 28.987654,
            longitude: 29.2434566,
            dateTime: "2018-01-09 13:30:20"
        },
        {
            userId: 12,
            companyId: 23,
            hubId: 34,
            cityId: 45,
            eventId: 1,
            description: "",
            latitude: 22.987654,
            longitude: 26.2434566,
            dateTime: "2018-01-13 13:30:20"
        }]
    }
    let eventLogReturn = [{
        userId: 12,
        companyId: 23,
        hubId: 34,
        cityId: 45,
        eventId: 1,
        description: "",
        latitude: 28.987654,
        longitude: 29.2434566,
        dateTime: "2018-01-09 13:30:20"
    }]
    it('it should fetch user Event log', () => {
        keyValueDBService.getValueFromStore.mockReturnValue(userEventLogObject)
        return userEventLogService.getUserEventLog(lastSyncTime)
            .then((eventLogReturn) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })

    it('it should fetch user Event log', () => {
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return userEventLogService.getUserEventLog(lastSyncTime)
            .then((eventLogReturn) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            })
    })
})