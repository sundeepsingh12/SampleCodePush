'use strict'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
var formLayoutActions = require('../../form-layout/formLayoutActions')
var actions = require('../signatureActions')
import {
    SET_FIELD_DATA_LIST,
    SAVE_SIGNATURE,
    USER,
    FormLayout,
    SET_REMARKS_VALIDATION,
    FIELD_ATTRIBUTE,
    NEXT_FOCUS,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA
} from '../../../lib/constants'
import { signatureService } from '../../../services/classes/SignatureRemarks'
import {
    SIGNATURE,
    NPS_FEEDBACK
} from '../../../lib/AttributeConstants'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('signature actions getRemarksList', () => {
    it('checks for validation and sets empty array to remarks when validation is false', () => {
        const remarksList = [
            {
                label: 'hi',
                value: 'hello'
            }
        ]
        const expectedActions = [
            {
                type: SET_FIELD_DATA_LIST,
                payload: []
            },
        ]
        const currentElement = {
            fieldAttributeMasterId: 1,
            value: 'x'
        }
        signatureService.filterRemarksList = jest.fn()
        signatureService.filterRemarksList.mockReturnValue(remarksList)
        signatureService.getRemarksValidation = jest.fn()
        signatureService.getRemarksValidation.mockReturnValue(false)
        const store = mockStore({})
        return store.dispatch(actions.getRemarksList(currentElement, remarksList))
            .then(() => {
                expect(signatureService.getRemarksValidation).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('checks for validation and sets remarks list', () => {
        const remarksList = [
            {
                label: 'hi',
                value: 'hello'
            }
        ]
        const expectedActions = [
            {
                type: SET_FIELD_DATA_LIST,
                payload: remarksList
            },
        ]
        const currentElement = {
            fieldAttributeMasterId: 1,
            value: 'x'
        }
        signatureService.filterRemarksList = jest.fn()
        signatureService.filterRemarksList.mockReturnValue(remarksList)
        signatureService.getRemarksValidation = jest.fn()
        signatureService.getRemarksValidation.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.getRemarksList(currentElement, remarksList))
            .then(() => {
                expect(signatureService.getRemarksValidation).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should save signature and nps rating in form layout state', () => {
        const expectedActions = [
            {
                type: UPDATE_FIELD_DATA_WITH_CHILD_DATA,
            },
        ]

        const testSignature = 'test1'
        const testRating = '1'
        const signatureValue = 'signature.jpg'
        let formElement = new Map()
        formElement.set(10, {
            fieldAttributeMasterId: 10,
            positionId: 10
        })
        let parameters = {
            currentElement: {
                fieldAttributeMasterId: 10,
                positionId: 10
            },
            formElement,
            isSaveDisabled: true,
            latestPositionId: 2,
            jobTransactionId: 1
        }
        let fieldAttributeMasterList = {
            value:
                [{
                    id: 1,
                    attributeTypeId: SIGNATURE,
                    parentId: 10,
                },
                {
                    id: 2,
                    attributeTypeId: NPS_FEEDBACK,
                    parentId: 10,

                },
                {
                    id: 3,
                    attributeTypeId: 18,
                }]
        }
        const childFieldDataList = {
            "fieldDataList": [
                {
                    fieldAttributeMasterId: 1,
                    attributeTypeId: SIGNATURE,
                    value: signatureValue,
                    parentId: 10,
                    positionId: 3,
                    jobTransactionId: 123
                },
                {
                    fieldAttributeMasterId: 2,
                    attributeTypeId: NPS_FEEDBACK,
                    value: testRating,
                    parentId: 10,
                    positionId: 4,
                    jobTransactionId: 123

                }
            ],
            "latestPositionId": 4
        }
        const jobTransaction = {
            id: 1,
            jobId: 1,
            jobMasterId: 1
        }

        signatureService.saveFile = jest.fn();
        signatureService.saveFile.mockReturnValue(signatureValue)
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(fieldAttributeMasterList)
        signatureService.prepareSignAndNpsFieldData = jest.fn()
        signatureService.prepareSignAndNpsFieldData.mockReturnValue(childFieldDataList)
        const store = mockStore({})
        return store.dispatch(actions.saveSignatureAndRating(signatureValue,
            testRating,
            parameters.currentElement, parameters, jobTransaction
        ))
            .then(() => {
                expect(signatureService.saveFile).toHaveBeenCalled()
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(signatureService.prepareSignAndNpsFieldData).toHaveBeenCalledTimes(1)
            })
    })
})
describe('test for saveSignature', () => {
    it('should save sign', () => {
        signatureService.saveFile = jest.fn()
        signatureService.saveFile.mockReturnValue('test')
        const store = mockStore({})
        return store.dispatch(actions.saveSignature('testResult', 1, {}, {}))
            .then(() => {
                expect(signatureService.saveFile).toHaveBeenCalled()
            })
    })
})    