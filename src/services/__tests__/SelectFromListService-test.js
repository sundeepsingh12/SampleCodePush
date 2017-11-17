'use strict'

import { selectFromListDataService } from '../classes/SelectFromListService'
import { CHECKBOX, RADIOBUTTON, DROPDOWN, TEXT } from '../../lib/AttributeConstants'
import { keyValueDBService } from '../classes/KeyValueDBService'
import {
    FIELD_ATTRIBUTE,
    TABLE_JOB_DATA
} from '../../lib/constants'

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


describe('OptionRadioMaster for getting and setting data', () => {
    it('it should get data for mapping of field with job attr data', () => {
        const fieldAttributeMasterId = '123'
        const fieldAttributeMasterList = {
            value: [
                {
                attributeTypeId:39,
                id:1,
                jobAttributeMasterId:30311,
                jobMasterId:3212,
                parentId:'123',
                },
                {
                attributeTypeId:40,
                id:2,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                },
                {
                attributeTypeId:41,
                id:3,
                jobAttributeMasterId:30309,
                jobMasterId:3212,
                parentId:1,
                }
            ]
    }
    const  radioMasterDto =  [
                {
                attributeTypeId:40,
                id:2,
                jobAttributeMasterId:30310,
                },
                {
                attributeTypeId:41,
                id:3,
                jobAttributeMasterId:30309,
                },
            
            ]
    expect(selectFromListDataService.getRadioForMasterDto(fieldAttributeMasterId,fieldAttributeMasterList)).toEqual(radioMasterDto)
})
  it('it should get data from job attribute', () => {
        const fieldAttributeMasterId = '123'
        const parentIdJobDataListMap = {
             0 : [
                {
                attributeTypeId:40,
                id:2,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                value:"v"
                },
                {
                attributeTypeId:41,
                id:3,
                jobAttributeMasterId:30309,
                jobMasterId:3212,
                parentId:1,
                value:"3"
                }
            ],
            1 : [
                {
                attributeTypeId:40,
                id:4,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                value:"f"
                },
                {
                attributeTypeId:41,
                id:5,
                jobAttributeMasterId:30309,
                jobMasterId:3212,
                parentId:1,
                value:"5"
                }
            ]
    }
        const currentElement = {
                attributeTypeId:39,
                childDataList: [
                    {
                    attributeTypeId:41,
                    fieldAttributeMasterId:3,
                    jobTransactionId:3479196,
                    parentId:1,
                    positionId:6,
                    value:"3",
                    },
                    {
                    attributeTypeId:40,
                    fieldAttributeMasterId:2,
                    jobTransactionId:3479196,
                    parentId:1,
                    positionId:7,
                    value:"v",
                    }
                ],
                id:1,
                jobAttributeMasterId:30311,
                jobMasterId:3212,
                parentId:'123',
        }
    const  innerObject =  {
                0:{
                id:0,
                optionKey: "v",
                optionValue:'3',
                isChecked:true
                },
                1:{
                id:1,
                optionKey: "f",
                optionValue:'5',
                },
            
    }
    expect(selectFromListDataService.getListDataForRadioMasterAttr(parentIdJobDataListMap,currentElement)).toEqual(innerObject)
})
it('it should get empty data from job attribute when mapping is mismatched', () => {
        const fieldAttributeMasterId = '123'
        const parentIdJobDataListMap = {
             0 : [
                {
                attributeTypeId:40,
                id:2,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                value:"v"
                },
            ],
            1 : [
                {
                attributeTypeId:40,
                id:4,
                jobAttributeMasterId:30310,
                jobMasterId:3212,
                parentId:1,
                value:"f"
                },
            ]
    }
        const currentElement = {
                attributeTypeId:39,
                id:1,
                jobAttributeMasterId:30311,
                jobMasterId:3212,
                parentId:'123',
        }
    expect(selectFromListDataService.getListDataForRadioMasterAttr(parentIdJobDataListMap,currentElement)).toEqual({})
})
})