'use strict'

import { selectFromListDataService } from '../classes/selectFromListService'
import { CHECKBOX, RADIOBUTTON } from '../../lib/AttributeConstants'

describe('test cases for selectFromListService setorRemovestates', () => {
    let checkBoxValues = {
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

    let checkBoxValue = {1:
        {
            fieldAttributeMasterId:43159,
            id: 1,            
            isChecked: true,
            attributeTypeId: 8,
            name:'abc',
            sequence:8,
            code:'123',
    }
    }

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

    it('should dispatch action', () => {

        let id = 1
        let attributeTypeId = CHECKBOX
        expect(selectFromListDataService.setOrRemoveState(checkBoxValues, id, attributeTypeId)).toEqual({
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

    it('to get check box data list', () => {

        let id = 1
        let attributeTypeId = CHECKBOX
        expect(selectFromListDataService.getcheckBoxDataList(wholeDataFromMaster, '43159')).toEqual({
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

    it('after clicking done button', () => {

        let id = 1
        let attributeTypeId = CHECKBOX
        expect(selectFromListDataService.checkBoxDoneButtonClicked(CHECKBOX, checkBoxValue)[0]).toEqual({
            name:'abc',
            value:'123',
            sequence:8,
            fieldAttributeMasterId:43159,
            id: 1,            
            isChecked: true,
        })
    })

})