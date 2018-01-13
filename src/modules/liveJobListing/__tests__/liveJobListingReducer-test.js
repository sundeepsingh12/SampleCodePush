'use strict'
import {
    SET_LIVE_JOB_LIST,
    TOGGLE_LIVE_JOB_LIST_ITEM,
    START_FETCHING_LIVE_JOB,
    SET_SEARCH,
    SET_LIVE_JOB_TOAST,
    RESET_STATE
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
        expect(nextState.liveJobToastMessage).toBe('')
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
        expect(nextState.liveJobToastMessage).toBe('')
    })
    it('it should set loader running', () => {
        const loaderRunning = true
        const action = {
            type: START_FETCHING_LIVE_JOB,
            payload: loaderRunning
        }
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.loaderRunning).toBe(loaderRunning)
        expect(nextState.liveJobToastMessage).toBe('')
    })
    it('it should set search text', () => {
        const searchText = 'test'
        const action = {
            type: SET_SEARCH,
            payload: searchText
        }
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.searchText).toBe(searchText)
    })
    it('it should set live job toast', () => {
        const liveJobToastMessage = 'test'
        const action = {
            type: SET_LIVE_JOB_TOAST,
            payload: liveJobToastMessage
        }
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.liveJobToastMessage).toBe(liveJobToastMessage)
    })
    it('it should return initial state', () => {
        const initialState = {
            liveJobList: {},
            selectedItems: [],
            loaderRunning: false,
            searchText: ''
        }
        const action = 'test'
        let nextState = liveJobListingReducer(undefined, action)
        expect(nextState.liveJobList).toEqual(initialState.liveJobList)
        expect(nextState.selectedItems).toEqual(initialState.selectedItems)
        expect(nextState.loaderRunning).toBe(initialState.loaderRunning)
        expect(nextState.searchText).toBe(initialState.searchText)
    })
})
