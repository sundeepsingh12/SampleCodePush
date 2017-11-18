'use strict'

import jobDetailsReducer from '../jobDetailsReducer'

import {
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END
} from '../../../lib/constants'

describe('job details reducer', () => {

    it('should set fetching job details true', () => {
        const action = {
            type: JOB_DETAILS_FETCHING_START
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.jobDetailsLoading).toBe(true)
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
                nextStatusList: [
                    {
                        id: 3
                    }
                ],
                isEnableOutForDelivery: true
            }
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.jobDataList).toBe(action.payload.jobDataList)
        expect(nextState.fieldDataList).toBe(action.payload.fieldDataList)
        expect(nextState.nextStatusList).toBe(action.payload.nextStatusList)
        expect(nextState.jobDetailsLoading).toBe(false)
        expect(nextState.isEnableOutForDelivery).toBe(action.payload.isEnableOutForDelivery)
    })
})
