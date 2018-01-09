'use strict'
import {
    END_LIVEJOB_DETAILD_FETCHING,
    RESET_STATE,
    SET_MESSAGE
} from '../../../lib/constants'
import InitialState from '../liveJobInitialState.js'
import liveJobReducer from '../liveJobReducer'

describe('live job reducer ', () => {

    it('it should set jobdata list', () => {
        const jobDataList = 'test'
        const jobTransaction = 'test'
        const currentStatus = 'test'
        const toastMessage = ''
        const action = {
            type: END_LIVEJOB_DETAILD_FETCHING,
            payload: {
                jobDataList,
                jobTransaction,
                currentStatus,
                toastMessage
            }
        }
        let nextState = liveJobReducer(undefined, action)
        expect(nextState.jobDataList).toBe(jobDataList)
        expect(nextState.jobTransaction).toEqual(jobTransaction)
        expect(nextState.currentStatus).toBe(currentStatus)
        expect(nextState.toastMessage).toBe(toastMessage)

    })
    it('it should return initial state', () => {
        const initialState = {
            jobDataList: [],
            jobTransaction: null,
            currentStatus: null,
            liveJobDetailsLoading: false,
            toastMessage: ''
        }
        const action = 'test'
        let nextState = liveJobReducer(undefined, action)
        expect(nextState.jobDataList).toEqual(initialState.jobDataList)
        expect(nextState.jobTransaction).toEqual(initialState.jobTransaction)
        expect(nextState.currentStatus).toBe(initialState.currentStatus)
        expect(nextState.liveJobDetailsLoading).toBe(initialState.liveJobDetailsLoading)
        expect(nextState.toastMessage).toBe(initialState.toastMessage)
    })
    it('it should set jobdata list', () => {
        const message = 'test'

        const action = {
            type: SET_MESSAGE,
            payload: message
        }
        let nextState = liveJobReducer(undefined, action)
        expect(nextState.toastMessage).toBe(message)
    })
    it('it should set initial state', () => {
        const initialState = {
            jobDataList: [],
            jobTransaction: null,
            currentStatus: null,
            liveJobDetailsLoading: false,
            toastMessage: ''
        }
        const action = RESET_STATE
        let nextState = liveJobReducer(undefined, action)
        expect(nextState.jobDataList).toEqual(initialState.jobDataList)
        expect(nextState.jobTransaction).toEqual(initialState.jobTransaction)
        expect(nextState.currentStatus).toBe(initialState.currentStatus)
        expect(nextState.liveJobDetailsLoading).toBe(initialState.liveJobDetailsLoading)
        expect(nextState.toastMessage).toBe(initialState.toastMessage)
    })
})
