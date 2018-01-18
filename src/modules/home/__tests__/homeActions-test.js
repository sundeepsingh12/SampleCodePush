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

describe('test cases for action fetchModulesList', () => {
    let newJobModules = {
        'temp': {
            displayText: 'temp'
        }
    }
    const expectedActions = [
        {
            type: HOME_LOADING,
            payload: {
                "moduleLoading": true
                
            }
        },
        {
            type: "SET_MODULES",
            payload: {
                "menu": undefined,
                "moduleLoading": false,
                "modules": undefined,
                "pieChart": undefined
            }
        }, {
            type: "SET_MODULES",
            payload: {
                "menu": undefined,
                "moduleLoading": false,
                "modules": undefined,
                "pieChart": undefined
            }
        }
    ]

    it('should enable modules and new job is present', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        moduleCustomizationService.getActiveModules = jest.fn()
        moduleCustomizationService.getActiveModules.mockReturnValue(newJobModules)
        const store = mockStore({})
        return store.dispatch(actions.fetchModulesList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(moduleCustomizationService.getActiveModules).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
    it('should enable modules when new job is not present', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        moduleCustomizationService.getActiveModules = jest.fn()
        moduleCustomizationService.getActiveModules.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.fetchModulesList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(moduleCustomizationService.getActiveModules).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})

describe('test cases for action pieChartCount', () => {

    const pendingStatusIds = [1,2,3,4]
    const failStatusIds = [5,6,7,8]
    const successStatusIds = [9,10,11,12] 
    const count = { pendingCounts : 3 , successCounts : 6, failCounts : 1 }
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
                loading: false,
                count: null
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
                expect(summaryAndPieChartService.getAllStatusIdsCount).toHaveBeenCalledTimes(0)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})