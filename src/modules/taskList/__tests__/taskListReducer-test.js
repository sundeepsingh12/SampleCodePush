'use strict'

import {
    SET_TABS_LIST,
    JOB_DOWNLOADING_STATUS,
    IS_CALENDAR_VISIBLE,
    LISTING_SEARCH_VALUE,
    RESET_STATE,
    SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE
} from '../../../lib/constants'

import taskListReducer from '../taskListReducer'

describe('taskList reducer', () => {

    it('it should set tabs list', () => {
        const action = {
            type: SET_TABS_LIST,
            payload: {
                tabsList: 'tabsList',
                tabIdStatusIdMap: 'tabIdStatusIdMap'
            }
        }
        let nextState = taskListReducer(undefined, action)
        expect(nextState.tabsList).toBe(action.payload.tabsList)
        expect(nextState.tabIdStatusIdMap).toBe(action.payload.tabIdStatusIdMap)
    })

    it('it should set loader', () => {
        const action = {
            type: JOB_DOWNLOADING_STATUS,
            payload: {
                isDownloadingjobs: true
            }
        }
        let nextState = taskListReducer(undefined, action)
        expect(nextState.downloadingJobs).toBe(action.payload.isDownloadingjobs)
    })
    it('it should set is calender visible', () => {
        const action = {
            type: IS_CALENDAR_VISIBLE,
            payload: true
        }
        let nextState = taskListReducer(undefined, action)
        expect(nextState.isCalendarVisible).toBe(action.payload)
    })
    it('it should set search text', () => {
        const action = {
            type: LISTING_SEARCH_VALUE,
            payload: 'test'
        }
        let nextState = taskListReducer(undefined, action)
        expect(nextState.searchText).toBe(action.payload)
    })

    it('it should set initial state', () => {
        const InitialState = {
            tabsList: [],
            tabIdStatusIdMap: {},
            downloadingJobs: false,
            isFutureRunsheetEnabled: false,
            selectedDate: null,
            isCalendarVisible: false,
            searchText: {},
        }
        const action = {
            type: 'test'
        }
        let nextState = taskListReducer(undefined, action)
        expect(nextState.tabsList).toEqual(InitialState.tabsList)
        expect(nextState.tabIdStatusIdMap).toEqual(InitialState.tabIdStatusIdMap)
        expect(nextState.downloadingJobs).toBe(InitialState.downloadingJobs)
        expect(nextState.isFutureRunsheetEnabled).toBe(InitialState.isFutureRunsheetEnabled)
        expect(nextState.selectedDate).toBe(InitialState.selectedDate)
        expect(nextState.isCalendarVisible).toBe(InitialState.isCalendarVisible)
        expect(nextState.searchText).toEqual(InitialState.searchText)
    })
})