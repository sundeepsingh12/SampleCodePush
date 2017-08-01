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

describe('test cases for getAllJobAttributeStatusMap', () => {

    const jobAttributeMasterMap = {
        10: {
            id: 10,
            label: 'xyz'
        }
    }

    it('should return empty jobAttributeStatusMap for undefined list', () => {
        expect(jobAttributeMasterService.getAllJobAttributeStatusMap(undefined, jobAttributeMasterMap)).toEqual({})
    })

    it('should return jobAttributeStatuMap for statusList', () => {
        const statusList = [
            {
                id: 1,
                name: 'xyz'
            },
            {
                id: 2,
                name: 'abc'
            },
            {
                id: 3,
                name: 'jkl'
            },
        ]

        const jobAttributeStatusMap = {
            1: {
                10: {
                    id: 10,
                    label: 'xyz'
                }
            },
            2: {
                10: {
                    id: 10,
                    label: 'xyz'
                }
            },
            3: {
                10: {
                    id: 10,
                    label: 'xyz'
                }
            }
        }
        expect(jobAttributeMasterService.getAllJobAttributeStatusMap(statusList,jobAttributeMasterMap)).toEqual(jobAttributeStatusMap)
    })

})