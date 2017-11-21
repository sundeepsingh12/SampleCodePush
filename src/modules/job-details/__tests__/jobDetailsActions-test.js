'use strict'

var actions = require('../jobDetailsActions')
import {
    JOB_ATTRIBUTE,
    JOB_MASTER,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    FormLayout
} from '../../../lib/constants'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../../services/classes/JobTransaction'
import { jobMasterService } from '../../../services/classes/JobMaster'
import { jobDetailsService } from '../../../services/classes/JobDetails'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('jobDetail actions', () => {
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
    it('should start fetching jobDetails', () => {
        expect(actions.startFetchingJobDetails()).toEqual({
            type: JOB_DETAILS_FETCHING_START,
        })
    })


    it('should end fetching jobDetails', () => {
        expect(actions.endFetchingJobDetails(jobDataList, fieldDataList, currentStatus, jobTransaction, isEnableRestriction)).toEqual({
            type: JOB_DETAILS_FETCHING_END,
            payload: {
                fieldDataList,
                jobDataList,
                jobTransaction,
                currentStatus,
                isEnableRestriction
            }
        })
    })
    it('should get Job Details', () => {
        const expectedActions = [
            {
                type: JOB_DETAILS_FETCHING_START,
            },
            {
                type: JOB_DETAILS_FETCHING_END,
                payload: {
                    fieldDataList,
                    jobDataList,
                    jobTransaction,
                    currentStatus,
                    isEnableRestriction,
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

        jobDetailsService.checkEnableResequence = jest.fn()
        jobDetailsService.checkEnableResequence(false);

        jobMasterService.getJobMaterFromJobMasterList = jest.fn()
        jobMasterService.getJobMaterFromJobMasterList.mockReturnValueOnce(jobMaster)
        const store = mockStore({})
        return store.dispatch(actions.getJobDetails(1234))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})