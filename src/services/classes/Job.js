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
            let jobObj = {...job}
            jobMap[jobObj.id] = jobObj
        })
        return jobMap
    }
}

export let jobService = new Job()