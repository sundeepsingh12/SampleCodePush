'use strict'

import { fieldAttributeMasterService } from '../classes/FieldAttributeMaster'

describe('test cases for getFieldAttributeMasterMap', () => {
    const fieldAttributeMasterList = [
        {
            id: 1,
            label: 'xyz',
            jobMasterId: 1
        },
        {
            id: 2,
            label: 'abc',
            jobMasterId: 1
        },
        {
            id: 3,
            label: 'abd',
            jobMasterId: 2
        }
    ]
    const fieldAttributeMasterMap = {
        1: {
            1: {
                id: 1,
                label: 'xyz',
                jobMasterId: 1
            },
            2: {
                id: 2,
                label: 'abc',
                jobMasterId: 1
            }
        },
        2: {
            3: {
                id: 3,
                label: 'abd',
                jobMasterId: 2
            }
        }
    }

    it('should return empty fieldAttributeMasterMap for undefined fieldAttributeMasterList', () => {
        expect(fieldAttributeMasterService.getFieldAttributeMasterMap(undefined)).toEqual({})
    })

    it('should return empty fieldAttributeMasterMap for empty fieldAttributeMasterList', () => {
        expect(fieldAttributeMasterService.getFieldAttributeMasterMap([])).toEqual({})
    })

    it('should return fieldAttributeMasterMap for fieldAttributeMasterList', () => {
        expect(fieldAttributeMasterService.getFieldAttributeMasterMap(fieldAttributeMasterList)).toEqual(fieldAttributeMasterMap)
    })
})

describe('test cases for getFieldAttributeStatusMap', () => {

    const fieldAttributeStatusList = [
        {
            statusId: 1,
            fieldAttributeId: 10
        },
        {
            statusId: 1,
            fieldAttributeId: 11
        },
        {
            statusId: 2,
            fieldAttributeId: 10
        },
        {
            statusId: 2,
            fieldAttributeId: 12
        }
    ]

    const fieldAttributeStatusMap = {
        10: {
            statusId: 2,
            fieldAttributeId: 10
        },
        11: {
            statusId: 1,
            fieldAttributeId: 11
        },
        12: {
            statusId: 2,
            fieldAttributeId: 12
        }
    }

    it('should return empty fieldAttributeStatusMap for undefined fieldAttributeStatusList', () => {
        expect(fieldAttributeMasterService.getFieldAttributeStatusMap(undefined)).toEqual({})
    })

    it('should return empty fieldAttributeMasterMap for empty fieldAttributeMasterList', () => {
        expect(fieldAttributeMasterService.getFieldAttributeStatusMap([])).toEqual({})
    })

    it('should return fieldAttributeStatusMap for fieldAttributeMasterList', () => {
        expect(fieldAttributeMasterService.getFieldAttributeStatusMap(fieldAttributeStatusList)).toEqual(fieldAttributeStatusMap)
    })

})