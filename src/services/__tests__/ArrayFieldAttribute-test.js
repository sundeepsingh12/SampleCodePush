'use strict'

import { arrayService } from '../classes/ArrayFieldAttribute'
import {
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
} from '../../lib/AttributeConstants'
import {
    INVALID_CONFIG_ERROR
} from '../../lib/ContaierConstants'
import { backupService } from '../classes/BackupService';
describe('test cases for getSortedArrayChildElements', () => {
    it('should return null arrayElements when arrayelements is not empty', () => {
        expect(arrayService.getSortedArrayChildElements(0, { test: 1 }, {})).toEqual(undefined)

    })
    it('should return error message ', () => {
        const arrayElements = {}
        let formLayoutObject = new Map()
        formLayoutObject[1] = {
            required: false,
            hidden: true
        }
        const arrayRowDTO = {
            formLayoutObject
        }
        const newArrayElements = {
            allRequiredFieldsFilled: false,
        }
        //     { "arrayRowDTO": { "arrayElements": { "0": { "allRequiredFieldsFilled": false, "rowId": 0, "test": 1 } }, "isSaveDisabled": true, "lastRowId": 1}, "childElementsTemplate": { "allRequiredFieldsFilled": false, "rowId": 0, "test": 1 }}
        expect(arrayService.getSortedArrayChildElements(0, arrayElements, arrayRowDTO)).toEqual({
            arrayRowDTO: {
            },
            childElementsTemplate: arrayRowDTO,
            errorMessage: INVALID_CONFIG_ERROR
        })
    })
    it('should add new row', () => {
        const arrayElements = {}
        let formLayoutObject = new Map()
        formLayoutObject.set(1, {
            label: 'xyz',
            subLabel: null,
            helpText: null,
            key: '7',
            required: true,
            hidden: false,
            value: 'hello',
            attributeTypeId: 2,
            fieldAttributeMasterId: 1,
            parentId: 0
        })
        const arrayRowDTO = {
            formLayoutObject
        }
        const newArrayElements = {
            allRequiredFieldsFilled: false,
        }
        let errorMessage
        //     { "arrayRowDTO": { "arrayElements": { "0": { "allRequiredFieldsFilled": false, "rowId": 0, "test": 1 } }, "isSaveDisabled": true, "lastRowId": 1}, "childElementsTemplate": { "allRequiredFieldsFilled": false, "rowId": 0, "test": 1 }}
        expect(arrayService.getSortedArrayChildElements(0, arrayElements, arrayRowDTO)).toEqual({
            arrayRowDTO: {
                arrayElements: {
                    0: {
                        allRequiredFieldsFilled: false,
                        rowId: 0,
                        formLayoutObject
                    }
                },
                isSaveDisabled: true,
                lastRowId: 1
            },
            childElementsTemplate: arrayRowDTO,
            errorMessage
        })
    })

})
describe('test cases for addArrayRow', () => {

    const formLayoutObject = new Map();
    formLayoutObject.set(1, {
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
    const nextEditable = 'test'
    const childElementsTemplate = {
        formLayoutObject,
        nextEditable
    }
    const arrayElements = {}
    const lastRowId = 0
    const arrayRowDTO = {
        arrayElements: {
            0: {
                allRequiredFieldsFilled: false,
                formLayoutObject,
                nextEditable,
                rowId: 0
            }
        },
        lastRowId: 1,
        isSaveDisabled: true
    }

    it('should return arrayElements with new row', () => {
        expect(arrayService.addArrayRow(lastRowId, childElementsTemplate, arrayElements)).toEqual(arrayRowDTO)
    })
})



describe('test cases for deleteArrayRow', () => {
    it('should return arrayElements with no rows', () => {
        const formLayoutObject = new Map();
        formLayoutObject.set(1, {
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
        const nextEditable = 'test'
        const childElementsTemplate = {
            formLayoutObject,
            nextEditable
        }
        const lastRowId = 0
        const arrayElements = {
            0: {
                formLayoutObject,
                nextEditable,
                rowId: 0
            }
        }
        const arrayRowDTO = {
            arrayElements,
            lastRowId: 1,
            isSaveDisabled: true
        }
        expect(arrayService.deleteArrayRow(arrayElements, 0, 1, true)).toEqual({})
    })
    it('should return arrayElements with 1 row and issavedisabled true', () => {
        const formLayoutObject = new Map();
        formLayoutObject.set(1, {
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
        const nextEditable = 'test'
        const childElementsTemplate = {
            formLayoutObject,
            nextEditable
        }
        const lastRowId = 3
        const arrayElements = {
            0: {
                formLayoutObject,
                nextEditable,
                rowId: 0
            },
            1: {
                formLayoutObject,
                nextEditable,
                rowId: 1
            }
        }
        expect(arrayService.deleteArrayRow(arrayElements, 1, lastRowId, true)).toEqual({
            0: {
                formLayoutObject,
                nextEditable,
                rowId: 0
            },
        }
        )
    })
    it('should return arrayElements with 1 row and issavedisabled false', () => {
        const formLayoutObject = new Map();
        formLayoutObject.set(1, {
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
        const nextEditable = 'test'
        const childElementsTemplate = {
            formLayoutObject,
            nextEditable
        }
        const lastRowId = 2
        const arrayElements = {
            0: {
                formLayoutObject,
                nextEditable,
                rowId: 0
            },
            1: {
                formLayoutObject,
                nextEditable,
                rowId: 1
            }
        }
        expect(arrayService.deleteArrayRow(arrayElements, 1, lastRowId, true)).toEqual({
            0: {
                formLayoutObject,
                nextEditable,
                rowId: 0
            },

        })
    })

})

describe('test cases for enableSaveIfRequired', () => {
    it('should return false for empty array elements', () => {
        expect(arrayService.enableSaveIfRequired({})).toEqual(false)
    })
    it('should return false for undefined array elements', () => {
        expect(arrayService.enableSaveIfRequired()).toEqual(false)
    })
    it('should return true for array elements with at least 1 required fields variable false', () => {
        const arrayElements = {
            0: {
                allRequiredFieldsFilled: false,
                rowId: 0,
                test: 1
            },
            1: {
                allRequiredFieldsFilled: true,
                rowId: 1,
                test: 1
            }
        }
        expect(arrayService.enableSaveIfRequired(arrayElements)).toEqual(true)
    })
    it('should return false for array elements with  required fields variable true', () => {
        const arrayElements = {
            0: {
                allRequiredFieldsFilled: true,
                rowId: 0,
                test: 1
            },
            1: {
                allRequiredFieldsFilled: true,
                rowId: 1,
                test: 1
            }
        }
        expect(arrayService.enableSaveIfRequired(arrayElements)).toEqual(false)
    })
})


describe('test cases for prepareArrayForSaving', () => {

    const formLayoutObject = new Map();
    formLayoutObject.set(1, {
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
    const nextEditable = 'test'
    const childElementsTemplate = {
        formLayoutObject,
        nextEditable
    }
    const lastRowId = 0
    const arrayElements = {
        0: {
            formLayoutObject,
            arrayMainObject: {
                id: 1,
                attributeTypeId: 3
            }
        }
    }
    const arrayParentItem = {
        positionId: 0
    }
    const fieldDataListWithLatestPositionId = {
        fieldDataList: [
            {
                attributeTypeId: 3,
                childDataList: [
                    {
                        attributeTypeId: 2,
                        fieldAttributeMasterId: 1,
                        jobTransactionId: 0,
                        parentId: 1,
                        positionId: 2,
                        value: "hello",
                    },
                ],
                fieldAttributeMasterId: 1,
                jobTransactionId: 0,
                parentId: 0,
                positionId: 1,
                value: "ObjectSarojFareye",
            },
        ],
        latestPositionId: 2,
    }
    it('should return fieldDataListWithLatestPositionId', () => {
        expect(arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, 0, 0)).toEqual(fieldDataListWithLatestPositionId)
    })
})
