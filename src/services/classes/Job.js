import * as realm from '../../repositories/realmdb'
const {
    TABLE_JOB,
} = require('../../lib/constants').default
import _ from 'underscore'

class Job {

    getAllJobs() {
        const allJobs = realm.getAll(TABLE_JOB)
        return allJobs
    }

    getJobForJobId(jobId) {
        let allJobs = this.getAllJobs()
        filteredData = allJobs.filtered(`id = ${jobId}`)
        return filteredData
    }

    /**
     * 
     * @param {*} jobsList 
     * @returns
     * Map<JobId,Job>
     */
    getJobMap(jobsList) {
        let jobMap = {}
        jobsList.forEach(job => {
            const id = job.id
            const latitude = job.latitude
            const longitude = job.longitude
            const attemptCount = job.attemptCount
            const slot = job.slot
            const jobStartTime = job.jobStartTime
            const jobEndTime = job.jobEndTime
            const jobMasterId = job.jobMasterId
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