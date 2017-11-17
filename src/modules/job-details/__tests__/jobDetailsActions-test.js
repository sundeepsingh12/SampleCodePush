'use strict'

import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { NavigationActions } from 'react-navigation'
import { setState, navigateToScene } from '../../global/globalActions'
import { jobDetailsService } from '../../../services/classes/JobDetails'
import { jobMasterService } from '../../../services/classes/JobMaster'
import * as realm from '../../../repositories/realmdb'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    FormLayout,
    JOB_MASTER,
    TABLE_JOB,
    USER_SUMMARY,
    IS_MISMATCHING_LOCATION,
} from '../../../lib/constants'
var actions = require('../jobDetailsActions')

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import CONFIG from '../../../lib/config'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)


describe('location mismatch actions', () => {
    let jobMasterList = {
        0: {
                id: 3447,
                enableFormLayout: true,
                enableLocationMismatch: true,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: false,
                enableResequenceRestriction: false,
                enabled: true,
                etaUpdateStatus: null,
            },
    }

    let data = {
        contactData: [],
        jobTransaction: {
            id: 3561721,
            jobId: 4294602,
            jobMasterId: 3453,
            jobStatusId: 16905,
            referenceNumber: "NITESH-1510640188486",
        },
        statusList: {
            actionOnStatus: 0,
            buttonColor: "#222f41",
            code: "it",
            id: 16927,
            jobMasterId: 3447,
            name: "Intermediate",
            nextStatusList: [],
            saveActivated: null,
            sequence: 5,
            statusCategory: 3,
            tabId: 2117,
            transient: true,
        }
    }
    let userSummary = {
        value: {
            hubId: 24629,
            id: 233438,
            lastBattery: 54,
            lastCashCollected: 0,
            lastLat: 28.5555772,
            lastLng: 77.2675903,
        }
    }
    let jobTransaction = {
        id: 4294602,
        latitude: 28.55542,
        longitude: 77.267463
    }
    const expectedActions = [

    ]
    it('should not check location mismatch and throw error', () => {
        try{
        jobMasterService.getJobMaterFromJobMasterList = jest.fn()
        jobMasterService.getJobMaterFromJobMasterList.mockReturnValueOnce(jobMasterList)
        const store = mockStore({})
        return store.dispatch(actions.checkForLocationMismatch())
            .then(() => {
                expect(jobMasterService.getJobMaterFromJobMasterList).toHaveBeenCalledTimes(0)
            })
        }catch(error){
            expect(error.message).toEqual(message)
        }
    })
    it('should check location mismatch ', () => {
        try{
        data.jobTransaction.jobMasterId = 3447
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userSummary)
        jobDetailsService.checkLatLong = jest.fn()
        jobDetailsService.checkLatLong.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.checkForLocationMismatch(data, 1))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect( jobDetailsService.checkLatLong).toHaveBeenCalledTimes(1)
            })
        }catch(error){
            expect(error.message).toEqual(message)
        }
    })
})