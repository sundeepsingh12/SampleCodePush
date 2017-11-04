'use strict'

import { jobService } from '../classes/Job'

describe('test cases for getJobMap', () => {

    it('should return empty job map', () => {
        const jobList = []
        expect(jobService.getJobMap(jobList)).toEqual({})
    })

    it('should return job map for job list', () => {
        const jobList = [
            {
                attemptCount: 1,
                id: 1,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1

            },
            {
                attemptCount: 1,
                id: 2,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1

            },
            {
                attemptCount: 1,
                id: 3,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1

            },
        ]

        const jobMap = {
            1: {
                attemptCount: 1,
                id: 1,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1

            },
            2: {
                attemptCount: 1,
                id: 2,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1

            },
            3: {
                attemptCount: 1,
                id: 3,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1

            }
        }

        expect(jobService.getJobMap(jobList)).toEqual(jobMap)
    })

})