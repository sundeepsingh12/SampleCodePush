'use strict'

import {
    CONTACT_NUMBER,

} from '../../lib/AttributeConstants'


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

    /**
     * 
     * @param {*} allJobAttributes 
     * @param {*} jobMasterIdList 
     * @param {*} jobAttributeIdList 
     */
   getCallerIdJobAttributeMapAndQuery(allJobAttributes,jobMasterIdList,jobAttributeIdList){
        let idJobAttributeMap = {},query='',index = 0
        allJobAttributes.value.forEach(jobAttribute => {
            //Get all job attributes belonging to those job masters which are mapped in MDM Enable Caller Idenity Settings and also contact type attributes of those job master
            if (jobAttributeIdList.includes(jobAttribute.id) || (jobMasterIdList.includes(jobAttribute.jobMasterId)) && (jobAttribute.attributeTypeId == CONTACT_NUMBER)) {
                idJobAttributeMap[jobAttribute.id] = jobAttribute
                query = (index++ == 0) ? `jobAttributeMasterId = ${jobAttribute.id}` : `${query} OR jobAttributeMasterId = ${jobAttribute.id} `
            }
        })
        return {
            idJobAttributeMap,
            query
        }
    }

}

export let jobAttributeMasterService = new JobAttributeMaster()