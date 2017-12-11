'use strict'
import {
    END_LIVEJOB_DETAILD_FETCHING
} from '../../../lib/constants'
import InitialState from '../liveJobInitialState.js'
import liveJobReducer from '../liveJobReducer'

describe('live job reducer ', () => {

    it('it should set jobdata list', () => {
        const jobDataList = 'test'
        const jobTransaction = 'test'
        const currentStatus = 'test'
        const action = {
            type: END_LIVEJOB_DETAILD_FETCHING,
            payload: {
                jobDataList,
                jobTransaction,
                currentStatus
            }
        }
        let nextState = liveJobReducer(undefined, action)
        expect(nextState.jobDataList).toBe(jobDataList)
        expect(nextState.jobTransaction).toEqual(jobTransaction)
        expect(nextState.currentStatus).toBe(currentStatus)
    })
    it('it should return initial state', () => {
        const initialState = {
            jobDataList: [],
            jobTransaction: null,
            currentStatus: null,
            liveJobDetailsLoading: false,
        }
        const action = 'test'
        let nextState = liveJobReducer(undefined, action)
        expect(nextState.jobDataList).toEqual(initialState.jobDataList)
        expect(nextState.jobTransaction).toEqual(initialState.jobTransaction)
        expect(nextState.currentStatus).toBe(initialState.currentStatus)
        expect(nextState.liveJobDetailsLoading).toBe(initialState.liveJobDetailsLoading)

    })
})
