'use strict'

class JobAttributeMaster {

    /**
     * 
     * @param {*} jobAttributeMasterList 
     * @returns
     * Map<JobAttributeMasterId,JobAttributeMaster>
     */
    getJobAttributeMasterMap(jobAttributeMasterList) {
        let jobAttributeMasterMap = {}
        jobAttributeMasterList.forEach(jobAttributeMaster => {
            jobAttributeMasterMap[jobAttributeMaster.id] = jobAttributeMaster
        })

        return jobAttributeMasterMap
    }

    /**
     * 
     * @param {*} jobAttributeStatusList
     * @returns
     * Map<StatusId,Map<JobAttributeMasterId,JobAttributeStatus>>
     */
    getJobAttributeStatusMap(jobAttributeStatusList) {
        let jobAttributeStatusMap = {}
        jobAttributeStatusList.forEach(jobAttributeStatus => {
            if(!jobAttributeStatusMap[jobAttributeStatus.statusId]) {
                jobAttributeStatusMap[jobAttributeStatus.statusId] = {}
            }
            jobAttributeStatusMap[jobAttributeStatus.statusId][jobAttributeStatus.jobAttributeId] = jobAttributeStatus
            // jobAttributeStatus[statusId].push(jobAttributeStatus.jobAttributeId)
        })

        return jobAttributeStatusMap
    }
}

export let jobAttributeMasterService = new JobAttributeMaster()