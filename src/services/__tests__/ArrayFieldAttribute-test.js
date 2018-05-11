'use strict'

import { arrayService } from '../classes/ArrayFieldAttribute'
import {
    ARRAY_SAROJ_FAREYE,
    OBJECT_SAROJ_FAREYE,
} from '../../lib/AttributeConstants'
import {
    INVALID_CONFIG_ERROR
} from '../../lib/ContainerConstants'
import { backupService } from '../classes/BackupService';
describe('test cases for getSortedArrayChildElements', () => {

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
        expect(arrayService.getSortedArrayChildElements(arrayRowDTO, {}, {})).toEqual({
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
        const arrayMainObject = {}
        const arrayRowDTO = {
            formLayoutObject,
            arrayMainObject
        }
        const newArrayElements = {
            allRequiredFieldsFilled: false,
        }
        let errorMessage
        expect(arrayService.getSortedArrayChildElements(arrayRowDTO, {}, {}, 1)).toEqual({
            arrayRowDTO: {
                arrayElements: {
                    0: {
                        allRequiredFieldsFilled: false,
                        rowId: 0,
                        formLayoutObject
                    }
                },
                isSaveDisabled: false,
                lastRowId: 1,
            },
            childElementsTemplate: {
                rowId: 0,
                formLayoutObject,
                allRequiredFieldsFilled: false

            },
            errorMessage,
            arrayReverseDataStoreFilterMap: { 1: {} },
            arrayMainObject
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
    const childElementsTemplate = {
        formLayoutObject,
    }
    const arrayElements = {}
    const lastRowId = 0
    const arrayRowDTO = {
        arrayElements: {
            0: {
                allRequiredFieldsFilled: false,
                formLayoutObject,
                rowId: 0
            }
        },
        lastRowId: 1,
        isSaveDisabled: false
    }

    it('should return arrayElements with new row', () => {
        expect(arrayService.addArrayRow(lastRowId, childElementsTemplate, arrayElements, {}, true)).toEqual(arrayRowDTO)
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
        attributeTypeId: 2,
        fieldAttributeMasterId: 1,
        parentId: 0,
        displayValue: 'abc'
    })
    const nextEditable = 'test'
    const childElementsTemplate = {
        formLayoutObject,
        nextEditable
    }
    const lastRowId = 0
    let arrayMainObject = {
        id: 1,
        attributeTypeId: 3,
        key: 1
    }
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
                        key: '7',
                        value: 'abc'
                    },
                ],
                fieldAttributeMasterId: 1,
                jobTransactionId: 0,
                parentId: 0,
                positionId: 1,
                value: "ObjectSarojFareye",
                key: 1
            },
        ],
        latestPositionId: 2,
    }
    it('should return fieldDataListWithLatestPositionId', () => {
        expect(arrayService.prepareArrayForSaving(arrayElements, arrayParentItem, { id: 0 }, 0, arrayMainObject)).toEqual({ fieldDataListWithLatestPositionId, isSaveDisabled: false })
    })
})

describe('test cases for findNextEditableAndSetSaveDisabled', () => {

    const formLayoutObject = new Map();
    formLayoutObject.set(1, {
        label: 'xyz',
        subLabel: null,
        helpText: null,
        key: '7',
        required: false,
        attributeTypeId: 2,
        fieldAttributeMasterId: 1,
        parentId: 0,
        displayValue: 'abc',
        focus: true
    })
    formLayoutObject.set(2, {
        label: 'xyz1',
        subLabel: null,
        helpText: null,
        key: '70',
        required: false,
        attributeTypeId: 2,
        fieldAttributeMasterId: 2,
        parentId: 0,
    })
    const arrayElements = {
        0: {
            formLayoutObject,
        }
    }
    let resultFormObject = new Map()
    resultFormObject.set(1, {
        label: 'xyz',
        subLabel: null,
        helpText: null,
        key: '7',
        required: false,
        attributeTypeId: 2,
        fieldAttributeMasterId: 1,
        parentId: 0,
        displayValue: 'abc',
        focus: false
    })
    resultFormObject.set(2, {
        label: 'xyz1',
        subLabel: null,
        helpText: null,
        key: '70',
        required: false,
        attributeTypeId: 2,
        fieldAttributeMasterId: 2,
        parentId: 0,
        focus: true,
        childDataList: {},
        displayValue: 'test'
    })

    let result = {
        newArrayElements: {
            0: {
                formLayoutObject: resultFormObject,
                allRequiredFieldsFilled: true
            }
        },
        isSaveDisabled: false

    }
    it('should return array elements with next element on focus', () => {
        expect(arrayService.findNextEditableAndSetSaveDisabled(2, arrayElements, true, 0, 'test', {}, 'NEXT_FOCUS', {})).toEqual(result)
    })
})
function getMapFromObject(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}