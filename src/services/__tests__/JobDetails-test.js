'use strict'

import { jobDetailsService } from '../classes/JobDetails'
import { jobTransactionService } from '../classes/JobTransaction'
import * as realm from '../../repositories/realmdb'
import { jobStatusService } from '../classes/JobStatus'
import { TABLE_JOB_TRANSACTION, TABLE_JOB } from '../../lib/constants'
import { formLayoutEventsInterface } from '../classes/formLayout/FormLayoutEventInterface'
import moment from 'moment'
import { keyValueDBService } from '../classes/KeyValueDBService'
import { geoFencingService } from '../classes/GeoFencingService'
import { draftService } from '../classes/DraftService'


describe('test cases for check out for delivery', () => { //checkOutForDelivery(jobMasterList)
    beforeEach(() => {
        jobStatusService.getjobMasterIdStatusIdMap = jest.fn()
        jobTransactionService.getJobTransactionsForStatusIds = jest.fn()
    })
    const jobMasterList = {
        value: [
            {
                id: 441,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: true,
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
    let jobTransactionId = 123
    let unseenTransactionList = [
        {
            code: "Success123",
            id: 2416,
            jobMasterId: 441,
        },
        {
            code: "Success121",
            id: 2417,
            jobMasterId: 441,
        },
    ]
    let jobMasterIdStatusIdMap = {
        '441': '1999',
        '442': '2000'
    }
    let message = "Please Scan all Parcels First"
    let parentStatusList = []
    it('should check for out for delivery and return message', () => {
        jobStatusService.getjobMasterIdStatusIdMap.mockReturnValueOnce(jobMasterIdStatusIdMap)
        jobTransactionService.getJobTransactionsForStatusIds.mockReturnValueOnce(unseenTransactionList)
        expect(jobDetailsService.checkOutForDelivery(jobMasterList,statusList)).toEqual(message)
    })
    it('should check for out for delivery and return false', () => {
        unseenTransactionList = []
        jobStatusService.getjobMasterIdStatusIdMap.mockReturnValueOnce(jobMasterIdStatusIdMap)
        jobTransactionService.getJobTransactionsForStatusIds.mockReturnValueOnce(unseenTransactionList)
        expect(jobDetailsService.checkOutForDelivery(jobMasterList,statusList)).toEqual(false)
    })
})

describe('test cases for checkEnableRestriction', () => {
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

    const tabId = 251
    const seqSelected = 2
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
    let firstEnableSequenceTransaction = {
        id: 3447,
        seqSelected: 1
    }
    let jobTransactionId = 3446
    let message = "Please finish previous items first"
    it('should check enable resequence if sequence is before', () => {
        jobTransactionService.getFirstTransactionWithEnableSequence = jest.fn()
        jobTransactionService.getFirstTransactionWithEnableSequence.mockReturnValue(firstEnableSequenceTransaction)
        expect(jobDetailsService.checkEnableResequence(jobMasterList, tabId, seqSelected, statusList, jobTransactionId)).toEqual(message)
    })

    it('should check enable resequence if sequence is after', () => {
        firstEnableSequenceTransaction.seqSelected = 3
        jobTransactionService.getFirstTransactionWithEnableSequence = jest.fn()
        jobTransactionService.getFirstTransactionWithEnableSequence.mockReturnValue(firstEnableSequenceTransaction)
        expect(jobDetailsService.checkEnableResequence(jobMasterList, tabId, seqSelected, statusList, jobTransactionId)).toEqual(false)
    })
})

describe('test cases for checkJobExpiryTime', () => {
    const result = "Job Expired!"
    const dataList = {
        '4748': {
            'data': {
                id: 4477616,
                jobAttributeMasterId: 4748,
                jobId: 134814,
                parentId: 0,
                positionId: 2,
                value: "2017-11-22 00:51:00",
            },
            label: "jobTime",
            sequence: 3
        }

    }
    it('should check whether jobExpire or not', () => {
        expect(jobDetailsService.checkJobExpire(dataList)).toEqual(result)
    })

})

describe('test cases for check for enabling status', () => {   // checkForEnablingStatus(enableOutForDelivery, enableResequenceRestriction, jobTime, jobMasterList, tabId, seqSelected, statusList, jobTransactionId)
    beforeEach(() => {
        jobDetailsService.checkOutForDelivery = jest.fn()
        jobDetailsService.checkEnableResequence = jest.fn()
        jobDetailsService.checkJobExpire = jest.fn()
    })
    let enableOutForDelivery = true
    let enableResequenceRestriction = true
    let jobTime = "2018-11-22 00:51:00"
    const jobMasterList = {
        value: [
            {
                id: 441,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: true,
                enableResequenceRestriction: true
            },
            {
                id: 442,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: true,
                enableResequenceRestriction: false
            }
        ]
    }
    let tabId = 123
    let seqSelected = 3
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
    let jobTransactionId = 123
    it('should return message for outForDelivery enabled', () => {
        let message = "Please Scan all Parcels First"
        jobDetailsService.checkOutForDelivery.mockReturnValueOnce(message)
        expect(jobDetailsService.checkForEnablingStatus(true)).toEqual(message)
    })
    it('should return message for enableResequence enabled', () => {
        let message = "Please finish previous items first"
        jobDetailsService.checkEnableResequence.mockReturnValueOnce(message)
        expect(jobDetailsService.checkForEnablingStatus(false,true)).toEqual(message)
    })
    it('should return message for jobExpired', () => {
        let message = "Job Expired!"
        jobDetailsService.checkJobExpire.mockReturnValueOnce(message)
        expect(jobDetailsService.checkForEnablingStatus(false,false,true)).toEqual(message)

    })
})

describe('test cases for prepareDataObject', () => {
    const realmDBDataList = [
        {
            id: 0,
            jobAttributeMasterId: 1,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 0,
            positionId: 1,
            value: 'xyz',
        },
        {
            id: 1,
            jobAttributeMasterId: 2,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 0,
            positionId: 2,
            value: 91727217123,
        },
        {
            id: 2,
            jobAttributeMasterId: 3,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 0,
            positionId: 3,
            value: 62,
        },
        {
            id: 3,
            jobAttributeMasterId: 4,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 0,
            positionId: 4,
            value: 'address line 1',
        },
        {
            id: 4,
            jobAttributeMasterId: 5,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 0,
            positionId: 5,
            value: 'abc',
        },
        {
            id: 5,
            jobAttributeMasterId: 6,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 0,
            positionId: 6,
            value: 'ArraySarojFareye',
        },
        {
            id: 6,
            jobAttributeMasterId: 7,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 6,
            positionId: 7,
            value: 'ObjectSarojFareye',
        },
        {
            id: 7,
            jobAttributeMasterId: 8,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 7,
            positionId: 8,
            value: 'test11',
        },
        {
            id: 8,
            jobAttributeMasterId: 9,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 7,
            positionId: 9,
            value: 'test12',
        },
        {
            id: 9,
            jobAttributeMasterId: 10,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 7,
            positionId: 10,
            value: 'test13',
        },
        {
            id: 10,
            jobAttributeMasterId: 7,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 6,
            positionId: 11,
            value: 'ObjectSarojFareye',
        },
        {
            id: 11,
            jobAttributeMasterId: 8,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 11,
            positionId: 12,
            value: 'test21',
        },
        {
            id: 12,
            jobAttributeMasterId: 9,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 11,
            positionId: 13,
            value: 'test22',
        },
        {
            id: 13,
            jobAttributeMasterId: 10,
            jobId: 1,
            jobTransactionId: 1,
            parentId: 11,
            positionId: 14,
            value: 'test23',
        },
    ]
    let id = 1
    const attributeMasterMap = {
        1: {
            attributeTypeId: 1,
            hidden: false,
            id: 1,
            label: 'name',
        },
        2: {
            attributeTypeId: 2,
            hidden: false,
            id: 2,
            label: 'number',
        },
        3: {
            attributeTypeId: 3,
            hidden: true,
            id: 3,
            label: 'num',
        },
        4: {
            attributeTypeId: 4,
            hidden: false,
            id: 4,
            label: 'address',
        },
        5: {
            attributeTypeId: 5,
            hidden: true,
            id: 5,
            label: 'text',
        },
        6: {
            attributeTypeId: 6,
            hidden: false,
            id: 6,
            label: 'array',
        },
        7: {
            attributeTypeId: 7,
            hidden: false,
            id: 7,
            label: 'object',
        },
        8: {
            attributeTypeId: 8,
            hidden: false,
            id: 8,
            label: 'text1',
        },
        9: {
            attributeTypeId: 9,
            hidden: true,
            id: 9,
            label: 'text2',
        },
        10: {
            attributeTypeId: 10,
            hidden: false,
            id: 10,
            label: 'text3',
        }
    }

    const attributeMap = {
        1: {
            jobAttributeId: 1,
            id: 1,
            sequence: 1,
        },
        2: {
            jobAttributeId: 2,
            id: 2,
            sequence: 2,
        },
        3: {
            jobAttributeId: 3,
            id: 3,
            sequence: 3,
        },
        4: {
            jobAttributeId: 4,
            id: 4,
            sequence: 4,
        },
        5: {
            jobAttributeId: 5,
            id: 5,
            sequence: 5,
        },
        6: {
            jobAttributeId: 6,
            id: 6,
            sequence: 6,
        },
        7: {
            jobAttributeId: 7,
            id: 7,
            sequence: 7,
        },
        8: {
            jobAttributeId: 8,
            id: 8,
            sequence: 8,
        },
        9: {
            jobAttributeId: 9,
            id: 9,
            sequence: 9,
        },
        10: {
            jobAttributeId: 10,
            id: 10,
            sequence: 10,
        }
    }

    it('should prepare Data object for jobId and contains object as a type', () => {
        const jobDataListForObject = {
            "autoIncrementId": 2,
            "dataList":
                {
                    "10":
                        {
                            "attributeTypeId": 10,
                            "data":
                                {
                                    "id": 13,
                                    "jobAttributeMasterId": 10,
                                    "jobId": 1,
                                    "jobTransactionId": 1,
                                    "parentId": 11,
                                    "positionId": 14,
                                    "value": "test23"
                                }, "id": 2,
                            "label": "text3",
                            "sequence": 10
                        }, "8":
                        {
                            "attributeTypeId": 8,
                            "data":
                                {
                                    "id": 11,
                                    "jobAttributeMasterId": 8,
                                    "jobId": 1,
                                    "jobTransactionId": 1,
                                    "parentId": 11,
                                    "positionId": 12,
                                    "value": "test21"
                                },
                            "id": 1,
                            "label":
                                "text1",
                            "sequence": 8
                        }
                }, "dataMap":
                {
                    "10":
                        {
                            "10":
                                {
                                    "data":
                                        {
                                            "id": 13,
                                            "jobAttributeMasterId": 10,
                                            "jobId": 1,
                                            "jobTransactionId": 1,
                                            "parentId": 11,
                                            "positionId": 14,
                                            "value": "test23"
                                        }, "label": "text3",
                                    "sequence": 10
                                }
                        },
                    "8": {
                        "8":
                            {
                                "data":
                                    {
                                        "id": 11,
                                        "jobAttributeMasterId": 8,
                                        "jobId": 1,
                                        "jobTransactionId": 1,
                                        "parentId": 11,
                                        "positionId": 12,
                                        "value": "test21"
                                    }, "label": "text1",
                                "sequence": 8
                            }
                    }
                }
        }
        expect(jobDetailsService.prepareDataObject(id, 11, realmDBDataList, attributeMasterMap, attributeMap, true, 0, true)).toEqual(jobDataListForObject)
    })
    it('should prepare Data object for jobId and contains array as a type', () => {
        const jobDataListForArray = {
            "autoIncrementId": 2,
            "dataList": [{
                "attributeTypeId": 8, "data":
                    {
                        "id": 11, "jobAttributeMasterId": 8, "jobId": 1,
                        "jobTransactionId": 1, "parentId": 11, "positionId": 12, "value": "test21"
                    },
                "id": 1, "label": "text1", "sequence": 8
            }, {
                "attributeTypeId": 10,
                "data": {
                    "id": 13, "jobAttributeMasterId": 10, "jobId": 1, "jobTransactionId": 1,
                    "parentId": 11, "positionId": 14, "value": "test23"
                },
                "id": 2, "label": "text3", "sequence": 10
            }],
            "dataMap": {
                "10": {
                    "10": {
                        "data": {
                            "id": 13,
                            "jobAttributeMasterId": 10, "jobId": 1, "jobTransactionId": 1,
                            "parentId": 11, "positionId": 14, "value": "test23"
                        }, "label":
                            "text3", "sequence": 10
                    }
                },
                "8": {
                    "8": {
                        "data": {
                            "id": 11, "jobAttributeMasterId": 8,
                            "jobId": 1, "jobTransactionId": 1, "parentId": 11,
                            "positionId": 12, "value": "test21"
                        }, "label": "text1",
                        "sequence": 8
                    }
                }
            }
        }

        expect(jobDetailsService.prepareDataObject(id, 11, realmDBDataList, attributeMasterMap, attributeMap, true, 0, false)).toEqual(jobDataListForArray)
    })
    it('should prepare Data object for jobTransaction and contains object as a type', () => {
        const jobTransactionDataListForObject =  {"autoIncrementId": 0, "dataList": {}, "dataMap": {}}
        expect(jobDetailsService.prepareDataObject(id, 11, realmDBDataList, attributeMasterMap, attributeMap, false, 0, true)).toEqual(jobTransactionDataListForObject)
    
    })
    it('should prepare Data object for jobTransaction and contains array as a type', () => {
        const jobTransactionDataListForArray =  {"autoIncrementId": 0, "dataList": [], "dataMap": {}}
        expect(jobDetailsService.prepareDataObject(id, 11, realmDBDataList, attributeMasterMap, attributeMap, false, 0, false)).toEqual(jobTransactionDataListForArray)
    
    })
})

describe('test cases for check Latitude and longitude', () => { //checkLocationMismatch
    const angle = "28.2554334", radianValue = 0.493150344407976
    let jobTransaction = {
        id: 3447,
        latitude: 28.55542,
        longitude: 77.267463
    }
    let jobTransactionList = [{
        id: 3447,
        latitude: 28.55542,
        longitude: 77.267463
    }]
    let jobId = 3447, userLat = "28.5551", userLong = "77.26751"
    it('should find aerial distance between user and job location', () => {
        const dist = 0.03587552758583335
        expect(geoFencingService.distance(jobTransaction.latitude, jobTransaction.longitude, userLat, userLong)).toEqual(dist)
    })

    it('should check aerial distance between user and job location and return false', () => {
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValueOnce(jobTransactionList)
        expect(jobDetailsService.checkLatLong(jobId, null, userLong)).toEqual(false)
    })

    it('should not check aerial distance between user and job location', () => {
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue([{
            id: 3447,
            latitude: 58.5551,
            longitude: 77.26751
        }])
        const dist = 0.53587552758583335
        geoFencingService.distance = jest.fn()
        geoFencingService.distance.mockReturnValueOnce(dist)
        expect(jobDetailsService.checkLatLong(jobId, userLat, userLong)).toEqual(true)
    })
})

describe('test cases for get parentStatusList on status Revert', () => { //getParentStatusList(statusList,currentStatus,jobTransactionId)
    beforeEach(() => {
        jobTransactionService.checkIdToBeSync = jest.fn()
    })
    const statusList = {
        value: [
            {
                code: "Success123",
                id: 2416,
                jobMasterId: 441,
                name: "Success",
                saveActivated: null,
                nextStatusList: [],
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
                nextStatusList: [],
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
                nextStatusList: [{
                    id: 2416,
                    jobMasterId: 441,
                    code: 'Success123',
                    name: 'Success'
                }, {
                    id: 1999,
                    jobMasterId: 441,
                    code: 'Unseen',
                    name: 'Unseen'
                }
                ],
                statusCategory: 1,
                tabId: 251,
                transient: false,
            }
        ]
    }
    let jobTransactionId = 123
    let currentStatus = {
        code: "Success123",
        id: 2416,
        jobMasterId: 441,
        name: "Success",
        saveActivated: null,
        nextStatusList: [],
        sequence: 3,
        statusCategory: 3,
        tabId: 251,
        transient: false,
    }
    let parentStatusList = []
    it('should get parentStatusList for current Status', () => {

        jobTransactionService.checkIdToBeSync.mockReturnValueOnce(false)
        return jobDetailsService.getParentStatusList(statusList, currentStatus, jobTransactionId)
            .then((statusList) => {
                expect(jobTransactionService.checkIdToBeSync).toHaveBeenCalledTimes(1)
                expect(statusList).toEqual([])
            })
            .catch((error) => {
                expect(error).toEqual(error)
                expect(jobTransactionService.checkIdToBeSync).toHaveBeenCalledTimes(0)
            })
    })
})


describe('test cases for updateTransaction on revert status', () => { //updateTransactionOnRevert(jobTransactionData,previousStatus)

    let jobTransaction = {
        id: 3447,
        latitude: 28.55542,
        longitude: 77.267463
    }
    let previousStatus = [123, '', 'Success']
    let updateTransaction = [{
        id: 3447,
        latitude: 28.55542,
        longitude: 77.267463,
        jobStatusId: 123,
        statusCode: 'Success',
        actualAmount: 0.00,
        originalAmount: 0.00,
        lastUpdatedAtServer: moment().format('YYYY-MM-DD HH:mm:ss'),

    }]
    let data = {
        tableName: TABLE_JOB_TRANSACTION,
        value: updateTransaction
    }
    let jobId = 3447, userLat = "28.5551", userLong = "77.26751"
    it('should update transaction on revert status', () => {
        expect(jobDetailsService.updateTransactionOnRevert(jobTransaction, previousStatus)).toEqual(data)
    })
})


describe('test cases for set All data for revert status', () => {   // setAllDataForRevertStatus(statusList,jobTransaction,previousStatus)
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        formLayoutEventsInterface._updateJobSummary = jest.fn()
        formLayoutEventsInterface._updateTransactionLogs = jest.fn()
        formLayoutEventsInterface._updateRunsheetSummary = jest.fn()
        jobDetailsService.updateTransactionOnRevert = jest.fn()
        formLayoutEventsInterface.addTransactionsToSyncList = jest.fn()
        realm.performBatchSave = jest.fn()
    })
    let tabId = 123
    let seqSelected = 3
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
    let jobTransaction = {
        id: 3447,
        latitude: 28.55542,
        longitude: 77.267463
    }
    let userSummary = {
        value: {
            lastLat: 28.55542,
            lastLong: 77.267463
        }
    }
    let jobData = [{
        id: 12,
        status: 2,
        actiononStatus: 0
    }]
    let updatedJobDb = {
        tableName: TABLE_JOB,
        value: jobData
    }
    let updateTransaction = [{
        id: 3447,
        latitude: 28.55542,
        longitude: 77.267463,
        jobStatusId: 123,
        statusCode: 'Success',
        actualAmount: 0.00,
        originalAmount: 0.00,
        lastUpdatedAtServer: moment().format('YYYY-MM-DD HH:mm:ss'),

    }]
    let transactionLogs = [{
        userId: 1,
        transactionId: 1,
        jobMasterId: 1,
    },
    {
        userId: 1,
        transactionId: 2,
        jobMasterId: 2,
    },
    {
        userId: 2,
        transactionId: 3,
        jobMasterId: 3,
    },
]
    let data = {
        tableName: TABLE_JOB_TRANSACTION,
        value: updateTransaction
    }
    let previousStatus = [123, 'pending', 'Pending', 1]
    it('should update dataBase on revert status and set all data', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce(userSummary)
        formLayoutEventsInterface._setJobDbValues(updatedJobDb)
        jobDetailsService.updateTransactionOnRevert.mockReturnValueOnce(data)
        formLayoutEventsInterface._updateTransactionLogs.mockReturnValueOnce(transactionLogs)
        return jobDetailsService.setAllDataForRevertStatus(statusList, jobTransaction, previousStatus)
            .then(() => {
                expect(jobDetailsService.updateTransactionOnRevert).toHaveBeenCalledTimes(1)
                expect(formLayoutEventsInterface._updateTransactionLogs).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(formLayoutEventsInterface._updateRunsheetSummary).toHaveBeenCalledTimes(1)
                expect(formLayoutEventsInterface._updateJobSummary).toHaveBeenCalledTimes(1)
                expect(formLayoutEventsInterface.addTransactionsToSyncList).toHaveBeenCalledTimes(1)
                expect(realm.performBatchSave).toHaveBeenCalledTimes(1)
                expect(draftService.deleteDraftFromDb).toHaveBeenCalledTimes(1)
            })
            .catch((error) => {
                expect(error).toEqual(error)
            })
    })
})

describe('test cases for get all jobDetails parameters', () => {   // setAllDataForRevertStatus(statusList,jobTransaction,previousStatus)
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
    })
    let tabId = 123
    let seqSelected = 3
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
    const jobAttributeMasterList = {
        value: [
            {
                key: "Success123",
                id: 2416,
                jobMasterId: 441,
            },
            {
                key: "UNSEEN",
                id: 1999,
                jobMasterId: 441,
            },
            {
                key: "PENDING",
                id: 1998,
                jobMasterId: 441,
            }
        ]
    }
    const fieldAttributeMasterList = {
        value: [
            {
                key: "Success123",
                id: 2416,
                jobMasterId: 441,
                fieldAttributeMasterId: 1
            },
            {
                key: "UNSEEN",
                id: 1999,
                jobMasterId: 441,
                fieldAttributeMasterId: 2
            },
            {
                key: "PENDING",
                id: 1998,
                jobMasterId: 441,
                fieldAttributeMasterId: 3
            }
        ]
    }
    const jobAttributeStatusList = {
        value: [
            {
                id: 2416,
                statusId: 441,
                jobAttributeId: 1
            },
            {
                id: 1999,
                statusId: 441,
                jobAttributeId: 2
            },
            {
                id: 1998,
                statusId: 441,
                jobAttributeId: 3
            }
        ]
    }

    const fieldAttributeStatusList = {
        value: [
            {
                id: 2416,
                statusId: 441,
                fieldAttributeId: 1
            },
            {
                id: 1999,
                statusId: 441,
                fieldAttributeId: 2
            },
            {
                id: 1998,
                statusId: 441,
                fieldAttributeId: 3
            }
        ]
    }

    const jobMasterList = {
        value: [
            {
                id: 441,
                enableLocationMismatch: false,
                enableManualBroadcast: false,
                enableMultipartAssignment: false,
                enableOutForDelivery: true,
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
    it('should get parameters for jobDetails', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce(statusList)
            .mockReturnValueOnce(jobMasterList)
            .mockReturnValueOnce(jobAttributeMasterList)
            .mockReturnValueOnce(fieldAttributeMasterList)
            .mockReturnValueOnce(jobAttributeStatusList)
            .mockReturnValueOnce(fieldAttributeStatusList)
        return jobDetailsService.getJobDetailsParameters()
            .then((data) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(6)
                expect(data).toEqual({ statusList, jobMasterList, jobAttributeMasterList, fieldAttributeMasterList, jobAttributeStatusList, fieldAttributeStatusList })
            })
            .catch((error) => {
                expect(error).toEqual(error)
            })
    })
})