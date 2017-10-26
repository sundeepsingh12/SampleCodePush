'use strict'

import jobDetailsReducer from '../jobDetailsReducer'

const {
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END
} = require('../../../lib/constants').default

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
                ]
            }
        }
        let nextState = jobDetailsReducer(undefined, action)
        expect(nextState.jobDataList).toBe(action.payload.jobDataList)
        expect(nextState.fieldDataList).toBe(action.payload.fieldDataList)
        expect(nextState.nextStatusList).toBe(action.payload.nextStatusList)
        expect(nextState.jobDetailsLoading).toBe(false)
    })
})