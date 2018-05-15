'use strict'

class JobAttributeMaster {

    /**
     * @param {*} jobAttributeMasterList 
     * @returns
     * JobMasterJobAttributeMasterMap : {
     *                                      jobMasterId : {
     *                                                      jobAttributeMasterId : {jobAttributeMaster}
     *                                                    }
     *                                  }
     */
    getJobMasterJobAttributeMasterMap(jobAttributeMasterList) {
        let jobMasterJobAttributeMasterMap = {}
        jobAttributeMasterList = jobAttributeMasterList ? jobAttributeMasterList : []
        jobAttributeMasterList.forEach(jobAttributeMaster => {
            jobMasterJobAttributeMasterMap[jobAttributeMaster.jobMasterId] = jobMasterJobAttributeMasterMap[jobAttributeMaster.jobMasterId] ? jobMasterJobAttributeMasterMap[jobAttributeMaster.jobMasterId] : {}
            jobMasterJobAttributeMasterMap[jobAttributeMaster.jobMasterId][jobAttributeMaster.id] = jobAttributeMaster
        })

        return jobMasterJobAttributeMasterMap
    }

    /**
     * @param {*} jobAttributeStatusList
     * @returns
     * JobAttributeStatusMap : {
     *                              statusId : {
     *                                              jobAttributeMasterId : {jobAttributeStatus}
     *                                         }
     *                         }
     */
    getJobAttributeStatusMap(jobAttributeStatusList) {
        let jobAttributeStatusMap = {}
        jobAttributeStatusList = jobAttributeStatusList ? jobAttributeStatusList : []
        jobAttributeStatusList.forEach(jobAttributeStatus => {
            jobAttributeStatusMap[jobAttributeStatus.statusId] = jobAttributeStatusMap[jobAttributeStatus.statusId] ? jobAttributeStatusMap[jobAttributeStatus.statusId] : {}
            jobAttributeStatusMap[jobAttributeStatus.statusId][jobAttributeStatus.jobAttributeId] = jobAttributeStatus
        })

        return jobAttributeStatusMap
    }

}

export let jobAttributeMasterService = new JobAttributeMaster()