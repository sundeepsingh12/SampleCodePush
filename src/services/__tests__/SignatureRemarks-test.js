'use strict'

import { signatureService } from '../classes/SignatureRemarks'
import moment from 'moment'
import RNFS from 'react-native-fs';
import {
    SIGNATURE,
    NPS_FEEDBACK,
    MONEY_COLLECT,
    ACTUAL_AMOUNT
} from '../../lib/AttributeConstants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'

describe('test cases for filterRemarksList', () => {

    it('should return empty fieldDataList for undefined ', () => {
        expect(signatureService.filterRemarksList(undefined)).toEqual([])
    })

    it('should return empty fieldDataList for empty map', () => {
        expect(signatureService.filterRemarksList([])).toEqual([])
    })

    it('should return fieldAttributeMasterMap for fieldAttributeMasterList', () => {
        const fieldDataList = [
            {
                fieldAttributeMasterId: 1,
                label: 'xyz',
                value: 'hello'
            }
        ]

        const fieldDataMap = new Map();
        fieldDataMap.set(1, {
            label: 'xyz',
            subLabel: null,
            helpText: null,
            key: '7',
            required: false,
            value: 'hello',
            attributeTypeId: 2,
            fieldAttributeMasterId: 1,
            parentId: 0
        })
        expect(signatureService.filterRemarksList(fieldDataMap)).toEqual(fieldDataList)
    })
    it('should return fieldAttributeMasterMap for fieldAttributeMasterList with money collect', () => {
        const fieldDataList = [
            {
                fieldAttributeMasterId: 1,
                label: 'xyz',
                value: 'hello'
            },
            {
                fieldAttributeMasterId: 2,
                label: 'xyz',

            }
        ]

        const fieldDataMap = new Map();
        fieldDataMap.set(1, {
            label: 'xyz',
            subLabel: null,
            helpText: null,
            key: '7',
            required: false,
            value: 'hello',
            attributeTypeId: 2,
            fieldAttributeMasterId: 1,
            parentId: 0
        })
        fieldDataMap.set(2, {
            label: 'xyz',
            subLabel: null,
            helpText: null,
            key: '7',
            required: false,
            value: 'hello',
            attributeTypeId: MONEY_COLLECT,
            fieldAttributeMasterId: 2,
            parentId: 0,
            childDataList: [{
                attributeTypeId: ACTUAL_AMOUNT,
            }]
        })
        fieldDataMap.set(3, {
            label: 'xyz',
            subLabel: null,
            helpText: null,
            key: '7',
            required: false,
            value: '',
            attributeTypeId: 2,
            fieldAttributeMasterId: 1,
            parentId: 0
        })
        expect(signatureService.filterRemarksList(fieldDataMap)).toEqual(fieldDataList)
    })
})

describe('test cases for saveFile', () => {
    const user = {
        value:
            {
                company: {
                    id: 1
                }
            }
    }
    it('should return image name', () => {
        const result = 'test'
        const currentTimeInMillis = moment()
        const imagename = 'sign_' + currentTimeInMillis + '.jpg'
        const value = moment().format('YYYY-MM-DD') + '/' + user.value.company.id + '/' + imagename
        RNFS.writeFile = jest.fn()
        RNFS.mkdir = jest.fn()
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(user)
        signatureService.saveFile(result, currentTimeInMillis).then(() => {
            expect(RNFS.mkdir).toHaveBeenCalled()
            expect(RNFS.writeFile).toHaveBeenCalledTimes(1)
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            expect(result).toEqual(value)
        })
    })
    it('should return image name for camera', () => {
        const result = 'test'
        const currentTimeInMillis = moment()
        const imagename = 'sign_' + currentTimeInMillis + '.jpg'
        const value = moment().format('YYYY-MM-DD') + '/' + user.value.company.id + '/' + imagename
        RNFS.writeFile = jest.fn()
        RNFS.mkdir = jest.fn()
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(user)
        signatureService.saveFile(result, currentTimeInMillis, true).then(() => {
            expect(RNFS.mkdir).toHaveBeenCalled()
            expect(RNFS.writeFile).toHaveBeenCalledTimes(1)
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
            expect(result).toEqual(value)
        })
    })
})


describe('test cases for prepareSignAndNpsFieldData', () => {
    const signatureValue = 'signature.jpg'
    const ratingValue = '1'
    let parameters = {
        currentElement: {
            fieldAttributeMasterId: 10,
            positionId: 10
        },
        formElement: {
            value: {
                fieldAttributeMasterId: 10,
                positionId: 10
            }
        },
        nextEditable: {},
        isSaveDisabled: true,
        latestPositionId: 2,
        jobTransactionId: 123
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
                value: ratingValue,
                parentId: 10,
                positionId: 4,
                jobTransactionId: 123

            }
        ],
        "latestPositionId": 4
    }
    it('should return empty fieldDataList for undefined ', () => {
        expect(signatureService.prepareSignAndNpsFieldData(signatureValue, ratingValue, parameters.currentElement, undefined, parameters.jobTransactionId, parameters.latestPositionId)).toEqual([])
    })
    it('should return empty fieldDataList for empty list ', () => {
        expect(signatureService.prepareSignAndNpsFieldData(signatureValue, ratingValue, parameters.currentElement, [], parameters.jobTransactionId, parameters.latestPositionId)).toEqual([])
    })
    it('should return childFieldDataList for fieldAttributeMaster list ', () => {
        expect(signatureService.prepareSignAndNpsFieldData(signatureValue, ratingValue, parameters.currentElement, fieldAttributeMasterList, parameters.jobTransactionId, parameters.latestPositionId)).toEqual(childFieldDataList)
    })
})

describe('test cases for getRemarksValidation', () => {

    it('should return false for null validation ', () => {
        expect(signatureService.getRemarksValidation(null)).toEqual(false)
    })
    it('should return false for empty validation ', () => {
        const validation = []
        expect(signatureService.getRemarksValidation(validation)).toEqual(false)
    })
    it('should return true validation', () => {
        const validation = [
            {
                timeOfExecution: 'MINMAX',
                condition: 'TRUE'
            }
        ]
        expect(signatureService.getRemarksValidation(validation)).toEqual(true)
    })
    it('should return false validation', () => {
        const validation = [
            {
                timeOfExecution: 'MINMAX',
                condition: 'false'
            }
        ]
        expect(signatureService.getRemarksValidation(validation)).toEqual(false)
    })
})

describe('test cases for getImageData', () => {
    it('should return image data', () => {
        const value = 'a/b/c.png'
        RNFS.readFile = jest.fn()
        signatureService.getImageData(value).then(() => {
            expect(RNFS.readFile).toHaveBeenCalled()
        })
    })

})