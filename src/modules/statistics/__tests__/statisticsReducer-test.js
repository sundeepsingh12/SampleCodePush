'use strict'
import {SET_DATA_IN_STATISTICS_LIST, RESET_STATE} from '../../../lib/constants'

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
    it('it should reset statistics data list', () => {
        const dataList = 'test'
        const action = {
            type: RESET_STATE,
        }
        let nextState = statistics(undefined, action)
        expect(nextState.statisticsListItems).toEqual({})
    })
    it('it should not update state', () => {
        const dataList = 'test'
        const action = {
            type: 'NO_STATE',
        }
        let nextState = statistics(undefined, action)
        expect(nextState.statisticsListItems).toEqual({})
    })
})