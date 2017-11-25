'use strict'
import {SET_DATA_IN_STATISTICS_LIST} from '../../../lib/constants'

import statistics from '../statisticsReducer'

describe('statisticsReducer ', () => {

    it('it should set statistics data list', () => {
        const dataList = 'test'
        const action = {
            type: SET_DATA_IN_STATISTICS_LIST,
            payload: dataList
        }
        let nextState = statistics(undefined, action)
        expect(nextState.statisticsListItems).toBe(action.payload)
    })
})