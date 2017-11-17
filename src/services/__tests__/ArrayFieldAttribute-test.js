'use strict'

import { arrayService } from '../classes/ArrayFieldAttribute'

describe('test cases for getSortedArrayChildElements', () => {
    it('should return arrayElements with 1 row', () => {
        const arrayElements = {}
        const arrayRowDTO = { test: 1 }
        const newArrayElements = {
            allRequiredFieldsFilled: false,
            rowId: 0,
            test: 1
        }
        //     { "arrayRowDTO": { "arrayElements": { "0": { "allRequiredFieldsFilled": false, "rowId": 0, "test": 1 } }, "isSaveDisabled": true, "lastRowId": 1}, "childElementsTemplate": { "allRequiredFieldsFilled": false, "rowId": 0, "test": 1 }}
        expect(arrayService.getSortedArrayChildElements(0, arrayElements, arrayRowDTO)).toEqual({
            arrayRowDTO: {
                arrayElements: {
                    0: newArrayElements
                },
                isSaveDisabled: true,
                lastRowId: 1
            },
            childElementsTemplate: arrayRowDTO
        })
    })
    it('should return empty arrayElements', () => {
        expect(arrayService.getSortedArrayChildElements(0, { test: 1 }, {})).toEqual({ test: 1 })

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


