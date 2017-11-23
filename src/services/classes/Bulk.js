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

class Bulk {

    prepareJobMasterVsStatusList(jobMasterList, jobStatusList) {
        const idJobMasterMap = _.mapKeys(jobMasterList,'id')
        const bulkConfigList = this._getJobMasterIdStatusNameList(jobStatusList, idJobMasterMap)
        return bulkConfigList
    }

    _getJobMasterIdStatusNameList(jobStatusList, idJobMasterMap) {
        let bulkConfigList = [],
            id = 0
        jobStatusList.forEach(jobStatusObject => {
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
        })
        return bulkConfigList
    }

    async getJobListingForBulk(bulkData) {
        const jobTransactionCustomizationListParametersDTO =  await transactionCustomizationService.getJobListingParameters()
        const jobTransactionCustomizationList =  await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'Bulk', bulkData)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList,'id')
        return idJobTransactionCustomizationListMap
    }

    getSelectedTransactionIds(jobTransactions) {
        const selectedTransactionIds = _.filter(jobTransactions, jobTransaction => jobTransaction.isChecked == true).map(jobTransaction => jobTransaction.id)
        return selectedTransactionIds
    }
}

export let bulkService = new Bulk()