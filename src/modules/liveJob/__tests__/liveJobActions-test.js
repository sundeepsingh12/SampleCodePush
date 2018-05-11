'use strict'

import { jobTransactionService } from '../../../services/classes/JobTransaction'
import { NavigationActions } from 'react-navigation'
import { setState, navigateToScene } from '../..//global/globalActions'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { liveJobService } from '../../../services/classes/LiveJobService'
import * as realm from '../../../repositories/realmdb'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_SUMMARY,
    JOB_MASTER,
    END_LIVEJOB_DETAILD_FETCHING,
    SET_LIVE_JOB_LIST,
    TOGGLE_LIVE_JOB_LIST_ITEM,
    START_FETCHING_LIVE_JOB,
    SET_SEARCH,
    TabScreen,
    SET_MESSAGE,
    SET_LIVE_JOB_TOAST,
    HomeTabNavigatorScreen
} from '../../../lib/constants'
import CONFIG from '../../../lib/config'
import thunk from 'redux-thunk'

var actions = require('../liveJobActions')

import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
describe('get job details actions', () => {
    const statusList = {
        value: [
            {
                code: "Success123",
                id: 2416,
                jobMasterId: 441,
                name: "Success",
                saveActivated: null,
                sequence: 3,
                statusCategory: 3,
                tabId: 251,
                transient: false,
            },
            {
                code: "UNSEEN",
                id: 1999,
                jobMasterId: 441,
                name: "Unseen",
                saveActivated: null,
                sequence: 23,
                statusCategory: 1,
                tabId: 251,
                transient: false,
            },
            {
                code: "PENDING",
                id: 1998,
                jobMasterId: 441,
                name: "Pending12",
                saveActivated: null,
                sequence: 23,
                statusCategory: 1,
                tabId: 251,
                transient: false,
            }
        ]
    }

    const fieldAttributeMasterList = {
        value: [
            {
                attributeTypeId: 1,
                id: 7297,
                jobMasterId: 441,
                key: "str121",
                label: "str121",
                parentId: null,
                hidden: false,
                required: true,
            },
            {
                attributeTypeId: 2,
                id: 7299,
                jobMasterId: 441,
                key: "str125",
                label: "str125",
                parentId: 4229,
                hidden: false,
                required: true,
            },
            {
                attributeTypeId: 3,
                id: 7229,
                jobMasterId: 441,
                key: "str1254",
                label: "str1254",
                parentId: null,
                hidden: false,
                required: true,
            },
            {
                attributeTypeId: 4,
                id: 7249,
                jobMasterId: 441,
                key: "str25",
                label: "str25",
                parentId: null,
                hidden: false,
                required: true,
            },
            {
                attributeTypeId: 1,
                id: 7239,
                jobMasterId: 441,
                key: "str5",
                label: "str5",
                parentId: null,
                hidden: false,
                required: true,
            },
        ]
    }

    const jobAttributeMasterList = {
        value: [
            {
                attributeTypeId: 1,
                id: 4297,
                jobMasterId: 441,
                key: "str121",
                label: "str121",
                parentId: null,
                required: true,
                sequence: 17,
            },
            {
                attributeTypeId: 2,
                id: 4299,
                jobMasterId: 441,
                key: "str125",
                label: "str125",
                parentId: 4229,
                required: true,
                sequence: 18,
            },
            {
                attributeTypeId: 3,
                id: 4229,
                jobMasterId: 441,
                key: "str1254",
                label: "str1254",
                parentId: null,
                required: true,
                sequence: 14,
            },
            {
                attributeTypeId: 1,
                id: 4249,
                jobMasterId: 441,
                key: "str25",
                label: "str25",
                parentId: null,
                required: true,
                sequence: 13,
            },
            {
                attributeTypeId: 1,
                id: 4142,
                jobMasterId: 441,
                key: "str5",
                label: "str5",
                parentId: null,
                required: true,
                sequence: 1,
            },
        ]
    }
    const jobAttributeStatusList = {
        value: [
            {
                id: 34,
                jobAttributeId: 4142,
                sequence: 1,
                statusId: 1999,
            }
        ]
    }

    const fieldAttributeStatusList = {
        value: [
            {
                fieldAttributeId: 7249,
                id: 12887,
                sequence: 1,
                statusId: 1999,
            },
            {
                fieldAttributeId: 7229,
                id: 12888,
                sequence: 2,
                statusId: 1999,
            },
            {
                fieldAttributeId: 7239,
                id: 12889,
                sequence: 3,
                statusId: 1999,
            }
        ]
    }
    const jobMaster = [
        {
            id: 441,
            enableLocationMismatch: false,
            enableManualBroadcast: false,
            enableMultipartAssignment: false,
            enableOutForDelivery: false,
            enableResequenceRestriction: true
        }
    ]


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
    const details = {
        currentStatus: {
            actionOnStatus: 0,
            buttonColor: "#222f41",
            code: "PENDING",
            id: 1998,
            jobMasterId: 441,
            name: "Pending12",
            saveActivated: null,
            sequence: 23,
            statusCategory: 1,
            tabId: 251,
            transient: false,
        },
        fieldDataObject: {
            autoIncrementId: 0,
            dataList: [],
            dataMap: {},
        },
        jobDataObject: {
            autoIncrementId: 10,
            dataList: [],
            dataMap: {},
        },
        jobTransactionDisplay: {
            id: 6038713,
            jobId: 134724,
            jobMasterId: 441,
            jobStatusId: 1998,
            referenceNumber: "ZOMATO-1511121784686",
        },
        seqSelected: 2
    }

    const jobDataList = []
    const fieldDataList = []
    const currentStatus = {
        "actionOnStatus": 0,
        "buttonColor": "#222f41",
        "code": "PENDING",
        "id": 1998,
        "jobMasterId": 441,
        "name": "Pending12",
        "saveActivated": null,
        "sequence": 23,
        "statusCategory": 1,
        "tabId": 251,
        "transient": false
    }
    const jobTransaction = {
        "id": 6038713,
        "jobId": 134724,
        "jobMasterId": 441,
        "jobStatusId": 1998,
        "referenceNumber": "ZOMATO-1511121784686"
    }
    const isEnableRestriction = undefined
    const jobDetailsLoading = false

    it('should end fetching jobDetails', () => {
        expect(actions.endFetchingJobDetails(jobDataList, currentStatus, jobTransaction)).toEqual({
            type: END_LIVEJOB_DETAILD_FETCHING,
            payload: {
                jobDataList,
                currentStatus,
                jobTransaction,
            }
        })
    })
    it('should get Job Details', () => {
        const expectedActions = [
            {
                type: SET_MESSAGE,
                payload: ''
            },
            {
                type: END_LIVEJOB_DETAILD_FETCHING,
                payload: {
                    jobDataList,
                    jobTransaction,
                    currentStatus,
                }
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(statusList)
            .mockReturnValueOnce(jobAttributeMasterList)
            .mockReturnValueOnce(fieldAttributeMasterList)
            .mockReturnValueOnce(jobAttributeStatusList)
            .mockReturnValueOnce(fieldAttributeStatusList)
            .mockReturnValueOnce(jobMasterList)

        jobTransactionService.prepareParticularStatusTransactionDetails = jest.fn()
        jobTransactionService.prepareParticularStatusTransactionDetails.mockReturnValueOnce(details)
        const store = mockStore({})
        return store.dispatch(actions.getJobDetails(1234))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(jobTransactionService.prepareParticularStatusTransactionDetails).toHaveBeenCalled()
                expect(store.getActions()[2].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('test for fetchAllLiveJobsList', () => {
    const liveJobList = 'test'
    const expectedActions = [
        {
            type: START_FETCHING_LIVE_JOB,
            payload: true
        },
        {
            type: SET_LIVE_JOB_LIST,
            payload: liveJobList
        },
    ]
    it('should set live job list', () => {
        liveJobService.getLiveJobList = jest.fn()
        liveJobService.getLiveJobList.mockReturnValue(liveJobList);
        const store = mockStore({})
        return store.dispatch(actions.fetchAllLiveJobsList())
            .then(() => {
                expect(liveJobService.getLiveJobList).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('test for toggleLiveJobSelection', () => {

    it('should set live job list', () => {
        let jobId = 0
        let allJobs = {
            0: {
                jobTransactionCustomization: { isChecked: false }
            }
        }
        let jobTransactions = {
            0: {
                jobTransactionCustomization: { isChecked: true }
            }
        }
        const selectedItems = []

        const expectedActions = [
            {
                type: TOGGLE_LIVE_JOB_LIST_ITEM,
                payload: {
                    selectedItems,
                    jobTransactions
                }
            }
        ]
        liveJobService.getSelectedJobIds = jest.fn()
        liveJobService.getSelectedJobIds.mockReturnValue(selectedItems);
        const store = mockStore({})
        return store.dispatch(actions.toggleLiveJobSelection(jobId, allJobs))
            .then(() => {
                expect(liveJobService.getSelectedJobIds).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should throw error', () => {
        let jobId = 0
        let allJobs = {
            0: {
                
            }
        }
        let jobTransactions = {
            0: {

            }
        }
        const selectedItems = []

        const expectedActions = [
            {
                type: TOGGLE_LIVE_JOB_LIST_ITEM,
                payload: {
                    selectedItems,
                    jobTransactions
                }
            }
        ]
        liveJobService.getSelectedJobIds = jest.fn()
        liveJobService.getSelectedJobIds.mockReturnValue(selectedItems);
        const store = mockStore({})
        return store.dispatch(actions.toggleLiveJobSelection(jobId, allJobs))
            .then(() => {
            })
    })
})

describe('test for acceptOrRejectMultiple', () => {
    const token = 'token'
    let jobId = 0
    const status = 1
    const selectedItems = []
    const liveJobList = {
        newLiveJobList: [],
        toastMessage: 'test'
    }

    const expectedActions = [
        {
            type: SET_LIVE_JOB_LIST,
            payload: liveJobList.newLiveJobList
        }
    ]
    it('should set new live job list', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(token)
        liveJobService.requestServerForApprovalForMultiple = jest.fn()
        liveJobService.requestServerForApprovalForMultiple.mockReturnValue(liveJobList);
        const store = mockStore({})
        return store.dispatch(actions.acceptOrRejectMultiple(status, selectedItems, liveJobList))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(liveJobService.requestServerForApprovalForMultiple).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for deleteExpiredJob', () => {
    let jobId = 0
    const liveJobList = []

    const expectedActions = [
        {
            type: SET_LIVE_JOB_LIST,
            payload: liveJobList
        }
    ]
    it('should set new live job list', () => {
        liveJobService.deleteJob = jest.fn()
        liveJobService.deleteJob.mockReturnValue(liveJobList);
        const store = mockStore({})
        return store.dispatch(actions.deleteExpiredJob([jobId], liveJobList))
            .then(() => {
                expect(liveJobService.deleteJob).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for selectNone', () => {
    it('should unselect all transactions', () => {
        const liveJobList = {
            1: {
                id: 1,
                jobTransactionCustomization: {
                    isChecked: true
                }

            }
        }
        const selectedJobs = {
            1: {
                id: 1,
                jobTransactionCustomization: {
                    isChecked: false
                }

            }
        }

        const selectedItems = []
        const expectedActions = [
            {
                type: TOGGLE_LIVE_JOB_LIST_ITEM,
                payload: {
                    selectedItems,
                    jobTransactions: selectedJobs
                }
            }
        ]
        const result = {
            selectedItems,
            jobTransactions: selectedJobs
        }
        const store = mockStore({})
        return store.dispatch(actions.selectNone(liveJobList))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})
describe('test for selectAll', () => {
    it('should select all transactions', () => {
        const liveJobList = {
            1: {
                id: 1,
                jobTransactionCustomization: {
                    isChecked: false
                }

            }
        }
        const selectedJobs = {
            1: {
                id: 1,
                jobTransactionCustomization: {
                    isChecked: true
                }

            }
        }

        const selectedItems = ['1']
        const expectedActions = [
            {
                type: TOGGLE_LIVE_JOB_LIST_ITEM,
                payload: {
                    selectedItems,
                    jobTransactions: selectedJobs
                }
            }
        ]
        const result = {
            selectedItems,
            jobTransactions: selectedJobs
        }
        const store = mockStore({})
        return store.dispatch(actions.selectAll(liveJobList))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})
describe('test for acceptOrRejectJob', () => {
    it('should accept single job', () => {
        const token = 'token'
        let job = {
            id: 1
        }
        const status = 1
        const selectedItems = []
        const liveJobList = {
            newLiveJobList: [],
            toastMessage: 'Something went wrong,try again'
        }

        const expectedActions = [
            {
                type: SET_MESSAGE,
                payload: liveJobList.toastMessage
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(token)
        liveJobService.requestServerForApproval = jest.fn()
        liveJobService.requestServerForApproval.mockReturnValue(liveJobList);
        const store = mockStore({})
        return store.dispatch(actions.acceptOrRejectJob(status, job, []))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(liveJobService.requestServerForApproval).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                // expect(NavigationActions.reset).toHaveBeenCalledTimes(1)
            })
    })
    it('should reject single job', () => {
        const token = 'token'
        let job = {
            id: 1
        }
        const status = 2
        const selectedItems = []
        const liveJobList = {
            newLiveJobList: [],
            toastMessage: 'Something went wrong,try again'
        }

        const expectedActions = [
            {
                type: SET_MESSAGE,
                payload: liveJobList.toastMessage
            }
        ]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(token)
        liveJobService.requestServerForApproval = jest.fn()
        liveJobService.requestServerForApproval.mockReturnValue(liveJobList);
        const store = mockStore({})
        return store.dispatch(actions.acceptOrRejectJob(status, job, []))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(liveJobService.requestServerForApproval).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})