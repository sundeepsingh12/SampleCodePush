'use strict'

import * as actions from '../multipleOptionsAttributeActions'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { fieldDataService } from '../../services/classes/FieldData'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { multipleOptionsAttributeService } from '../../services/classes/MultipleOptionsAttribute'
import { fieldAttributeMasterService } from '../../services/classes/FieldAttributeMaster'
import { fieldAttributeValueMasterService } from '../../services/classes/FieldAttributeValueMaster'
import { CHECKBOX, ARRAY_SAROJ_FAREYE, OPTION_RADIO_FOR_MASTER, OBJECT_SAROJ_FAREYE, OPTION_RADIO_VALUE, ADVANCE_DROPDOWN } from '../../lib/AttributeConstants'
import { FIELD_ATTRIBUTE_VALUE, FIELD_ATTRIBUTE, SET_OPTIONS_LIST, NEXT_FOCUS, SET_ADV_DROPDOWN_MESSAGE_OBJECT, SET_MODAL_FIELD_ATTRIBUTE, SET_OPTION_ATTRIBUTE_ERROR } from '../../lib/constants'
import _ from 'lodash'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Map } from 'immutable';
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('getOptionsList', () => {

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValueOnce({ value: {} });
        fieldAttributeValueMasterService.filterFieldAttributeValueList = jest.fn();
        multipleOptionsAttributeService.changeOptionStatus = jest.fn();
    })

    const fieldAttributeMasterId = 1;
    let formElement = new Map();
    formElement.set(1,{
        childDataList : [
            {
                
            }
        ]
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
        [1, 'ab', 'PENDING', 1], [2, 'an', 'SUCCESS', 3]
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
        jobDetailsService.getJobDetailsParameters.mockReturnValueOnce({ statusList, jobMasterList, jobAttributeMasterList, fieldAttributeMasterList, jobAttributeStatusList, fieldAttributeStatusList })
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

