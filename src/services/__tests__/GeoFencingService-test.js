
import { geoFencingService } from '../classes/GeoFencingService'
import {
    JOB_MASTER,
    HUB_LAT_LONG,
    USER,
    TABLE_JOB_TRANSACTION,
    TABLE_JOB,
    GEO_FENCING,
    LAT_LONG_GEO_FENCE
} from '../../lib/constants'
import * as realm from '../../repositories/realmdb'
import moment from 'moment'
import { keyValueDBService } from '../classes/KeyValueDBService'
import { PENDING } from '../../lib/AttributeConstants'
import {
    HUB_LAT_LONG_MISSING,
    FENCE_LAT_LONG_MISSING,
} from '../../lib/ContainerConstants'
import { jobStatusService } from '../classes/JobStatus'
import { runSheetService } from '../classes/RunSheet'
import { jobDetailsService } from '../classes/JobDetails'

describe('test findCentreOfPolygon', () => {
    it('should return an object having mean lat long', () => {
        const latLongArray = [{
            latitude: 100,
            longitude: 100
        }, {
            latitude: 100,
            longitude: 100
        }, {
            latitude: 100,
            longitude: 100
        }]
        expect(geoFencingService.findCentreOfPolygon(latLongArray)).toEqual({
            latitude: 100,
            longitude: 100
        })
    })
})

describe('test calculateRadius', () => {
    it('should return radius', () => {
        const latLongArray = [{
            latitude: 100,
            longitude: 100
        }]
        let mean = {
            latitude: 50,
            longitude: 50
        }
        jobDetailsService.distance = jest.fn()
        jobDetailsService.distance.mockReturnValue(0.5)
        expect(geoFencingService.calculateRadius(mean, latLongArray)).toEqual(1300)
    })
})

describe('test getListOfLatLong', () => {
    it('should return mean lat long', () => {
        const latLongObject = {
            previous: '100,100'
        }
        expect(geoFencingService.getListOfLatLong(latLongObject)).toEqual([{
            latitude: '100',
            longitude: '100'
        }])
    })
})



describe('test getLatLng', () => {

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        geoFencingService.getjobTransactionLatLongList = jest.fn()
        geoFencingService.getListOfLatLong = jest.fn()
        geoFencingService.findCentreOfPolygon = jest.fn()
        geoFencingService.calculateRadius = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        keyValueDBService.deleteValueFromStore = jest.fn()
    })

    it('case of initial addition of fence', () => {
        geoFencingService.getjobTransactionLatLongList.mockReturnValue({
            latLongObject: {
                previous: '100,200',
                current: '100,100',
                next: '300,100'
            }, transactionIdIdentifier: 123
        })
        geoFencingService.getListOfLatLong.mockReturnValue([{
            latitude: '100', longitude: '200'
        }, {
            latitude: '100', longitude: '100'
        }, {
            latitude: '300', longitude: '100'
        }])
        geoFencingService.findCentreOfPolygon.mockReturnValue({
            latitude: '300', longitude: '100'
        })
        geoFencingService.calculateRadius.mockReturnValue(900)
        geoFencingService.getLatLng({}, {}, true).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(geoFencingService.getjobTransactionLatLongList).toHaveBeenCalledTimes(1)
            expect(geoFencingService.getListOfLatLong).toHaveBeenCalledTimes(1)
            expect(geoFencingService.findCentreOfPolygon).toHaveBeenCalledTimes(1)
            expect(geoFencingService.calculateRadius).toHaveBeenCalledTimes(1)
            expect(result).toEqual({
                meanLatLong: {
                    latitude: '300', longitude: '100'
                },
                radius: 900,
                transactionIdIdentifier: 123
            })
        })
    })

    it('case when called from  form layout save', () => {
        keyValueDBService.getValueFromStore.mockReturnValue(123)
        geoFencingService.getjobTransactionLatLongList.mockReturnValue({
            latLongObject: {
                previous: '100,200',
                current: '100,100',
                next: '300,100'
            }, transactionIdIdentifier: 123
        })
        geoFencingService.getListOfLatLong.mockReturnValue([{
            latitude: '100', longitude: '200'
        }, {
            latitude: '100', longitude: '100'
        }, {
            latitude: '300', longitude: '100'
        }])
        geoFencingService.findCentreOfPolygon.mockReturnValue({
            latitude: '300', longitude: '100'
        })
        geoFencingService.calculateRadius.mockReturnValue(900)
        geoFencingService.getLatLng({}, {}, false).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
            expect(geoFencingService.getjobTransactionLatLongList).toHaveBeenCalledTimes(1)
            expect(geoFencingService.getListOfLatLong).toHaveBeenCalledTimes(1)
            expect(geoFencingService.findCentreOfPolygon).toHaveBeenCalledTimes(1)
            expect(geoFencingService.calculateRadius).toHaveBeenCalledTimes(1)
            expect(keyValueDBService.deleteValueFromStore).toHaveBeenCalledTimes(1)
            expect(result).toEqual({
                meanLatLong: {
                    latitude: '300', longitude: '100'
                },
                radius: 900,
                transactionIdIdentifier: 123
            })
        })
    })


    it('should throw an error', () => {
        try {
            keyValueDBService.getValueFromStore.mockReturnValue(null)
            geoFencingService.getLatLng({}, {}, false)
        } catch (error) {
            expect(error.message).toEqual(FENCE_LAT_LONG_MISSING)
        }
    })
})



describe('test checkForEnableResequenceRestrictionAndCheckAllowOffRouteNotification', () => {

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        runSheetService.getOpenRunsheets = jest.fn()
    })

    it('faceIdentifier is present', () => {
        keyValueDBService.getValueFromStore.mockReturnValue({ value: true })
        geoFencingService.checkForEnableResequenceRestrictionAndCheckAllowOffRouteNotification().then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(result).toEqual({ fencePresent: true })
        })
    })

    it('userData not present', () => {
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        geoFencingService.checkForEnableResequenceRestrictionAndCheckAllowOffRouteNotification().then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(3)
            expect(result).toEqual([])
        })
    })

    it('should return fencePresent to false, jobMasterIdListWithEnableResequenceRestriction, openRunsheetList', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce(null)
            .mockReturnValueOnce({
                value: {
                    company: {
                        allowOffRouteNotification: true
                    }
                }
            }).mockReturnValueOnce({
                value: [
                    { id: 1, enableResequenceRestriction: true },
                    { id: 2, enableResequenceRestriction: false },
                    { id: 3, enableResequenceRestriction: true },
                ]
            })
        runSheetService.getOpenRunsheets.mockReturnValue({})
        geoFencingService.checkForEnableResequenceRestrictionAndCheckAllowOffRouteNotification().then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(3)
            expect(runSheetService.getOpenRunsheets).toHaveBeenCalledTimes(1)
            expect(result).toEqual({
                fencePresent: false,
                jobMasterIdListWithEnableResequenceRestriction:
                    [
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                    ],
                openRunsheetList: {}
            })
        })
    })
})