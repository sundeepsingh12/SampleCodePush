
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
        return { jobMap, jobDataQuery }
    }
}

export let jobService = new Job()