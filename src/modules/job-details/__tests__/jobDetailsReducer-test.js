'use strict'

import jobDetailsReducer from '../jobDetailsReducer'

import {
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    IS_MISMATCHING_LOCATION,
    RESET_STATE,
    RESET_STATE_FOR_JOBDETAIL,
    SHOW_DROPDOWN,
    SET_JOBDETAILS_DRAFT_INFO,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL,
    SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT
} from '../../../lib/constants'

describe('job details reducer', () => {

    it('should set fetching job details true', () => {
        const action = {
            type: JOB_DETAILS_FETCHING_START
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.jobDetailsLoading).toBe(true)
    })

    it('should check location mismatch', () => {
        const action = {
            type: IS_MISMATCHING_LOCATION,
            payload: { id: 1, name: 'abc', isLocationMismatch: true }
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.statusList).toBe(action.payload)
    })

    it('should set job details', () => {
        const action = {
            type: JOB_DETAILS_FETCHING_END,
            payload: {
                jobDataList: {
                    id: 1
                },
                fieldDataList: {
                    id: 2
                },
                nextStatusList: undefined,
                errorMessage: ''
            }
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.jobDataList).toBe(action.payload.jobDataList)
        expect(nextState.fieldDataList).toBe(action.payload.fieldDataList)
        expect(nextState.nextStatusList).toBe(action.payload.nextStatusList)
        expect(nextState.jobDetailsLoading).toBe(false)
        expect(nextState.errorMessage).toBe(action.payload.errorMessage)
    })

    it('should set loader', () => {
        const action = {
            type: SET_LOADER_FOR_SYNC_IN_JOBDETAIL,
            payload: true
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.syncLoading).toBe(true)
    })
    it('should reset job details state', () => {
        const action = {
            type: RESET_STATE_FOR_JOBDETAIL,
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.errorMessage).toBe(false)
        expect(nextState.statusRevertList).toEqual([])
        expect(nextState.jobDetailsLoading).toBe(false)
        expect(nextState.draftStatusInfo).toEqual({})
    })

    it('should set dropdown', () => {
        const action = {
            type: SHOW_DROPDOWN,
            payload: true
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.isShowDropdown).toBe(true)
    })
    it('should set draft', () => {
        const action = {
            type: SET_JOBDETAILS_DRAFT_INFO,
            payload: {}
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.draftStatusInfo).toEqual({})
    })

    it('should set draft', () => {
        const action = {
            type: SET_LOADER_FOR_SYNC_IN_JOBDETAIL_AND_DRAFT,
            payload: true
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.draftStatusInfo).toEqual(null)
        expect(nextState.syncLoading).toBe(true)

    })
})
