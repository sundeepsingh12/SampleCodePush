'use strict'

import {
    SET_TABS_LIST,
    JOB_DOWNLOADING_STATUS,
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

})