'use strict'

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
        let jobDataQuery = '', jobMap = {}
        for (let index in jobsList) {
            const job = jobsList[index]
            const { attemptCount, id, jobEndTime, jobMasterId, jobStartTime, latitude, longitude, slot, referenceNo, groupId, jobPriority } = job
            jobDataQuery += index == 0 ? 'jobId = ' + id : ' OR jobId = ' + id
            jobMap[id] = { attemptCount, id, jobEndTime, jobMasterId, jobStartTime, latitude, longitude, slot, referenceNo, groupId, jobPriority, jobId: id }
        }
        jobDataQuery = `(${jobDataQuery}) AND parentId = 0`;
        return { jobMap, jobDataQuery }
    }

    /**
     * 
     * @param {*} jobId 
     */
    getJobForJobId(jobId) {
        const jobQuery = `id = ${jobId}`
        const job = realm.getRecordListOnQuery(TABLE_JOB, jobQuery)
        return job
    }
}

export let jobService = new Job()