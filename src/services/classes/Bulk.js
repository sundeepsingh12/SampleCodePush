'use strict'
import {keyValueDBService} from './KeyValueDBService'
import {jobStatusService} from './JobStatus'
import {jobMasterService} from './JobMaster'
import {jobTransactionService} from './JobTransaction'
import {
    UNSEEN,
    JOB_STATUS,
    CUSTOMIZATION_LIST_MAP,
    JOB_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    CUSTOMER_CARE,
    SMS_TEMPLATE,
    JOB_MASTER,
    HUB,
    TABLE_JOB_TRANSACTION
} from '../../lib/constants'

class Bulk {

    prepareJobMasterVsStatusList(jobMasterList,jobStatusList){
        const idJobMasterMap = jobMasterService.getIdJobMasterMap(jobMasterList)
        const bulkConfigList =  this._getJobMasterIdStatusNameList(jobStatusList,idJobMasterMap)
        return bulkConfigList
    }

    _getJobMasterIdStatusNameList(jobStatusList,idJobMasterMap){
        let bulkConfigList = [],id = 0
        jobStatusList.forEach(jobStatusObject=>{
             if (jobStatusObject.code != UNSEEN && jobStatusObject.nextStatusList && jobStatusObject.nextStatusList.length > 0) {
                    bulkConfigList.push({
                        jobMasterName:idJobMasterMap[jobStatusObject.jobMasterId].title,
                        id,
                        statusName:jobStatusObject.name,
                        statusId:jobStatusObject.id,
                        nextStatusList:jobStatusObject.nextStatusList,
                        jobMasterId:jobStatusObject.jobMasterId
                    })
                    id++
             }
        })
        return bulkConfigList
    }

    async getJobListingForBulk(bulkData){
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
        const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
        const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
        const customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
        const smsTemplateList = await keyValueDBService.getValueFromStore(SMS_TEMPLATE)
        const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
        let jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap.value, jobAttributeMasterList.value, jobAttributeStatusList.value, customerCareList.value, smsTemplateList.value, statusList.value, jobMasterList.value, true,bulkData)
        // const idJobTransactionCustomizationListMap = await jobTransactionService.getIdJobTransactionCustomizationListMap(jobTransactionCustomizationList)
        return jobTransactionCustomizationList
    }
}


export let bulkService = new Bulk()