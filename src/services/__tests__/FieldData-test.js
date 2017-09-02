'use strict'

import { fieldDataService } from '../classes/FieldData'

describe('test cases for getFieldDataMap', () => {

    it('should return empty fieldDataMap', () => {
        expect(fieldDataService.getFieldDataMap([])).toEqual({})
    })

    it('should return fieldDataMap for specified fieldDataList', () => {
        const fieldDataList = [
            {
                jobTransactionId: 1,
                fieldAttributeMasterId: 10,
                value: 'abc',
                parentId : 0
            },
            {
                jobTransactionId: 1,
                fieldAttributeMasterId: 11,
                value: 1,
                parentId : 0
            },
            {
                jobTransactionId: 1,
                fieldAttributeMasterId: 12,
                value: 1,
                parentId : 1
            },
            {
                jobTransactionId: 2,
                fieldAttributeMasterId: 10,
                value: 'xyz',
                parentId : 0
            }
        ]

        const fieldDataMap = {
            1: {
                10: {
                    jobTransactionId: 1,
                    fieldAttributeMasterId: 10,
                    value: 'abc',
                },
                11: {
                    jobTransactionId: 1,
                    fieldAttributeMasterId: 11,
                    value: 1
                }
            },
            2: {
                10: {
                    jobTransactionId: 2,
                    fieldAttributeMasterId: 10,
                    value: 'xyz'
                }
            }
        }
        
        expect(fieldDataService.getFieldDataMap(fieldDataList)).toEqual(fieldDataMap)
    })

})