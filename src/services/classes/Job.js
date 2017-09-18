import * as realm from '../../repositories/realmdb'
const {
    TABLE_JOB,
} = require('../../lib/constants').default
import _ from 'underscore'

class Job {

    /**
     * 
     * @param {*} jobsList 
     * @returns
     * JobMap : {
     *             JobId : Job
     *          }
     */
    getJobMap(jobsList) {
        let jobMap = {}
        jobsList.forEach(job => {
            const {
                attemptCount,
                id,
                jobEndTime,
                jobMasterId,
                jobStartTime,
                latitude,
                longitude,
                slot
            } = job
            jobMap[id] = {
                attemptCount,
                id,
                jobEndTime,
                jobMasterId,
                jobStartTime,
                latitude,
                longitude,
                slot
            }
        })
        return jobMap
    }
}

export let jobService = new Job()