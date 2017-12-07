'use strict'
import {
    SET_LIVE_JOB_LIST,
    TOGGLE_LIVE_JOB_LIST_ITEM,
    START_FETCHING_LIVE_JOB
} from '../../../lib/constants'
import InitialState from '../liveJobListingInitialState.js'
import liveJobListingReducer from '../liveJobListingReducer'

describe('live job listing reducer ', () => {

    it('it should set live job list', () => {
        const liveJobList = []
        const action = {
            type: SET_LIVE_JOB_LIST,
            payload: liveJobList
        }
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.liveJobList).toBe(liveJobList)
        expect(nextState.selectedItems).toEqual([])
        expect(nextState.loaderRunning).toBe(false)
    })
    it('it should set live job list and selected items', () => {
        const liveJobList = []
        const selectedItems = 'test'
        const action = {
            type: TOGGLE_LIVE_JOB_LIST_ITEM,
            payload: {
                jobTransactions: liveJobList,
                selectedItems: selectedItems
            }
        }
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.liveJobList).toBe(liveJobList)
        expect(nextState.selectedItems).toEqual(selectedItems)
    })
    it('it should set loader running', () => {
        const loaderRunning = true
        const action = {
            type: START_FETCHING_LIVE_JOB,
            payload: loaderRunning
        }
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.loaderRunning).toBe(loaderRunning)

    })
    it('it should return initial state', () => {
        const initialState = {
            liveJobList: {},
            selectedItems: [],
            loaderRunning: false
        }
        const action = 'test'
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.liveJobList).toEqual(initialState.liveJobList)
        expect(nextState.selectedItems).toEqual(initialState.selectedItems)
        expect(nextState.loaderRunning).toBe(initialState.loaderRunning)
    })
})
