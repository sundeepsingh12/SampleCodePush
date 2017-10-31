'use strict'

import { selectFromListDataService } from '../classes/SelectFromListService'
import { CHECKBOX, RADIOBUTTON, DROPDOWN, TEXT } from '../../lib/AttributeConstants'

describe('test cases for selectFromListService setorRemovestates', () => {

    it('should dispatch action', () => {
        let selectFromListValues = {
            1: {
                isChecked: false,
                id: 1,
                attributeTypeId: 8,
            },
            2: {
                isChecked: false,
                id: 2,
                attributeTypeId: 8,
            },
            3: {
                isChecked: false,
                id: 3,
                attributeTypeId: 8,
            }
        }
        let id = 1
        let attributeTypeId = CHECKBOX
        expect(selectFromListDataService.setOrRemoveState(selectFromListValues, id, attributeTypeId)).toEqual({
            1: {
                isChecked: true,
                id: 1,
                attributeTypeId: 2,
            },
            2: {
                isChecked: false,
                id: 2,
                attributeTypeId: 8,
            },
            3: {
                isChecked: false,
                id: 3,
                attributeTypeId: 8,
            }
        })
    })

    it('should dispatch actionwith different attributeTypeId ', () => {
        let selectFromListValues = {
            1: {
                isChecked: false,
                id: 1,
                attributeTypeId: 8,
            },
            2: {
                isChecked: false,
                id: 2,
                attributeTypeId: 8,
            },
            3: {
                isChecked: false,
                id: 3,
                attributeTypeId: 8,
            }
        }
        let id = 1
        let attributeTypeId = TEXT
        expect(selectFromListDataService.setOrRemoveState(selectFromListValues, id, attributeTypeId)).toEqual({
            1: {
                isChecked: true,
                id: 1,
                attributeTypeId: 8,
            },
            2: {
                isChecked: false,
                id: 2,
                attributeTypeId: 8,
            },
            3: {
                isChecked: false,
                id: 3,
                attributeTypeId: 8,
            }
        })
    })
})

describe('test cases for selectFromListService getListSelectFromListAttribute', () => {

    it('to get data list', () => {
        let wholeDataFromMaster = [
            {
                id: 34044,
                name: '1',
                code: '1',
                fieldAttributeMasterId: 42124,
                sequence: 1
            },
            {
                id: 34043,
                name: '2000',
                code: '2000',
                fieldAttributeMasterId: 43159,
                sequence: 5
            }]
        let id = 1
        let attributeTypeId = CHECKBOX
        expect(selectFromListDataService.getListSelectFromListAttribute(wholeDataFromMaster, '43159')).toEqual({
            '34043':
            {
                id: 34043,
                name: '2000',
                code: '2000',
                fieldAttributeMasterId: 43159,
                sequence: 5
            }
        })
    })

    it('to get data list with no matching fieldattributeId', () => {

        let wholeDataFromMaster = [
            {
                id: 34044,
                name: '1',
                code: '1',
                fieldAttributeMasterId: 42124,
                sequence: 1
            },
            {
                id: 34043,
                name: '2000',
                code: '2000',
                fieldAttributeMasterId: 4319,
                sequence: 5
            }]
        let id = 1
        let attributeTypeId = CHECKBOX
        expect(selectFromListDataService.getListSelectFromListAttribute(wholeDataFromMaster, '43159')).toEqual({})
    })
})

describe('test cases for selectFromListService selectFromListDoneButtonClicked', () => {
it('after clicking done button', () => {
 let selectFromListValue = {
        1:
        {
            fieldAttributeMasterId: 43159,
            id: 1,
            isChecked: true,
            attributeTypeId: 8,
            name: 'abc',
            sequence: 8,
            code: '123',
        }
    }
    let id = 1
    let attributeTypeId = CHECKBOX
    expect(selectFromListDataService.selectFromListDoneButtonClicked(CHECKBOX, selectFromListValue)[0]).toEqual({
        name: 'abc',
        value: '123',
        sequence: 8,
        fieldAttributeMasterId: 43159,
        id: 1,
        isChecked: true,
    })
})

it('after clicking done button with incorrect values', () => {
    let selectFromListValue = {
        1:
        {
            fieldAttributeMasterId: 43159,
            id: 1,
            isChecked: false,
            attributeTypeId: 8,
            name: 'abc',
            sequence: 8,
            code: '123',
        }
    }
    let id = 1
    let attributeTypeId = RADIOBUTTON
    expect(selectFromListDataService.selectFromListDoneButtonClicked(CHECKBOX, selectFromListValue)[0]).toEqual(undefined)
})
})