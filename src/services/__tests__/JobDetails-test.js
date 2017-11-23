'use strict'

import { jobDetailsService } from '../classes/JobDetails'

describe('test cases for prepareDataObject', () => {
    const realmDBDataList = [
        {
            id: 0,
            jobAttributeMasterId: 1,
            jobId: 1,
            parentId: 0,
            positionId: 1,
            value: 'xyz',
        },
        {
            id: 0,
            jobAttributeMasterId: 2,
            jobId: 1,
            parentId: 0,
            positionId: 2,
            value: 91727217123,
        },
        {
            id: 0,
            jobAttributeMasterId: 3,
            jobId: 1,
            parentId: 0,
            positionId: 3,
            value: 62,
        },
        {
            id: 0,
            jobAttributeMasterId: 4,
            jobId: 1,
            parentId: 0,
            positionId: 4,
            value: 'address line 1',
        },
        {
            id: 0,
            jobAttributeMasterId: 5,
            jobId: 1,
            parentId: 0,
            positionId: 5,
            value: 'abc',
        },
        {
            id: 0,
            jobAttributeMasterId: 6,
            jobId: 1,
            parentId: 0,
            positionId: 6,
            value: 'ArraySarojFareye',
        },
        {
            id: 0,
            jobAttributeMasterId: 7,
            jobId: 1,
            parentId: 6,
            positionId: 7,
            value: 'ObjectSarojFareye',
        },
        {
            id: 0,
            jobAttributeMasterId: 8,
            jobId: 1,
            parentId: 7,
            positionId: 8,
            value: 'test11',
        },
        {
            id: 0,
            jobAttributeMasterId: 9,
            jobId: 1,
            parentId: 7,
            positionId: 9,
            value: 'test12',
        },
        {
            id: 0,
            jobAttributeMasterId: 10,
            jobId: 1,
            parentId: 7,
            positionId: 10,
            value: 'test13',
        },
        {
            id: 0,
            jobAttributeMasterId: 7,
            jobId: 1,
            parentId: 6,
            positionId: 11,
            value: 'ObjectSarojFareye',
        },
        {
            id: 0,
            jobAttributeMasterId: 8,
            jobId: 1,
            parentId: 11,
            positionId: 12,
            value: 'test21',
        },
        {
            id: 0,
            jobAttributeMasterId: 9,
            jobId: 1,
            parentId: 11,
            positionId: 13,
            value: 'test22',
        },
        {
            id: 0,
            jobAttributeMasterId: 10,
            jobId: 1,
            parentId: 11,
            positionId: 14,
            value: 'test23',
        },
    ]

    const attributeMasterMap = {
        1: {
            attributeTypeId: 1,
            hidden: false,
            id: 1,
            label: 'name',
        },
        2: {
            attributeTypeId,
            hidden: false,
            id: 2,
            label: 'number',
        },
        3: {
            attributeTypeId,
            hidden: true,
            id: 3,
            label: 'num',
        },
        4: {
            attributeTypeId,
            hidden: false,
            id: 4,
            label: 'address',
        },
        5: {
            attributeTypeId,
            hidden: true,
            id: 5,
            label: 'text',
        },
        6: {
            attributeTypeId,
            hidden: false,
            id: 6,
            label: 'array',
        },
        7: {
            attributeTypeId,
            hidden: false,
            id: 7,
            label: 'object',
        },
        8: {
            attributeTypeId,
            hidden: false,
            id: 8,
            label: 'text1',
        },
        9: {
            attributeTypeId,
            hidden: true,
            id: 9,
            label: 'text2',
        },
        10: {
            attributeTypeId,
            hidden: false,
            id: 10,
            label: 'text3',
        }
    }
    it('should return empty data list fo rempty data', () => {

    })
})

describe('test cases for checkJobExpiryTime', () => {
    const result = "Job Expired!"
    const dataList = {
        '4748': {
            'data': {
                id: 4477616,
                jobAttributeMasterId: 4748,
                jobId: 134814,
                parentId: 0,
                positionId: 2,
                value: "2017-11-22 00:51:00",
            },
            label: "jobTime",
            sequence: 3
        }

    }
    it('should check whether jobExpire or not', () => {
    expect(jobDetailsService.checkJobExpire(dataList)).toEqual(result)
    })

})