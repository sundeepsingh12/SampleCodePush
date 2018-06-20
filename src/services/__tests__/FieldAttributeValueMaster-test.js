'use strict'


import {
    fieldAttributeValueMasterService
} from '../classes/FieldAttributeValueMaster'

describe('test for filterFieldAttributeValueList', () => {

    it('should get empty list for empty field attribute value list', () => {
        expect(fieldAttributeValueMasterService.filterFieldAttributeValueList([], 1)).toEqual([])
    })

    it('should get list for field attribute value list matching master id', () => {
        const fieldAttributeValueList = [
            {
                fieldAttributeMasterId: 1,
                id: 1,
                name: 'a'
            },
            {
                fieldAttributeMasterId: 1,
                id: 1,
                name: 'a'
            },
            {
                fieldAttributeMasterId: 2,
                id: 1,
                name: 'a'
            },
        ]
        const result = [
            {
                fieldAttributeMasterId: 1,
                id: 1,
                name: 'a'
            },
            {
                fieldAttributeMasterId: 1,
                id: 1,
                name: 'a'
            },
        ]
        expect(fieldAttributeValueMasterService.filterFieldAttributeValueList(fieldAttributeValueList, 1)).toEqual(result)
    })

})