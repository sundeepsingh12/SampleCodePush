'use strict'

import { checkBoxDataService } from '../classes/CheckBoxService'
import { CHECKBOX, RADIOBUTTON } from '../../lib/AttributeConstants'

describe('test cases for checkBoxService setorRemovestates', () => {
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
        expect(checkBoxDataService.setOrRemoveState(checkBoxValues, id, attributeTypeId)).toEqual({
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
        expect(checkBoxDataService.getcheckBoxDataList(wholeDataFromMaster, '43159')).toEqual({
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
        expect(checkBoxDataService.checkBoxDoneButtonClicked(checkBoxValues)[0]).toEqual({
            isChecked: true,
            id: 1,
            attributeTypeId: 2
        })
    })

})