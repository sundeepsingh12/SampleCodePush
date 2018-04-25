'use strict'
import * as actions from '../homeActions'
import {
    HOME_LOADING,
    CHART_LOADING
} from '../../../lib/constants'
import { summaryAndPieChartService } from '../../../services/classes/SummaryAndPieChart'
import { jobStatusService } from '../../../services/classes/JobStatus'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)


describe('test cases for action pieChartCount', () => {

    const pendingStatusIds = [1, 2, 3, 4]
    const failStatusIds = [5, 6, 7, 8]
    const successStatusIds = [9, 10, 11, 12]
    const count = { pendingCounts: 3, successCounts: 6, failCounts: 1 }
    const expectedActions = [
        {
            type: CHART_LOADING,
            payload: {
                loading: true,
            }
        },
        {
            type: CHART_LOADING,
            payload: {
                count: { failCounts: 1, pendingCounts: 3, successCounts: 6 },
                loading: false
            }
        },
    ]
    const store = mockStore({})

    it('should count transactions With different status category ', () => {

        jobStatusService.getStatusIdsForStatusCategory = jest.fn()
        jobStatusService.getStatusIdsForStatusCategory.mockReturnValueOnce(pendingStatusIds)
            .mockReturnValueOnce(failStatusIds)
            .mockReturnValueOnce(successStatusIds)
        summaryAndPieChartService.getAllStatusIdsCount = jest.fn()
        summaryAndPieChartService.getAllStatusIdsCount.mockReturnValue(count)
        return store.dispatch(actions.pieChartCount())
            .then(() => {
                expect(jobStatusService.getStatusIdsForStatusCategory).toHaveBeenCalledTimes(0)
                expect(summaryAndPieChartService.getAllStatusIdsCount).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})