'use strict'

const {
  JOB_FETCHING_START,
    JOB_FETCHING_END,
    SET_TABS_LIST,
    SET_FETCHING_FALSE,
    CLEAR_HOME_STATE,
} = require('../../lib/constants').default

import homeReducer from '../homeReducer'

describe('home reducer', () => {
    it('it set tabs list',() => {
        const tabsList = [
            {
                tabId : 1,
                name : 'Pending'
            }
        ]
        const action = {
            type : SET_TABS_LIST,
            payload: tabsList
        }
        let nextState = homeReducer(undefined,action)
        expect(nextState.tabsList).toBe(tabsList)
    })
})