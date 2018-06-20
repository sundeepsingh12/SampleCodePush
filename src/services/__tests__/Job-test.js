'use strict'

import { jobService } from '../classes/Job'

describe('test cases for getJobMap', () => {

    it('should return empty job map', () => {
        const jobList = []
        const result = {
            jobMap: {},
            jobDataQuery: ''
        }
        expect(jobService.getJobMapAndJobDataQuery(jobList)).toEqual(result)
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
                slot: 1,
                referenceNo: 1

            },
            {
                attemptCount: 1,
                id: 2,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1,
                referenceNo: 1


            },
            {
                attemptCount: 1,
                id: 3,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1,
                referenceNo: 1

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
                slot: 1,
                referenceNo: 1

            },
            2: {
                attemptCount: 1,
                id: 2,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1,
                referenceNo: 1

            },
            3: {
                attemptCount: 1,
                id: 3,
                jobEndTime: 1,
                jobMasterId: 1,
                jobStartTime: 1,
                latitude: 1,
                longitude: 1,
                slot: 1,
                referenceNo: 1
            }
        }
        const result = {
            jobMap,
            jobDataQuery: 'jobId = 1 OR jobId = 2 OR jobId = 3'
        }
        expect(jobService.getJobMapAndJobDataQuery(jobList)).toEqual(result)
    })

})