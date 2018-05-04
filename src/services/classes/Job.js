import * as realm from '../../repositories/realmdb'
import {
    TABLE_JOB,
} from '../../lib/constants'

class Job {

    /**
     * 
     * @param {*} jobsList 
     * @returns
     * JobMap : {
     *             JobId : Job
     *          }
     */
    getJobMapAndJobDataQuery(jobsList) {
        let jobQuery = '',
            jobDataQuery = '',
            jobMap = {}
        for (let index in jobsList) {
            const job = jobsList[index]
            const {
                attemptCount,
                id,
                jobEndTime,
                jobMasterId,
                jobStartTime,
                latitude,
                longitude,
                slot,
                referenceNo
            } = job
            if (index == 0) {
                jobDataQuery += 'jobId = ' + id
            } else {
                jobDataQuery += ' OR jobId = ' + id
            }
            jobMap[id] = {
                attemptCount,
                id,
                jobEndTime,
                jobMasterId,
                jobStartTime,
                latitude,
                longitude,
                slot,
                referenceNo
            }
        }
        return { jobMap, jobDataQuery }
    }
}

export let jobService = new Job()