'use strict'

import { jobDataService } from '../classes/JobData'

describe('test cases for getJobDataDetailsForListing', () => {

    const jobAttributeMasterMap = {
        10: {
            hidden: false,
            attributeTypeId: 11
        },
        11: {
            hidden: false,
            attributeTypeId: 28
        },
        12: {
            hidden: false,
            attributeTypeId: 27
        },
        13: {
            hidden: true,
            attributeTypeId: 27
        },
        15: {
            hidden: true,
            attributeTypeId: 28
        }
    }

    const jobDataList = [
        {
            jobId: 1,
            jobAttributeMasterId: 10,
            value: 'xyz',
            parentId: 0
        },
        {
            jobId: 1,
            jobAttributeMasterId: 11,
            value: 'testaddress',
            parentId: 1
        },
        {
            jobId: 1,
            jobAttributeMasterId: 12,
            value: '989869182',
            parentId: 0
        },
        {
            jobId: 2,
            jobAttributeMasterId: 10,
            value: 'xyz',
            parentId: 0
        },
        {
            jobId: 2,
            jobAttributeMasterId: 13,
            value: '98898723',
            parentId: 0
        },
        {
            jobId: 3,
            jobAttributeMasterId: 11,
            value: 'testaddress2',
            parentId: 0
        },
        {
            jobId: 3,
            jobAttributeMasterId: 14,
            value: '98898723',
            parentId: 0
        },
        {
            jobId: 4,
            jobAttributeMasterId: 12,
            value: '988',
            parentId: 0
        },
        {
            jobId: 4,
            jobAttributeMasterId: 15,
            value: null,
            parentId: 0
        },
        {
            jobId: 5,
            jobAttributeMasterId: 12,
            value: null,
            parentId: 0
        },
        {
            jobId: 5,
            jobAttributeMasterId: 15,
            value: 'testaddress3',
            parentId: 0
        },
    ]

    const jobDataMap = {
        1: {
            10: {
                jobId: 1,
                jobAttributeMasterId: 10,
                value: 'xyz'
            },
            12: {
                jobId: 1,
                jobAttributeMasterId: 12,
                value: '989869182'
            },
        },
        2: {
            10: {
                jobId: 2,
                jobAttributeMasterId: 10,
                value: 'xyz'
            },
            13: {
                jobId: 2,
                jobAttributeMasterId: 13,
                value: '98898723'
            },
        },
        3: {
            11: {
                jobId: 3,
                jobAttributeMasterId: 11,
                value: 'testaddress2'
            },
            14: {
                jobId: 3,
                jobAttributeMasterId: 14,
                value: '98898723'
            },
        },
        4: {
            12: {
                jobId: 4,
                jobAttributeMasterId: 12,
                value: '988'
            },
            15: {
                jobId: 4,
                jobAttributeMasterId: 15,
                value: null
            },
        },
        5: {
            12: {
                jobId: 5,
                jobAttributeMasterId: 12,
                value: null
            },
            15: {
                jobId: 5,
                jobAttributeMasterId: 15,
                value: 'testaddress3'
            },
        }
    }

    const contactMap = {
        1: [
            {
                jobId: 1,
                jobAttributeMasterId: 12,
                value: '989869182'
            }
        ],
    }

    const addressMap = {
        3: [
            {
                jobId: 3,
                jobAttributeMasterId: 11,
                value: 'testaddress2'
            }
        ]
    }

    it('should return empty jobDataMap,contactMap,addressMap for empty jobDataList', () => {
        const result = {
            jobDataMap: {},
            contactMap: {},
            addressMap: {}
        }
        expect(jobDataService.getJobDataDetailsForListing([], [])).toEqual(result)
    })

    it('should return jobDataMap,contactMap,addressMap for specified jobDataList', () => {
        const result = {
            jobDataMap,
            contactMap,
            addressMap
        }
        expect(jobDataService.getJobDataDetailsForListing(jobDataList, jobAttributeMasterMap)).toEqual(result)
    })

})