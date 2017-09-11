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
        if (!jobAttributeMasterList) {
            jobAttributeMasterList = []
        }
        jobAttributeMasterList.forEach(jobAttributeMaster => {
            jobAttributeMasterMap[jobAttributeMaster.id] = jobAttributeMaster
        })

        return jobAttributeMasterMap
    }

    /**
     * This function traverses job attribute status list
     * @param {*} jobAttributeStatusList
     * @returns
     * Map<StatusId,Map<JobAttributeMasterId,JobAttributeStatus>>
     */
    getJobAttributeStatusMap(jobAttributeStatusList) {
        let jobAttributeStatusMap = {}
        if (!jobAttributeStatusList) {
            jobAttributeStatusList = []
        }
        jobAttributeStatusList.forEach(jobAttributeStatus => {
            if (!jobAttributeStatusMap[jobAttributeStatus.statusId]) {
                jobAttributeStatusMap[jobAttributeStatus.statusId] = {}
            }
            jobAttributeStatusMap[jobAttributeStatus.statusId][jobAttributeStatus.jobAttributeId] = jobAttributeStatus
            // jobAttributeStatus[statusId].push(jobAttributeStatus.jobAttributeId)
        })

        return jobAttributeStatusMap
    }

    /**
     * This function traverse job status list (as there is no job attribute status list)
     * @param {*} statusList 
     * @param {*} jobAttributeMasterMap 
     * @returns Map<StatusId,Map<JobAttributeMasterId,JobAttributeMaster>>
     */
    getAllJobAttributeStatusMap(statusList, jobAttributeMasterMap) {
        let jobAttributeStatusMap = {}
        if (!statusList) {
            statusList = []
        }
        statusList.forEach(status => {
            if (!jobAttributeStatusMap[status.id]) {
                jobAttributeStatusMap[status.id] = {}
            }
            jobAttributeStatusMap[status.id] = jobAttributeMasterMap
        })

        return jobAttributeStatusMap
    }

}

export let jobAttributeMasterService = new JobAttributeMaster()