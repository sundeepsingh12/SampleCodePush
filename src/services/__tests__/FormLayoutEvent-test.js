'use strict'

import sha256 from 'sha256';
import { restAPI } from '../../lib/RestAPI';
import { ON_BLUR, TABLE_FIELD_DATA, TABLE_RUNSHEET, NEXT_FOCUS, TABLE_JOB } from '../../lib/constants';
import * as realm from '../../repositories/realmdb';
import { jobStatusService } from '../classes/JobStatus';
import { keyValueDBService } from '../classes/KeyValueDBService';
import { formLayoutEventsInterface } from '../classes/formLayout/FormLayoutEventInterface';
import FormLayoutEventImpl from '../classes/formLayout/formLayoutEventImpl';
import RestAPIFactory from '../../lib/RestAPIFactory'
import moment from 'moment'

describe('save events implementation', () => {
    let formLayoutMap = new Map()
    formLayoutMap.set(1, {
        label: "rr",
        subLabel: "d",
        helpText: "d",
        key: "d",
        required: true,
        hidden: false,
        attributeTypeId: 1,
        fieldAttributeMasterId: 1,
        positionId: 0,
        parentId: 0,
        showHelpText: false,
        editable: false,
        focus: true,
        validation: []

    }).set(2, {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "dd",
        required: false,
        hidden: true,
        attributeTypeId: 1,
        fieldAttributeMasterId: 1,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: []
    });
    it('should disable save if required with save disabled', () => {
        expect(formLayoutEventsInterface.disableSaveIfRequired(1, true, formLayoutMap, "dd")).toEqual(true);
    })

    it('should disable save if required without save disabled', () => {
        expect(formLayoutEventsInterface.disableSaveIfRequired(1, false, formLayoutMap, "dd")).toEqual(true);
    })

    it('should disable save if required without save disabled and not required element', () => {
        expect(formLayoutEventsInterface.disableSaveIfRequired(2, false, formLayoutMap, "dd")).toEqual(false);
    })

    it('should disable save if required with save disabled and not required element', () => {
        expect(formLayoutEventsInterface.disableSaveIfRequired(2, true, formLayoutMap, "dd")).toEqual(true);
    })

})

describe('test for _setJobTransactionValues', () => {

    let id = 1,
        status = { id: 1, code: 1 },
        jobMaster = { id: 1, code: 1 },
        user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
        hub = { id: 1, code: 1 },
        imei = {
            imeiNumber: 1
        },
        currentTime = '12:10:10',
        lastTrackLog = {
            latitude: 0,
            longitude: 0
        },
        trackBattery = {
            value: 1
        }
    it('should return job transaction', () => {
        let time = moment().valueOf()
        let jobTransactionList = [{
            id: 1,
            referenceNumber: 1,
            jobId: 1
        }]
        let jobTransaction = {}
        jobTransaction.id = 1
        jobTransaction.jobId = 1
        jobTransaction.referenceNumber = 1
        jobTransaction.jobType = jobMaster.code
        jobTransaction.jobStatusId = status.id
        jobTransaction.statusCode = status.code
        jobTransaction.employeeCode = user.employeeCode
        jobTransaction.hubCode = hub.code
        jobTransaction.lastTransactionTimeOnMobile = currentTime
        jobTransaction.imeiNumber = imei.imeiNumber
        jobTransaction.latitude = lastTrackLog.latitude
        jobTransaction.longitude = lastTrackLog.longitude
        jobTransaction.trackKm = 1
        jobTransaction.trackTransactionTimeSpent = 1 * 1000
        jobTransaction.trackBattery = (trackBattery && trackBattery.value) ? trackBattery.value : 0
        jobTransaction.npsFeedBack = 1
        jobTransaction.originalAmount = 0
        jobTransaction.actualAmount = 0
        jobTransaction.moneyTransactionType = undefined
        let jobTransactionArray = []
        jobTransactionArray.push(jobTransaction)
        let result = {
            tableName: 'TABLE_JOB_TRANSACTION',
            value: jobTransactionArray,
            jobTransactionDTOList: jobTransactionList
        }
        expect(formLayoutEventsInterface._setJobTransactionValues(jobTransaction, status, jobMaster, user, hub, imei, currentTime, lastTrackLog, 1, 1, trackBattery, 1, {})).toEqual(result)
    })
})

describe('test for _setBulkJobTransactionValues', () => {

    let id = 1,
        status = { id: 1, code: 1 },
        jobMaster = { id: 1, code: 1 },
        user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
        hub = { id: 1, code: 1 },
        imei = {
            imeiNumber: 1
        },
        currentTime = '12:10:10',
        lastTrackLog = {
            latitude: 0,
            longitude: 0
        },
        trackBattery = {
            value: 1
        }
    it('should return job transaction', () => {
        let time = moment().valueOf()
        let jobTransactionList = [{
            id: 1,
            referenceNumber: 1,
            jobId: 1
        }]
        let jobTransaction = {}
        jobTransaction.id = 1
        jobTransaction.jobId = 1
        jobTransaction.referenceNumber = 1
        jobTransaction.jobType = jobMaster.code
        jobTransaction.jobStatusId = status.id
        jobTransaction.statusCode = status.code
        jobTransaction.employeeCode = user.employeeCode
        jobTransaction.hubCode = hub.code
        jobTransaction.lastTransactionTimeOnMobile = currentTime
        jobTransaction.imeiNumber = imei.imeiNumber
        jobTransaction.latitude = lastTrackLog.latitude
        jobTransaction.longitude = lastTrackLog.longitude
        jobTransaction.trackKm = 1
        jobTransaction.trackTransactionTimeSpent = 1 * 1000
        jobTransaction.trackBattery = (trackBattery && trackBattery.value) ? trackBattery.value : 0
        jobTransaction.npsFeedBack = 1
        jobTransaction.originalAmount = 0
        jobTransaction.actualAmount = 0
        jobTransaction.moneyTransactionType = undefined
        let jobTransactionArray = []
        jobTransactionArray.push(jobTransaction)
        let result = {
            tableName: 'TABLE_JOB_TRANSACTION',
            value: jobTransactionArray,
            jobTransactionDTOList: jobTransactionList
        }
        expect(formLayoutEventsInterface._setBulkJobTransactionValues(jobTransactionList, status, jobMaster, user, hub, imei, currentTime, lastTrackLog, 1, 1, trackBattery, 1, {})).toEqual(result)
    })
})
describe('test for update field info', () => {
    it('should set display value to value', () => {
        let formElement = new Map()
        formElement.set(1, {
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "d",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: true,
            validation: []

        })
        let result = new Map()
        result.set(1, {
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "d",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: true,
            validation: [],
            displayValue: 'test'
        })
        expect(formLayoutEventsInterface.updateFieldData(1, 'test', formElement, NEXT_FOCUS)).toEqual(result)
    })
    it('should set alert message to null', () => {
        let formElement = new Map()
        formElement.set(1, {
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "d",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: true,
            validation: [],
            alertMessage: 'alert'

        })
        let result = new Map()
        result.set(1, {
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "d",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: true,
            validation: [],
            displayValue: 'test',
            alertMessage: null,
            childDataList: []
        })
        expect(formLayoutEventsInterface.updateFieldData(1, 'test', formElement, null, [])).toEqual(result)
    })
})

describe('get sequence field data', () => {
    it('should not get data from server if id is null and throw error', () => {
        const message = 'masterId unavailable'
        try {
            keyValueDBService.getValueFromStore = jest.fn()
            keyValueDBService.getValueFromStore.mockReturnValue('test')
            const sequenceId = null;
            formLayoutEventsInterface.getSequenceAttrData(sequenceId)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should not get data from server if id is undefined and throw error', () => {
        const message = 'masterId unavailable'
        try {
            keyValueDBService.getValueFromStore = jest.fn()
            keyValueDBService.getValueFromStore.mockReturnValue('test')
            const sequenceId = undefined;
            formLayoutEventsInterface.getSequenceAttrData(sequenceId)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should not get data from server if token value is null and throw token error', () => {
        const message = 'Token Missing'
        try {
            keyValueDBService.getValueFromStore = jest.fn()
            keyValueDBService.getValueFromStore.mockReturnValue(null)
            formLayoutEventsInterface.getSequenceAttrData()
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should not get data from server if token value is undefined and throw token error', () => {
        const message = 'Token Missing'
        try {
            keyValueDBService.getValueFromStore = jest.fn()
            keyValueDBService.getValueFromStore.mockReturnValue(undefined)
            formLayoutEventsInterface.getSequenceAttrData()
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should not get data from server and throw error', () => {
        const message = 'masterId unavailable'
        try {
            keyValueDBService.getValueFromStore = jest.fn()
            keyValueDBService.getValueFromStore.mockReturnValue('test')
            const sequenceId = null;
            formLayoutEventsInterface.getSequenceAttrData(sequenceId)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should get sequence  data without error', () => {

        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: 'testtoken'
        })
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue({ json: [1] });
        const sequenceId = '4';
        return formLayoutEventsInterface.getSequenceAttrData(sequenceId).then(data => {
            expect(data).toEqual(null)
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1)
        })
    })
})


describe('add transaction to sync list', () => {
    it('should create pending sync list', () => {
        let transactionIdsToSync = [1];
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(null);
        keyValueDBService.validateAndSaveData = jest.fn();
        formLayoutEventsInterface.addToSyncList([1]).then((idList) => {
            expect(idList).toEqual(transactionIdsToSync);
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1);
        })

    })
})

describe('test cases for _getDbObjects', () => {

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        realm.getRecordListOnQuery = jest.fn()
    })
    let status = { value: [{ id: 1, code: 1 }] },
        jobMaster = { value: [{ id: 1, code: 1 }] },
        user = { value: { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } } },
        hub = { value: { id: 1, code: 1 } },
        referenceNumber = 1,
        currentTime = '12:10:10',
        imei = { value: { imeiNumber: 1 } }
    it('returns job transaction array for single transaction', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce(hub)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(imei)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(status)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(jobMaster)
        realm.getRecordListOnQuery.mockReturnValue([{ id: 1 }])
        let resultObject = {
            jobTransaction: { id: 1 },
            user,
            hub, imei,
            status: [{ id: 1, code: 1 }],
            jobMaster: [{ id: 1, code: 1 }]
        }
        return formLayoutEventsInterface._getDbObjects(1, 1, 1, currentTime, user, { referenceNumber: 1 }).then((result) => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(4)
            expect(result).toEqual(resultObject)
        })
    })

    it('returns job transaction array for bulk', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce(hub)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(imei)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(status)
        keyValueDBService.getValueFromStore.mockReturnValueOnce(jobMaster)
        realm.getRecordListOnQuery.mockReturnValue([{ id: 1 }])
        let resultObject = {
            jobTransaction: [{ id: 1 }],
            user,
            hub, imei,
            status: [{ id: 1, code: 1 }],
            jobMaster: [{ id: 1, code: 1 }]
        }
        return formLayoutEventsInterface._getDbObjects(1, 1, 1, currentTime, user, [{ jobTransactionId: 1 }]).then((result) => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(4)
            expect(result).toEqual(resultObject)
        })
    })
})
describe('update jobSummary data ', () => {
    const jobSummary = {
        value: [
            {
                id: 2260120,
                userId: 4957,
                hubId: 2759,
                cityId: 744,
                companyId: 295,
                jobStatusId: 4814,
                count: 1,
            },
            {
                id: 2260121,
                userId: 4957,
                hubId: 2759,
                cityId: 744,
                companyId: 295,
                jobStatusId: 4815,
                count: 2,
            }
        ]
    }

    let jobTransaction = {
        id: 1,
        jobId: 2,
        jobMasterId: 3,
        jobStatusId: 4814,
        referenceNumber: "abc123",
        runsheetNo: "aks",
        runsheetId: 1234,
        seqSelected: 2,
    }
    let nextStatusId = 4815;

    let newJobSummary = {
        value: [
            {
                id: 2260120,
                userId: 4957,
                hubId: 2759,
                cityId: 744,
                companyId: 295,
                jobStatusId: 4814,
                count: 0,
            },
            {
                id: 2260121,
                userId: 4957,
                hubId: 2759,
                cityId: 744,
                companyId: 295,
                jobStatusId: 4815,
                count: 3,
            }
        ]
    }

    it('should update job summary', () => {
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(jobSummary);
        keyValueDBService.validateAndUpdateData = jest.fn();
        formLayoutEventsInterface._updateJobSummary(jobTransaction, nextStatusId, null).then((idList) => {
            expect(idList).toEqual(newJobSummary);
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(keyValueDBService.validateAndUpdateData).toHaveBeenCalledTimes(1);
        })

    })
})

describe('update Runsheet Summary data ', () => {
    const runsheetSummary = [
        {
            id: 2260,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "1",
            pendingCount: 0,
            successCount: 2,
            failCount: 0
        },
        {
            id: 2261,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "2",
            pendingCount: 1,
            successCount: 0,
            failCount: 0
        },
    ]

    let jobTransaction = {
        id: 1,
        jobId: 2,
        jobMasterId: 3,
        jobStatusId: 4814,
        referenceNumber: "abc123",
        runsheetNo: "2",
        runsheetId: 2261,
        seqSelected: 2,
    }
    let nextStatusCategory = 3, prevStatusCategory = 1;

    const newRunsheetList = [
        {
            id: 2260,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "1",
            pendingCount: 0,
            successCount: 2,
            failCount: 0
        },
        {
            id: 2261,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "2",
            pendingCount: 0,
            successCount: 1,
            failCount: 0
        },
    ]

    let data = {
        tableName: TABLE_RUNSHEET,
        value: newRunsheetList
    }

    it('should update runsheet summary', () => {
        jobStatusService.getStatusCategoryOnStatusId = jest.fn();
        jobStatusService.getStatusCategoryOnStatusId.mockReturnValue(prevStatusCategory);
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(runsheetSummary);
        keyValueDBService.validateAndUpdateData = jest.fn();
        formLayoutEventsInterface._updateRunsheetSummary(jobTransaction, nextStatusCategory, null).then((idList) => {
            expect(idList).toEqual(data);
            expect(jobStatusService.getStatusCategoryOnStatusId).toHaveBeenCalledTimes(1);
            expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1);
        })

    })
})
describe('update user summary after completing transactions', () => {  // _updateUserSummary(jobTransaction, statusCategory, jobTransactionIdList,userSummary,jobTransactionValue)

    beforeEach(() => {
        jobStatusService.getStatusCategoryOnStatusId = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
    })
    const jobTransaction = [{
        id: 2521299,
        jobMasterId: 3,
        jobStatusId: 11,
        runsheetId: 1,
        lastUpdatedAtServer: '2018-12-10 12:12:12',
    }]
    const jobTransactionValue = {
        lastTransactionTimeOnMobile: '2018-12-10 12:12:12',
        referenceNumber: '123'
    }
    let userSummary = {
        hubId: 24629,
        id: 233438,
        lastBattery: 54,
        lastCashCollected: 0,
        lastLat: 28.5555772,
        lastLng: 77.2675903,
        pendingCount: 0,
        failCount: 0,
        successCount: 0,
        lastOrderTime: null,
        lastOrderNumber: null,
    }
    it('should set update user summary db', () => {
        jobStatusService.getStatusCategoryOnStatusId.mockReturnValueOnce(1)
        return formLayoutEventsInterface._updateUserSummary(12, 3, jobTransaction, 3, userSummary, 11)
            .then((count) => {
                expect(jobStatusService.getStatusCategoryOnStatusId).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.validateAndSaveData).toHaveBeenCalled()
            })
    })
})


describe('update job summary after completing transactions', () => {  // _updateJobSummary(jobTransaction, statusId, jobTransactionIdList)

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.validateAndUpdateData = jest.fn()
    })
    const jobTransaction = {
        id: 2521299,
        jobMasterId: 3,
        jobStatusId: 11,
        runsheetId: 1,
        lastUpdatedAtServer: '2018-12-10 12:12:12',
    }
    const jobTransactionValue = {
        lastTransactionTimeOnMobile: '2018-12-10 12:12:12',
        referenceNumber: '123'
    }


    let jobSummary = {
        value: [{
            hubId: 24629,
            id: 1,
            userId: 54,
            jobMasterId: 123,
            jobStatusId: 11,
            count: 0,
            updatedTime: null
        },
        {
            hubId: 24629,
            id: 2,
            userId: 54,
            jobMasterId: 124,
            jobStatusId: 11,
            count: 1,
            updatedTime: null
        },
        {
            hubId: 24629,
            id: 3,
            userId: 54,
            jobMasterId: 125,
            jobStatusId: 3,
            count: 2,
            updatedTime: null
        }
        ]
    }
    it('should set update user summary db', () => {
        keyValueDBService.getValueFromStore.mockReturnValueOnce(jobSummary)
        formLayoutEventsInterface._updateJobSummary(jobTransaction, 3, null)
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(keyValueDBService.validateAndUpdateData).toHaveBeenCalledTimes(1)
            })
    })
})

describe('update runSheet summary after completing transactions', () => {  // _updateRunsheetSummary(jobTransaction, statusCategory, jobTransactionIdList)

    beforeEach(() => {
        jobStatusService.getStatusCategoryOnStatusId = jest.fn()
        realm.getRecordListOnQuery = jest.fn()
    })
    const jobTransaction = [{
        id: 2521299,
        jobMasterId: 3,
        jobStatusId: 11,
        runsheetId: 2260,
        lastUpdatedAtServer: '2018-12-10 12:12:12',
    }]
    let runsheetList = [
        {
            id: 2260,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "1",
            pendingCount: 1,
            successCount: 2,
            failCount: 0
        },
        {
            id: 2261,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "2",
            pendingCount: 0,
            successCount: 1,
            failCount: 0
        },
    ]
    let finalData = {
        "tableName": "TABLE_RUNSHEET",
        "value":
            [{
                "failCount": 0,
                "hubId": 2759,
                "id": 2260,
                "pendingCount": 0,
                "runsheetNumber": "1",
                "successCount": 3,
                "userId": 4957
            }
            ]
    }

    it('should  update runsheet summary db', () => {
        jobStatusService.getStatusCategoryOnStatusId.mockReturnValueOnce(1)
        realm.getRecordListOnQuery.mockReturnValueOnce(runsheetList)
        return formLayoutEventsInterface._updateRunsheetSummary(11, 3, jobTransaction)
            .then((data) => {
                expect(jobStatusService.getStatusCategoryOnStatusId).toHaveBeenCalledTimes(1)
                expect(realm.getRecordListOnQuery).toHaveBeenCalled()
                expect(data).toEqual(finalData)
            })
    })
})
describe('save data to db', () => {
    let formLayoutMap = new Map()
    formLayoutMap.set(1, {
        label: "rr",
        subLabel: "d",
        helpText: "d",
        key: "d",
        required: true,
        hidden: false,
        attributeTypeId: 1,
        fieldAttributeMasterId: 1,
        positionId: 0,
        parentId: 0,
        showHelpText: false,
        editable: false,
        focus: true,
        validation: []

    }).set(2, {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "dd",
        required: false,
        hidden: true,
        attributeTypeId: 1,
        fieldAttributeMasterId: 1,
        positionId: 0,
        parentId: 0,
        showHelpText: true,
        editable: false,
        focus: false,
        validation: []
    });
    it('should save field data', () => {
        let currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

        let childDataList = [
            {
                value: 3,
                jobTransactionId: 5,
                positionId: 3,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                childDataList: [
                    {
                        value: 4,
                        jobTransactionId: 5,
                        positionId: 4,
                        parentId: 0,
                        fieldAttributeMasterId: 1,
                        key: 1,
                        attributeTypeId: 1,
                    },
                    {
                        value: 5,
                        jobTransactionId: 5,
                        positionId: 5,
                        parentId: 0,
                        fieldAttributeMasterId: 1,
                        key: 1,
                        attributeTypeId: 1,
                        childDataList: [
                            {
                                value: 6,
                                jobTransactionId: 5,
                                positionId: 6,
                                parentId: 0,
                                fieldAttributeMasterId: 1,
                                key: 1,
                                attributeTypeId: 1,
                            },
                            {
                                value: 7,
                                jobTransactionId: 5,
                                positionId: 7,
                                parentId: 0,
                                fieldAttributeMasterId: 1,
                                key: 1,
                                attributeTypeId: 1,
                                childDataList: []
                            }
                        ]
                    }
                ]
            },
            {
                value: 8,
                jobTransactionId: 5,
                positionId: 8,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
            }
        ]

        let fieldDataArray = [
            {
                id: 2,
                jobTransactionId: 5,
                key: 'd',
                parentId: 0,
                positionId: 0,
                value: 'dd',
                fieldAttributeMasterId: 1,
                attributeTypeId: 1,
                dateTime: currentTime
            },
            {
                id: 3,
                value: '3',
                jobTransactionId: 5,
                positionId: 3,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                dateTime: currentTime

            },
            {
                id: 4,
                value: '4',
                jobTransactionId: 5,
                positionId: 4,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                dateTime: currentTime

            },
            {
                id: 5,
                value: '5',
                jobTransactionId: 5,
                positionId: 5,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                dateTime: currentTime

            },
            {
                id: 6,
                value: '6',
                jobTransactionId: 5,
                positionId: 6,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                dateTime: currentTime

            },
            {
                id: 7,
                value: '7',
                jobTransactionId: 5,
                positionId: 7,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                dateTime: currentTime

            },
            {
                id: 8,
                value: '8',
                jobTransactionId: 5,
                positionId: 8,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 1,
                attributeTypeId: 1,
                dateTime: currentTime

            },
            {
                id: 9,
                value: null,
                jobTransactionId: 5,
                positionId: 0,
                parentId: 0,
                fieldAttributeMasterId: 1,
                key: 'dd',
                attributeTypeId: 1,
                dateTime: currentTime
            }

        ];
        formLayoutMap.get(1).childDataList = childDataList;
        formLayoutMap.get(1).value = 'dd';
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{}]);;
        expect(formLayoutEventsInterface._saveFieldData(formLayoutMap, 5, null, currentTime)).toEqual({
            tableName: TABLE_FIELD_DATA,
            value: fieldDataArray,
            npsFeedbackValue: null,
            reAttemptDate: null,
            moneyCollectObject: null,
            skuArrayObject: null,
            amountMap: {
                originalAmount: null,
                actualAmount: null,
                moneyTransactionType: null
            }
        })
    })

    it('should save data in db', () => {
        formLayoutEventsInterface._getDbObjects = jest.fn();
        formLayoutEventsInterface._getDbObjects.mockReturnValue({
            jobTransaction: {
                jobId: 1
            },
            user: {
                employeeCode: 1234
            },
            hub: {
                code: 1
            },
            imei: {
                imeiNumber: 12345
            },
            jobMaster: [
                {
                    code: 'jobMaster'
                }
            ],
            status: [
                {
                    id: 1,
                    code: 'success',
                    actionOnStatus: 3
                }
            ]
        })

        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue({
            job: {

            }
        })
        formLayoutEventsInterface._setJobTransactionValues = jest.fn()
        formLayoutEventsInterface._setJobTransactionValues.mockReturnValue({
            tableName: 'TABLE_JOB_TRANSACTION',
            value: [],
            jobTransactionDTOList: []
        })
        formLayoutEventsInterface._updateRunsheetSummary = jest.fn()
        formLayoutEventsInterface._updateUserSummary = jest.fn()
        formLayoutEventsInterface._updateJobSummary = jest.fn()

        formLayoutEventsInterface._updateRunsheetSummary.mockReturnValue({})
        realm.performBatchSave = jest.fn();
        formLayoutEventsInterface.saveDataInDb(formLayoutMap, 5, 1);
    })
})

// describe('find next focusable and editable elements', () => {
//     it('when both elements are required and current element is last element', () => {
//         let formLayoutObject = new Map(formLayoutMap);
//         formLayoutObject.get(2).value = 'a';
//         let isSaveDisabled = false;
//         expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(2, formLayoutObject, nextEditable, true, 'a')).toEqual({
//             formLayoutObject,
//             nextEditable,
//             isSaveDisabled
//         });
//     })

//     it('when both elements are required and current element is not last element', () => {
//         let formLayoutObject = new Map(formLayoutMap);
//         formLayoutObject.get(2).value = null;
//         formLayoutObject.get(2).focus = true;
//         formLayoutObject.get(2).editable = true;
//         let isSaveDisabled = true;
//         const expectedObject = { formLayoutObject, nextEditable, isSaveDisabled }
//         expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(1, formLayoutObject, nextEditable, true, 'a')).toEqual(expectedObject);
//     })

//     it('when both elements are required and other required does not contain value', () => {
//         let formLayoutObject = new Map(formLayoutMap);
//         formLayoutObject.get(2).value = 'a';
//         formLayoutObject.get(1).value = null;
//         let isSaveDisabled = true;
//         expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(2, formLayoutObject, nextEditable, true, 'a')).toEqual({
//             formLayoutObject,
//             nextEditable,
//             isSaveDisabled
//         });
//     })
// })


describe('test for _updateTransactionLogs', () => {
    let jobTransaction = {
        1: {
            id: 1,
            hubId: 1,
            cityId: 1,
            companyId: 1
        }
    }
    let statusId = 2
    let prevStatusId = 3
    let jobMasterId = 1
    let user = {
        value: { id: 1 }
    }
    let lastTrackLog = {
        latitude: 123,
        longitude: 123
    }
    let dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    let result = {
        tableName: 'TABLE_TRANSACTION_LOGS',
        value: [{
            userId: user.value.id,
            transactionId: jobTransaction[1].id,
            jobMasterId: jobMasterId,
            toJobStatusId: statusId,
            fromJobStatusId: prevStatusId,
            latitude: lastTrackLog.latitude,
            longitude: lastTrackLog.longitude,
            transactionTime: dateTime,
            updatedAt: dateTime,
            hubId: jobTransaction[1].hubId,
            cityId: jobTransaction[1].cityId,
            companyId: jobTransaction[1].companyId,
        }]
    }
    it('should return transaction logs dto', () => {
        expect(formLayoutEventsInterface._updateTransactionLogs(jobTransaction, statusId, prevStatusId, jobMasterId, user, lastTrackLog)).toEqual(result)
    })
})

describe('test for changeJobTransactionIdInCaseOfNewJob', () => {

    it('should return transaction id in case of no new job', () => {
        expect(formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob(1, [])).toEqual(1)
    })

    it('should return -1 job tramsaction id', () => {
        realm.getRecordListOnQuery.mockReturnValue([])
        expect(formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob(-2, [])).toEqual(-1)
    })

    it('should return most negative job tramsaction id', () => {
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue([{
            id: -3
        }])
        expect(formLayoutEventsInterface.changeJobTransactionIdInCaseOfNewJob(-2, [])).toEqual(-4)
    })
})

describe('test for _getDefaultValuesForJob', () => {

    let id = 1,
        status = { id: 1, code: 1 },
        jobMasterId = 1,
        user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
        hub = { id: 1, code: 1 },
        referenceNumber = 1,
        currentTime = '12:10:10'
    it('should return job transaction', () => {
        let time = moment().valueOf()
        let jobTransaction = {
            id,
            referenceNo: referenceNumber,
            hubId: (hub) ? hub.id : null,
            cityId: (user) ? user.cityId : null,
            companyId: (user && user.company) ? user.company.id : null,
            jobMasterId,
            status: 3,
            latitude: 0.0,
            longitude: 0.0,
            slot: 0,
            merchantCode: null,
            jobStartTime: currentTime,
            createdAt: currentTime,
            attemptCount: 1,
            missionId: null,
            jobEndTime: null,
            currentProcessId: null
        }
        expect(formLayoutEventsInterface._getDefaultValuesForJob(jobMasterId, id, user, hub, referenceNumber, currentTime)).toEqual(jobTransaction)
    })
})


describe('test for _setBulkJobDbValues', () => {

    let jobTransactions = [{
        id: 1,
        jobId: 1
    }]
    it('should return job with status 3', () => {
        let status = {
            actionOnStatus: 1
        }
        let result = [{
            jobId: 1,
            status: 3,
            id: 1
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setBulkJobDbValues(status, jobTransactions)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })
    it('should return job with status 1', () => {
        let status = {
            actionOnStatus: 2
        }
        let result = [{
            jobId: 1,
            status: 1,
            id: 1
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setBulkJobDbValues(status, jobTransactions)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })
    it('should return job with status 4', () => {
        let status = {
            actionOnStatus: 3
        }
        let result = [{
            jobId: 1,
            status: 4, id: 1
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setBulkJobDbValues(status, jobTransactions)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })
    it('should return job with re attempt date', () => {
        let status = {
            actionOnStatus: 1
        }, referenceNumber = 1
        let result = [{
            jobId: 1,
            status: 3,
            id: 1,
            jobStartTime: '2099-12-12 00:00:00'
        }]
        let reAttemptDate = '2099-12-12'
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setBulkJobDbValues(status, jobTransactions, 1, null, null, reAttemptDate)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })
})

describe('test for _setJobDbValues', () => {

    let jobTransactions = [{
        id: 1,
        jobId: 1
    }]

    let id = 1,
        status = { id: 1, code: 1 },
        jobMaster = { id: 1, code: 1 },
        user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
        hub = { id: 1, code: 1 },
        imei = {
            imeiNumber: 1
        },
        currentTime = '12:10:10'
    it('should return job with status 3', () => {
        let status = {
            actionOnStatus: 1
        }
        let result = [{
            jobId: 1,
            status: 3,
            id: 1
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })
    it('should return job with status 3', () => {
        let status = {
            actionOnStatus: 1
        }, referenceNumber = 1
        let result = [{
            status: 4,
            id: -1,
            referenceNo: referenceNumber,
            hubId: (hub) ? hub.id : null,
            cityId: (user) ? user.cityId : null,
            companyId: (user && user.company) ? user.company.id : null,
            jobMasterId: jobMaster.id,
            status: 3,
            latitude: 0.0,
            longitude: 0.0,
            slot: 0,
            merchantCode: null,
            jobStartTime: currentTime,
            createdAt: currentTime,
            attemptCount: 1,
            missionId: null,
            jobEndTime: null,
            currentProcessId: null
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setJobDbValues(status, -1, jobMaster.id, user, hub, referenceNumber, currentTime, null, { latitude: 0, longitude: 0 })).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })

    it('should return job with re attempt date', () => {
        let status = {
            actionOnStatus: 1
        }, referenceNumber = 1
        let result = [{
            jobId: 1,
            status: 3,
            id: 1,
            jobStartTime: '2099-12-12 00:00:00'
        }]
        let reAttemptDate = '2099-12-12'
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setJobDbValues(status, 1, jobMaster.id, user, hub, referenceNumber, currentTime, reAttemptDate, { latitude: 0, longitude: 0 })).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })

    it('should return job with status 4', () => {
        let status = {
            actionOnStatus: 3
        }
        let result = [{
            jobId: 1,
            status: 4,
            id: 1
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })
    it('should return job with status 1', () => {
        let status = {
            actionOnStatus: 2
        }
        let result = [{
            jobId: 1,
            status: 1,
            id: 1
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })

    it('should return job with status 2', () => {
        let status = {
            actionOnStatus: 0
        }
        let result = [{
            jobId: 1,
            status: 2,
            id: 1
        }]
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(jobTransactions)
        expect(formLayoutEventsInterface._setJobDbValues(status, id)).toEqual({
            tableName: TABLE_JOB,
            value: result
        })
    })
})


describe('test for _getDefaultValuesForJobTransaction', () => {

    let id = 1,
        status = { id: 1, code: 1 },
        jobMaster = { id: 1, code: 1 },
        user = { id: 1, cityId: 1, employeeCode: 1, company: { id: 1 } },
        hub = { id: 1, code: 1 },
        imei = {
            imeiNumber: 1
        },
        currentTime = '12:10:10'
    it('should return job transaction', () => {
        let time = moment().valueOf()
        let jobTransaction = {
            id,
            runsheetNo: "AUTO-GEN",
            syncErp: false,
            userId: user.id,
            jobId: id,
            jobStatusId: status.id,
            companyId: user.company.id,
            actualAmount: 0.0,
            originalAmount: 0.0,
            moneyTransactionType: '',
            referenceNumber: user.id + "/" + hub.id + "/" + time,
            runsheetId: null,
            hubId: hub.id,
            cityId: user.cityId,
            trackKm: 0.0,
            trackHalt: 0.0,
            trackCallCount: 0,
            trackCallDuration: 0,
            trackSmsCount: 0,
            trackTransactionTimeSpent: 0.0,
            jobCreatedAt: currentTime,
            erpSyncTime: currentTime,
            androidPushTime: currentTime,
            lastUpdatedAtServer: currentTime,
            lastTransactionTimeOnMobile: currentTime,
            deleteFlag: 0,
            attemptCount: 1,
            jobType: jobMaster.code,
            jobMasterId: jobMaster.id,
            employeeCode: user.employeeCode,
            hubCode: hub.code,
            statusCode: status.code,
            startTime: "00:00",
            endTime: "00:00",
            merchantCode: null,
            seqSelected: 0,
            seqAssigned: 0,
            seqActual: 0,
            latitude: 0.0,
            longitude: 0.0,
            trackBattery: 0,
            imeiNumber: imei.imeiNumber
        }
        expect(formLayoutEventsInterface._getDefaultValuesForJobTransaction(id, status, jobMaster, user, hub, imei, currentTime)).toEqual(jobTransaction)
    })
})
function getMapFromObject(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}