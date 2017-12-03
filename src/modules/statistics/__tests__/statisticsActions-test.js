'use strict'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { statisticsListService } from '../../../services/classes/Statistics'
import {getDataForStatisticsList} from '../statisticsActions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

import {SET_DATA_IN_STATISTICS_LIST} from '../../../lib/constants'

describe('statisticsActions', () => {
    const statisticsList = {
        id:12453,
        value:{
            "activeTimeInMillis": 0,
            "avgSpeed": 0,
            "cashCollected": 278,
            "cashCollectedByCard": 0,
            "cashPayment": 0,
            "cityId": 0,
            "companyId": 0,
            "cugCallIncomingCount": 0,
            "cugCallIncomingDuration": 0,
            "cugCallOutgoingCount": 0,
            "cugCallOutgoingDuration": 0,
            "date": '11-09-2017',
            "failCount": 0,
            "firstLat": 0,
            "firstLong": null,
            "gpsKms": 0,
            "haltDuration": 0,
            "hubId": 0,
            "id" : 0,
            "imeiNumber": '4774744',
            "lastBattery": 0,
            "lastCashCollected": 0,
            "lastLat": 0,
            "lastLng": 0,
            "lastLocationDatetime": '11-09-2017 06:23',
            "lastLogoutTime": '12:25',
            "lastOrderNumber": '12',
            "lastOrderTime": '01:46',
            "lastSpeed": 0,
            "maxSpeed": 0,
            "odometerKms": 0,
            "officialCallIncomingCount": 0,
            "officialCallIncomingDuration": 0,
            "officialCallOutgoingCount": 0,
            "officialCallOutgoingDuration": 0,
            "officialSmsSentCount": 0,
            "pendingCount": 0,
            "personalCallIncomingCount": 0,
            "personalCallIncomingDuration": 0,
            "personalCallOutgoingCount": 0,
            "personalCallOutgoingDuration": 0,
            "personalSmsSentCount": 1,
            "successCount": 0,
            "travelDuration": 0,
            "userId": 0
        }
    }
    const returnData = {
        '0': { id: 0, value: '0.00 kilometers', label: 'Distance' },
        '1': { id: 1, value: '0 mins,0 secs', label: 'Halt Duration' },
        '2': { id: 2, value: '0 mins,0 secs', label: 'Travel Duration' },
        '3': { id: 3, value: '0 km/hr', label: 'Average Speed' },
        '4': { id: 4, value: '0 km/hr', label: 'Maximum Speed' },
        '5': { id: 5, value: '0  text messages', label: 'Official SMS' },
        '6': { id: 6, value: '1  text messages', label: 'Personal SMS' },
        '7': { id: 7, value: '0 minutes,0 seconds', label: 'Officials Calls' },
        '8': { id: 8, value: '0 minutes,0 seconds', label: 'Personal Calls' },
        '9': { id: 9, value: '278.00/- collected', label: 'Collection' } 
    }
     const expectedActions = [
            {
                type: SET_DATA_IN_STATISTICS_LIST,
                payload: returnData
            },
        ]

    it('should get Data For StatisticsList', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(statisticsList)
        statisticsListService.setStatisticsList = jest.fn()
        statisticsListService.setStatisticsList.mockReturnValue(returnData)
        const store = mockStore({})
        return store.dispatch(getDataForStatisticsList())
            .then(() => {
                    expect(statisticsListService.setStatisticsList).toHaveBeenCalled()
                    expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                    expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                })
    })
});