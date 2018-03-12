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
import { moduleCustomizationService } from './ModuleCustomization'
import {
    BULK_ID
} from '../../lib/AttributeConstants'
import {
    INVALID_SCAN
} from '../../lib/ContainerConstants'

class Bulk {

    /**
     * This function returns job transaction map of job transaction corresponding to job master id and status id
     * @param {*} bulkData 
     * @returns
     * {
     *      jobTransactionId : jobTransactionCustomization {
     *                                          circleLine1
     *                                          circleLine2
     *                                          id
     *                                          jobMasterId
     *                                          jobSwipableDetails : {
     *                                                                  addressData : []
     *                                                                  contactData : []
     *                                                                  customerCareData : []
     *                                                                  smsTemplateData : []
     *                                                               }
     *                                          jobStatusId
     *                                          line1
     *                                          line2
     *                                          seqSelected
     *                                      }
     * }
     */
    async getJobListingForBulk(bulkData) {
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        let { jobTransactionCustomizationList } = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'Bulk', bulkData)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList, 'id')
        return idJobTransactionCustomizationListMap
    }

    getSelectedTransaction(jobTransactions) {
        let selectedTransactions = []
        for (let index in jobTransactions) {
            if (!jobTransactions[index].isChecked) {
                continue
            }
            selectedTransactions.push({
                jobTransactionId: jobTransactions[index].id,
                jobId: jobTransactions[index].jobId,
                jobMasterId: jobTransactions[index].jobMasterId
            })
        }
        return selectedTransactions
    }

    performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, selectedItems) {
        let searchText = _.toLower(searchValue)
        let isSearchFound = false
        let errorMessage = ''
        for (let key in bulkTransactions) {
            if (_.isEqual(_.toLower(bulkTransactions[key].referenceNumber), searchText) || _.isEqual(_.toLower(bulkTransactions[key].runsheetNo), searchText)) {
                bulkTransactions[key].isChecked = !bulkTransactions[key].isChecked
                bulkTransactions[key].isChecked ? selectedItems[key] = this.getSelectedTransactionObject(bulkTransactions[key]) : delete selectedItems[key]
                isSearchFound = true
            } else if (searchSelectionOnLine1Line2 && this.checkForPresenceInDisplayText(searchText, bulkTransactions[key], idToSeparatorMap)) {
                bulkTransactions[key].isChecked = !bulkTransactions[key].isChecked
                bulkTransactions[key].isChecked ? selectedItems[key] = this.getSelectedTransactionObject(bulkTransactions[key]) : delete selectedItems[key]
                if (isSearchFound) {
                    errorMessage = INVALID_SCAN
                    break
                }
                isSearchFound = true
            }
        }
        if (!isSearchFound) {
            return { errorMessage: INVALID_SCAN }
        } else {
            return { errorMessage }
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

    getSelectedTransactionObject(jobTransaction) {
        return {
            jobTransactionId: jobTransaction.id,
            jobId: jobTransaction.jobId,
            jobMasterId: jobTransaction.jobMasterId
        }
    }
}

export let bulkService = new Bulk()