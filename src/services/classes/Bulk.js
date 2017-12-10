'use strict'
import {
    keyValueDBService
} from './KeyValueDBService'
import {
    jobStatusService
} from './JobStatus'
import {
    jobMasterService
} from './JobMaster'
import {
    jobTransactionService
} from './JobTransaction'
import {
    transactionCustomizationService
} from './TransactionCustomization'
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
import _ from 'lodash'
import {
    moduleCustomizationService
} from './ModuleCustomization'
import {
    BULK_ID
} from '../../lib/AttributeConstants'

class Bulk {

    prepareJobMasterVsStatusList(jobMasterList, jobStatusList, modulesCustomizationList) {
        const idJobMasterMap = _.mapKeys(jobMasterList, 'id')
        const bulkModuleCustomization = moduleCustomizationService.getModuleCustomizationForAppModuleId(modulesCustomizationList, BULK_ID)
        const bulkModuleRemark = (bulkModuleCustomization[0].remark) ? JSON.parse(bulkModuleCustomization[0].remark) : null
        const bulkJobMasterStatusConfiguration = (bulkModuleRemark != null) ? bulkModuleRemark.jobMasterStatusConfiguration : null
        const statusIdJobMasterIdBulkAllowedMap = this._getStatusIdJobMasterIdBulkAllowedMap(bulkJobMasterStatusConfiguration)
        const bulkConfigList = this._getJobMasterIdStatusNameList(jobStatusList, idJobMasterMap, statusIdJobMasterIdBulkAllowedMap)
        return bulkConfigList
    }

    _getJobMasterIdStatusNameList(jobStatusList, idJobMasterMap, statusIdJobMasterIdBulkAllowedMap) {
        let bulkConfigList = [],
            id = 0
        jobStatusList.forEach(jobStatusObject => {
            if (!_.isEmpty(statusIdJobMasterIdBulkAllowedMap)) {
                if (statusIdJobMasterIdBulkAllowedMap[jobStatusObject.id] && statusIdJobMasterIdBulkAllowedMap[jobStatusObject.id][jobStatusObject.jobMasterId]) {
                    if (jobStatusObject.code != UNSEEN && jobStatusObject.nextStatusList && jobStatusObject.nextStatusList.length > 0) {
                        bulkConfigList.push({
                            jobMasterName: idJobMasterMap[jobStatusObject.jobMasterId].title,
                            id,
                            statusName: jobStatusObject.name,
                            statusId: jobStatusObject.id,
                            nextStatusList: jobStatusObject.nextStatusList,
                            jobMasterId: jobStatusObject.jobMasterId
                        })
                        id++
                    }
                }
            } else {
                if (jobStatusObject.code != UNSEEN && jobStatusObject.nextStatusList && jobStatusObject.nextStatusList.length > 0) {
                    bulkConfigList.push({
                        jobMasterName: idJobMasterMap[jobStatusObject.jobMasterId].title,
                        id,
                        statusName: jobStatusObject.name,
                        statusId: jobStatusObject.id,
                        nextStatusList: jobStatusObject.nextStatusList,
                        jobMasterId: jobStatusObject.jobMasterId
                    })
                    id++
                }
            }

        })
        return bulkConfigList
    }

    async getJobListingForBulk(bulkData) {
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        const jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'Bulk', bulkData)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList, 'id')
        return idJobTransactionCustomizationListMap
    }

    getSelectedTransactionIds(jobTransactions) {
        const selectedTransactionIds = _.filter(jobTransactions, jobTransaction => jobTransaction.isChecked == true).map(jobTransaction => jobTransaction.id)
        return selectedTransactionIds
    }

    _getStatusIdJobMasterIdBulkAllowedMap(bulkJobMasterStatusConfiguration) {
        if (_.isEmpty(bulkJobMasterStatusConfiguration))
            return
        let statusIdJobMasterIdBulkAllowedMap = {}

        bulkJobMasterStatusConfiguration.forEach(configurationObject => {
            let jobMasterIdBulkUpdateAllowed = {}
            jobMasterIdBulkUpdateAllowed[configurationObject.jobMasterId] = configurationObject.bulkUpdateAllowed
            statusIdJobMasterIdBulkAllowedMap[configurationObject.statusId] = jobMasterIdBulkUpdateAllowed
        })
        return statusIdJobMasterIdBulkAllowedMap
    }
}

export let bulkService = new Bulk()