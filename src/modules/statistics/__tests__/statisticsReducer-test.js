'use strict'
const {
    SET_DATA_IN_STATISTICS_LIST
} = require('../../../lib/constants').default

import statistics from '../statisticsReducer'

describe('statisticsReducer ', () => {

    it('it should set statistics data list', () => {
        const dataList = 'test'
        const action = {
            type: SET_DATA_IN_STATISTICS_LIST,
            payload: dataList
        }
        let nextState = statistics(undefined, action)
        expect(nextState.statisticsListItems).toBe(dataList)
    })
})