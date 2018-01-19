'use strict'

import * as actions from '..//summaryActions'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { jobStatusService } from '../../../services/classes/JobStatus'
import { summaryAndPieChartService } from '../../../services/classes/SummaryAndPieChart'
import {
    SET_SUMMARY_FOR_JOBMASTER,
    SET_SUMMARY_FOR_RUNSHEET,
} from '../../../lib/constants'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test cases for get data for jobMaster and runSheet summary List ', () => {


    const jobMasterList = {
        value: [
            {
                id: 441,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: false,
                enableResequenceRestriction: true
            },
            {
                id: 442,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: false,
                enableResequenceRestriction: false
            }
        ]
    }
    const jobStatusList = [{
        id: 1,
        jobMasterId: 441,
        statusCategory : 1,
        code: 'PENDING',
        name: 'Unseen'
      }, {
        id: 2,
        jobMasterId: 441,
        statusCategory : 1,
        code: 'PENDING',
        name: 'Pending',
      },
    ]
    const jobSummaryList = [
        { jobStatusId: 1 },
        { jobStatusId: 2 },
        { jobStatusId: 3 },
        { jobStatusId: 4 }]

    let jobMasterSummaryList = [{
        "1": { "count": 3, "list": [[2, "Unseen", 1], [1, "Pending", 2]] },
        "2": { "count": 0, "list": [] },
        "3": { "count": 0, "list": [] },
        "code": undefined,
        "count": 3,
        "id": 441,
        "identifierColor": undefined,
        "title": undefined
        },
        {
        "1": { "count": 0, "list": [] },
        "2": { "count": 0, "list": [] },
        "3": { "count": 0, "list": [] },
        "code": undefined,
        "count": 0,
        "id": 442,
        "identifierColor": undefined,
        "title": undefined
        }]
        let data = [["1", 2, 0, 0, undefined], ["2", 1, 0, 0, undefined]]
    it('should get data for jobMasterSummary and runSheetSummary', () => {


        const tabsList = {
            value: [
                {
                    tabId: 12
                }
            ]
        }
        const tabsListResult = [
            {
                tabId: 12
            }
        ]
        const tabIdStatusIdMap = {
            12: [1, 2]
        }

        const jobList = [{
            "1": { "count": 3, "list": [[2, "Unseen", 1], [1, "Pending", 2]] },
            "2": { "count": 0, "list": [] },
            "3": { "count": 0, "list": [] },
            "code": undefined,
            "count": 3,
            "id": 441,
            "identifierColor": undefined,
            "title": undefined
        },
        {
            "1": { "count": 0, "list": [] },
            "2": { "count": 0, "list": [] },
            "3": { "count": 0, "list": [] },
            "code": undefined,
            "count": 0,
            "id": 442,
            "identifierColor": undefined,
            "title": undefined
        }]
        const expectedActions = [
            {
                type: SET_SUMMARY_FOR_JOBMASTER,
                payload: {
                    jobList
                }
            },
            {
                type: SET_SUMMARY_FOR_RUNSHEET,
                payload: {
                    data
                }
            },
        ]
        
        

        const pendingStatusIds = [12,13]
        const failStatusIds = [14,15]
        const successStatusIds = [16,17] 
        const noNextStatusIds = [18,19]
        
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(jobMasterList)
                                           .mockReturnValue(jobStatusList)
                                           .mockReturnValue(jobSummaryList)
        jobStatusService.getStatusIdsForAllStatusCategory = jest.fn()
        jobStatusService.getStatusIdsForAllStatusCategory.mockReturnValue({pendingStatusIds,noNextStatusIds})
        summaryAndPieChartService.setAllJobMasterSummary = jest.fn()
        summaryAndPieChartService.setAllJobMasterSummary.mockReturnValue(jobList)
        summaryAndPieChartService.getAllRunSheetSummary = jest.fn()
        summaryAndPieChartService.getAllRunSheetSummary.mockReturnValue(data)
        const store = mockStore({})
        return store.dispatch(actions.getDataForJobMasterSummaryAndRunSheetSummary())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(3)
                expect(jobStatusService.getStatusIdsForAllStatusCategory).toHaveBeenCalledTimes(1)
                expect(summaryAndPieChartService.setAllJobMasterSummary).toHaveBeenCalledTimes(1)
                expect(summaryAndPieChartService.getAllRunSheetSummary).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload.jobList)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload.data)
            })
    })
})