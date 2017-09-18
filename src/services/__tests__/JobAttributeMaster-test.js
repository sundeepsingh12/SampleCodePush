'use strict'

import { jobAttributeMasterService } from '../classes/JobAttributeMaster'

describe('test cases for getJobAttributeMasterMap', () => {

    it('should return empty jobAttributeMasterMap for undefined list', () => {
        expect(jobAttributeMasterService.getJobAttributeMasterMap(undefined)).toEqual({})
    })

    it('should return jobAttributeMasterMap for jobAttributeMasterList', () => {
        const jobAttributeMasterList = [
            {
                id: 1,
                label: 'xyz'
            },
            {
                id: 2,
                label: 'abc'
            }
        ]
        const jobAttributeMasterMap = {
            1: {
                id: 1,
                label: 'xyz'
            },
            2: {
                id: 2,
                label: 'abc'
            }
        }
        expect(jobAttributeMasterService.getJobAttributeMasterMap(jobAttributeMasterList)).toEqual(jobAttributeMasterMap)
    })

})

describe('test cases for getJobAttributeStatusMap', () => {

    it('should return empty jobAttributeStatusMap for undefined list', () => {
        expect(jobAttributeMasterService.getJobAttributeStatusMap(undefined)).toEqual({})
    })

    it('should return jobAttributeStatusMap for jobAttributeStatusList', () => {
        const jobAttributeStatusList = [
            {
                statusId: 1,
                jobAttributeId: 10
            },
            {
                statusId: 1,
                jobAttributeId: 11
            },
            {
                statusId: 2,
                jobAttributeId: 10
            },
            {
                statusId: 2,
                jobAttributeId: 12
            }
        ]

        const jobAttributeStatusMap = {
            1: {
                10: {
                    statusId: 1,
                    jobAttributeId: 10
                },
                11: {
                    statusId: 1,
                    jobAttributeId: 11
                }
            },
            2: {
                10: {
                    statusId: 2,
                    jobAttributeId: 10
                },
                12: {
                    statusId: 2,
                    jobAttributeId: 12
                }
            }
        }
        expect(jobAttributeMasterService.getJobAttributeStatusMap(jobAttributeStatusList)).toEqual(jobAttributeStatusMap)
    })

})

describe('test cases for getJobMasterJobAttributeMasterMap', () => {
    const jobAttributeMasterList = [
        {
            id: 1,
            jobMasterId: 1,
            label: 'xyz',
        },
        {
            id: 2,
            jobMasterId: 1,
            label: 'abc'
        },
        {
            id: 3,
            jobMasterId: 1,
            label: 'abc'
        },
        {
            id: 4,
            jobMasterId: 2,
            label: 'abc'
        }
    ]

    const jobMasterJobAttributeMasterMap = {
        1: {
            1: {
                id: 1,
                jobMasterId: 1,
                label: 'xyz',
            },
            2: {
                id: 2,
                jobMasterId: 1,
                label: 'abc'
            },
            3: {
                id: 3,
                jobMasterId: 1,
                label: 'abc'
            },
        },
        2: {
            4: {
                id: 4,
                jobMasterId: 2,
                label: 'abc'
            }
        }
    }

    it('should return empty jobMasterJobAttributeMasterMap for undefined list', () => {
        expect(jobAttributeMasterService.getJobMasterJobAttributeMasterMap(undefined)).toEqual({})
    })

    it('should return jobMasterJobAttributeMasterMap for jobAttributeMasterList', () => {
        expect(jobAttributeMasterService.getJobMasterJobAttributeMasterMap(jobAttributeMasterList)).toEqual(jobMasterJobAttributeMasterMap)
    })
})