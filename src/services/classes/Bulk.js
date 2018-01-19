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
            if(!configurationObject.jobMasterId || !configurationObject.statusId){
                statusIdJobMasterIdBulkAllowedMap = {}
                return
            }
            let jobMasterIdBulkUpdateAllowed = {}
            jobMasterIdBulkUpdateAllowed[configurationObject.jobMasterId] = configurationObject.bulkUpdateAllowed
            statusIdJobMasterIdBulkAllowedMap[configurationObject.statusId] = jobMasterIdBulkUpdateAllowed
        })
        return statusIdJobMasterIdBulkAllowedMap
    }
    getManualSelection(jobMasterManualSelectionConfiguration, jobMasterId) {
        let manualSelectionConfiguration = jobMasterManualSelectionConfiguration.filter(selectionConfiguration => selectionConfiguration.jobMasterId == jobMasterId)
        if (manualSelectionConfiguration && manualSelectionConfiguration.length > 0)
            return manualSelectionConfiguration[0].manualSelectionAllowed
        else return true
    }
    performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap) {
        let searchText = _.toLower(searchValue)
        let jobTransactionArray = []
        let isSearchFound = false
        let errorMessage = ''
        for (let key in bulkTransactions) {
            if (_.isEqual(_.toLower(bulkTransactions[key].referenceNumber), searchText) || _.isEqual(_.toLower(bulkTransactions[key].runsheetNo), searchText)) {
                jobTransactionArray.push(bulkTransactions[key])
                isSearchFound = true
            } else if (searchSelectionOnLine1Line2 && this.checkForPresenceInDisplayText(searchText, bulkTransactions[key], idToSeparatorMap)) {
                jobTransactionArray.push(bulkTransactions[key])
                isSearchFound = true
                if (jobTransactionArray.length > 1) {
                    errorMessage = 'Invalid Scan'
                    break
                }
            }
        }
        if (!isSearchFound) {
            return { jobTransactionArray: [], errorMessage: 'Invalid Scan' }
        } else {
            return { jobTransactionArray, errorMessage }
        }
    }
    checkForPresenceInDisplayText(searchValue, bulkTransaction, idToSeparatorMap) {
        if (bulkTransaction.line1 && _.toLower(bulkTransaction.line1).includes(searchValue)) {
            return this.checkLineContents(_.toLower(bulkTransaction.line1), idToSeparatorMap[1], searchValue)
        } else if (bulkTransaction.line2 && _.toLower(bulkTransaction.line2).includes(searchValue)) {
            return this.checkLineContents(_.toLower(bulkTransaction.line2), idToSeparatorMap[2], searchValue)
        } else if (bulkTransaction.circleLine1 && _.toLower(bulkTransaction.circleLine1).includes(searchValue)) {
            return this.checkLineContents(_.toLower(bulkTransaction.circleLine1), idToSeparatorMap[3], searchValue)
        } else if (bulkTransaction.circleLine2 && _.toLower(bulkTransaction.circleLine2).includes(searchValue)) {
            return this.checkLineContents(_.toLower(bulkTransaction.circleLine2), idToSeparatorMap[4], searchValue)
        }
        return false;
    }
    checkLineContents(lineContent, separator, searchValue) {
        let contentList = (separator) ? lineContent.split(separator) : [lineContent]
        let matchingContent = contentList.filter(content => _.isEqual(content, searchValue))
        return (matchingContent && matchingContent.length > 0)
    }
    getIdSeparatorMap(jobMasterIdCustomizationMap, jobMasterId) {
        if (!jobMasterIdCustomizationMap || !jobMasterIdCustomizationMap.value) return {}
        const jobMasterCustomisationMap = jobMasterIdCustomizationMap.value[jobMasterId]
        if (!jobMasterCustomisationMap) return {}
        let idToSeparatorMap = {}
        for (let key in jobMasterCustomisationMap) {
            idToSeparatorMap[jobMasterCustomisationMap[key].appJobListMasterId] = jobMasterCustomisationMap[key].separator
        }
        return idToSeparatorMap
    }
}

export let bulkService = new Bulk()