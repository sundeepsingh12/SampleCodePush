'use strict'

var actions = require('../jobDetailsActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { NavigationActions } from 'react-navigation'
import { setState, navigateToScene } from '../../global/globalActions'
import { jobDetailsService } from '../../../services/classes/JobDetails'
import { jobMasterService } from '../../../services/classes/JobMaster'
import * as realm from '../../../repositories/realmdb'
import { jobTransactionService } from '../../../services/classes/JobTransaction'
import { performSyncService, pieChartCount } from '../../home/homeActions'
import { fetchJobs } from '../../taskList/taskListActions'
import { jobStatusService } from '../../../services/classes/JobStatus'
import { draftService } from '../../../services/classes/DraftService'
import {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS,
    JOB_STATUS,
    JOB_DETAILS_FETCHING_START,
    JOB_DETAILS_FETCHING_END,
    FormLayout,
    JOB_MASTER,
    TABLE_JOB,
    USER_SUMMARY,
    IS_MISMATCHING_LOCATION,
} from '../../../lib/constants'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

var actions = require('../jobDetailsActions')

import CONFIG from '../../../lib/config'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('jobDetail actions', () => {

    beforeEach(() => {
        jobDetailsService.getJobDetailsParameters = jest.fn()
        jobTransactionService.prepareParticularStatusTransactionDetails = jest.fn()
        jobMasterService.getJobMasterFromJobMasterList = jest.fn()
        jobDetailsService.checkForEnablingStatus = jest.fn()
        jobDetailsService.getParentStatusList = jest.fn()
        draftService.getDraftForState = jest.fn()
        jobStatusService.getStatusCategoryOnStatusId = jest.fn()
      })
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
    const parentList = [
        [1,'ab','PENDING',1], [2,'an','SUCCESS',3]
    ]


    const jobMasterList = {
        value: [
            {
                id: 441,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: false,
                enableResequenceRestriction: false
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
        seqSelected: 2,
        jobTime: null,
        checkForSeenStatus: false
    }
    const jobMaster = [{
        id: 441,
        enableLocationMismatch: false,
        enableManualBroadcast: false,
        enableMultipartAssignment: false,
        enableOutForDelivery: false,
        enableResequenceRestriction: false
    }]
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
    let parentStatusList = []
    const jobDetailsLoading = false
    let draftStatusInfo = {}
    let errorMessage = false
    let isEtaTimerShow = true
    let jobExpiryTime = null
    it('should start fetching jobDetails', () => {
        expect(actions.startFetchingJobDetails()).toEqual({
            type: JOB_DETAILS_FETCHING_START,
        })
    })
    it('should get Job Details with no error message', () => {
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
                    errorMessage,
                    isEtaTimerShow,
                    jobExpiryTime,
                    draftStatusInfo,
                    parentStatusList,
                }
            }
        ]
        jobDetailsService.getJobDetailsParameters.mockReturnValueOnce({statusList,jobMasterList, jobAttributeMasterList, fieldAttributeMasterList,jobAttributeStatusList, fieldAttributeStatusList })
        jobTransactionService.prepareParticularStatusTransactionDetails.mockReturnValueOnce(details)
        jobMasterService.getJobMasterFromJobMasterList.mockReturnValueOnce(jobMaster)
        jobDetailsService.checkForEnablingStatus.mockReturnValueOnce(false);
        jobDetailsService.getParentStatusList.mockReturnValueOnce(parentList)
        jobStatusService.getStatusCategoryOnStatusId.mockReturnValueOnce(1)
        draftService.getDraftForState.mockReturnValueOnce({})
        const store = mockStore({})
        return store.dispatch(actions.getJobDetails(1234))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
        })

        it('should get Job Details with error message for Out For Delivery ', () => {
            const jobMaster = [
                {
                    id: 441,
                    enableLocationMismatch: false,
                    enableManualBroadcast: false,
                    enableMultipartAssignment: false,
                    enableOutForDelivery: true,
                    enableResequenceRestriction: true
                }
            ]
            errorMessage = "Please Scan all Parcels First"
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
                        errorMessage,
                        draftStatusInfo,
                        parentStatusList,
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
    
            jobDetailsService.checkForEnablingStatus = jest.fn()
            jobDetailsService.checkForEnablingStatus.mockReturnValueOnce(errorMessage);
    
            jobMasterService.getJobMasterFromJobMasterList = jest.fn()
            jobMasterService.getJobMasterFromJobMasterList.mockReturnValueOnce(jobMaster)
            const store = mockStore({})
            return store.dispatch(actions.getJobDetails())
                .then(() => {
                    expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                    expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                    expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                })
            })
            it('should get Job Details with error message for enable_resequence_restriction ', () => {
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
                errorMessage = "Please finish previous items first"
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
                            errorMessage,
                            draftStatusInfo,
                            parentStatusList,
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
        
                jobDetailsService.checkForEnablingStatus = jest.fn()
                jobDetailsService.checkForEnablingStatus.mockReturnValueOnce(errorMessage);
        
                jobMasterService.getJobMasterFromJobMasterList = jest.fn()
                jobMasterService.getJobMasterFromJobMasterList.mockReturnValueOnce(jobMaster)
                const store = mockStore({})
                return store.dispatch(actions.getJobDetails())
                    .then(() => {
                        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                        expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                        expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                    })
                })
                it('should get Job Details with error message for job_expiry_time ', () => {
                    const jobMaster = [
                        {
                            id: 441,
                            enableLocationMismatch: false,
                            enableManualBroadcast: false,
                            enableMultipartAssignment: false,
                            enableOutForDelivery: false,
                            enableResequenceRestriction: false
                        }
                    ]
                    errorMessage = 'Job Expired!'
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
                                errorMessage,
                                draftStatusInfo,
                                parentStatusList,
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
            
                    jobDetailsService.checkForEnablingStatus = jest.fn()
                    jobDetailsService.checkForEnablingStatus.mockReturnValueOnce(errorMessage);
            
                    jobMasterService.getJobMasterFromJobMasterList = jest.fn()
                    jobMasterService.getJobMasterFromJobMasterList.mockReturnValueOnce(jobMaster)
                    const store = mockStore({})
                    return store.dispatch(actions.getJobDetails())
                        .then(() => {
                            expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                            expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                            expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                        })
                    })
                    it('should get Job Details with Revert status list', () => {
                        const jobMaster = [
                            {
                                id: 441,
                                enableLocationMismatch: false,
                                enableManualBroadcast: false,
                                enableMultipartAssignment: false,
                                enableOutForDelivery: false,
                                enableResequenceRestriction: false,
                                isStatusRevert: true
                            }
                        ]
                        errorMessage = undefined
                        parentStatusList = [
                                        {
                                        code: "itIs",
                                        id: 16926,
                                        name: "pending",
                                        statusCategory: 1,
                                        },
                                        {
                                        code: "it",
                                        id: 16927,
                                        name: "Intermediate",
                                        statusCategory: 1,
                                        },
                        ]
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
                                    errorMessage,
                                    draftStatusInfo,
                                    parentStatusList,
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
                
                        jobDetailsService.getParentStatusList = jest.fn()
                        jobDetailsService.getParentStatusList.mockReturnValueOnce(parentStatusList);
                
                        jobMasterService.getJobMasterFromJobMasterList = jest.fn()
                        jobMasterService.getJobMasterFromJobMasterList.mockReturnValueOnce(jobMaster)
                        const store = mockStore({})
                        return store.dispatch(actions.getJobDetails())
                            .then(() => {
                                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                            })
                    })
    })


describe('set All data for Revert Status ', () => {
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
    let userSummary = {
        value: {
            hubId: 24629,
            id: 233438,
            lastBattery: 54,
            lastCashCollected: 0,
            lastLat: 28.5555772,
            lastLng: 77.2675903,
        }
    }
    let jobTransaction = {
        id: 4294602,
        latitude: 28.55542,
        longitude: 77.267463
    }
    const expectedActions = [

    ]
    it('should start fetching jobDetails for revert Status', () => {
        expect(actions.startFetchingJobDetails()).toEqual({
            type: JOB_DETAILS_FETCHING_START,
        })
    })
    it('should set all data on revert status', () => {
        try{
            keyValueDBService.getValueFromStore = jest.fn()
            keyValueDBService.getValueFromStore.mockReturnValueOnce(statusList)
    
            jobDetailsService.setAllDataForRevertStatus = jest.fn()
            jobDetailsService.setAllDataForRevertStatus.mockReturnValueOnce({});
    
            jobMasterService.getJobMasterFromJobMasterList = jest.fn()
            jobMasterService.getJobMasterFromJobMasterList.mockReturnValueOnce(jobMaster)
            const store = mockStore({})
            return store.dispatch(actions.setAllDataOnRevert())
                .then(() => {
                    expect(store.getActions()[1].type).toEqual(performSyncService())
                    expect(store.getActions()[2].type).toEqual(pieChartCount())
                    expect(store.getActions()[3].type).toEqual(fetchJobs())
                })
        }catch(error){
            expect(error).toEqual(error)
        }
    })
    
})


describe('check location mismatch actions', () => {
    let jobMasterList = {
        0: {
                id: 3447,
                enableFormLayout: true,
                enableLocationMismatch: true,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: false,
                enableResequenceRestriction: false,
                enabled: true,
                etaUpdateStatus: null,
            },
    }

    let data = {
        contactData: [],
        jobTransaction: {
            id: 3561721,
            jobId: 4294602,
            jobMasterId: 3453,
            jobStatusId: 16905,
            referenceNumber: "NITESH-1510640188486",
        },
        statusList: {
            actionOnStatus: 0,
            buttonColor: "#222f41",
            code: "it",
            id: 16927,
            jobMasterId: 3447,
            name: "Intermediate",
            nextStatusList: [],
            saveActivated: null,
            sequence: 5,
            statusCategory: 3,
            tabId: 2117,
            transient: true,
        }
    }
    let userSummary = {
        value: {
            hubId: 24629,
            id: 233438,
            lastBattery: 54,
            lastCashCollected: 0,
            lastLat: 28.5555772,
            lastLng: 77.2675903,
        }
    }
    let jobTransaction = {
        id: 4294602,
        latitude: 28.55542,
        longitude: 77.267463
    }
    const expectedActions = [

    ]
    it('should not check location mismatch and throw error', () => {
        try{
        jobMasterService.getJobMasterFromJobMasterList = jest.fn()
        jobMasterService.getJobMasterFromJobMasterList.mockReturnValueOnce(jobMasterList)
        const store = mockStore({})
        return store.dispatch(actions.checkForLocationMismatch())
            .then(() => {
                expect(jobMasterService.getJobMasterFromJobMasterList).toHaveBeenCalledTimes(0)
            })
        }catch(error){
            expect(error.message).toEqual(message)
        }
    })
    it('should check location mismatch ', () => {
        try{
        data.jobTransaction.jobMasterId = 3447
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userSummary)
        jobDetailsService.checkLatLong = jest.fn()
        jobDetailsService.checkLatLong.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.checkForLocationMismatch(data, 1))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect( jobDetailsService.checkLatLong).toHaveBeenCalledTimes(1)
            })
        }catch(error){
            expect(error.message).toEqual(message)
        }
    })
})

