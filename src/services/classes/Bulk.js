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

    /**
     * This function check for transaction searched on basis of search text. Search is done on reference number,runsheet number,line1 and line2 (if allowed)
     * If transaction found then it is toggled ie checked <-> unchecked
     * @param {*} searchValue 
     * @param {*} bulkTransactions 
     * @param {*} searchSelectionOnLine1Line2 
     * @param {*} idToSeparatorMap 
     * @param {*} selectedItems 
     * @returns
     * {
     *      errorMessage : string
     * }
     */
    performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, selectedItems) {
        let searchText = _.toLower(searchValue)
        let isSearchFound = false
        let errorMessage = ''
        for (let key in bulkTransactions) {
            if (_.isEqual(_.toLower(bulkTransactions[key].referenceNumber), searchText) || _.isEqual(_.toLower(bulkTransactions[key].runsheetNo), searchText)) { // If search text is equal to reference number or runsheet number.Search on reference or runsheet can toggle multiple transactions
                bulkTransactions[key].isChecked = !bulkTransactions[key].isChecked
                bulkTransactions[key].isChecked ? selectedItems[key] = this.getSelectedTransactionObject(bulkTransactions[key]) : delete selectedItems[key]
                isSearchFound = true
            } else if (searchSelectionOnLine1Line2 && this.checkForPresenceInDisplayText(searchText, bulkTransactions[key], idToSeparatorMap)) { // If search on line1 and line2 is allowed and search text is present in line1 or line2
                bulkTransactions[key].isChecked = !bulkTransactions[key].isChecked
                bulkTransactions[key].isChecked ? selectedItems[key] = this.getSelectedTransactionObject(bulkTransactions[key]) : delete selectedItems[key]
                if (isSearchFound) { // Search on lin1 or line2 cannot toggle multiple transactions
                    errorMessage = INVALID_SCAN
                    break
                }
                isSearchFound = true
            }
        }
        if (!isSearchFound) { // If transaction not found
            return { errorMessage: INVALID_SCAN }
        } else {
            return { errorMessage }
        }
    }

    /**
     * This function checks if search text matches in line1, line2, circle line 1 or circle line 2
     * @param {*} searchValue 
     * @param {*} bulkTransaction 
     * @param {*} idToSeparatorMap 
     * @returns
     * boolean - whether search text is present in ine1, line2, circle line 1 or circle line 2
     */
    checkForPresenceInDisplayText(searchValue, bulkTransaction, idToSeparatorMap) {
        if (bulkTransaction.line1 && _.toLower(bulkTransaction.line1).includes(searchValue)) { // If line1 includes search text
            return this.checkLineContents(_.toLower(bulkTransaction.line1), idToSeparatorMap[1], searchValue)
        } else if (bulkTransaction.line2 && _.toLower(bulkTransaction.line2).includes(searchValue)) { // If line2 includes search text
            return this.checkLineContents(_.toLower(bulkTransaction.line2), idToSeparatorMap[2], searchValue)
        } else if (bulkTransaction.circleLine1 && _.toLower(bulkTransaction.circleLine1).includes(searchValue)) { // If circleline1 includes search text
            return this.checkLineContents(_.toLower(bulkTransaction.circleLine1), idToSeparatorMap[3], searchValue)
        } else if (bulkTransaction.circleLine2 && _.toLower(bulkTransaction.circleLine2).includes(searchValue)) { // If circleline2 includes search text
            return this.checkLineContents(_.toLower(bulkTransaction.circleLine2), idToSeparatorMap[4], searchValue)
        }
        return false;
    }

    /**
     * This function splits line content on its respective separator and checks if search text is present in the seperated list
     * @param {*} lineContent 
     * @param {*} separator 
     * @param {*} searchValue 
     * @return 
     * boolean - whether search text is present in seperated list or not
     */
    checkLineContents(lineContent, separator, searchValue) {
        let contentList = (separator) ? lineContent.split(separator) : [lineContent]  // split line content on seperator
        let matchingContent = contentList.filter(content => _.isEqual(content, searchValue)) // look for exact match with search text in the split list
        return (matchingContent && matchingContent.length > 0)
    }

    /**
     * This function prepares app module id to seperator map
     * @param {*} jobMasterIdCustomizationMap 
     * @param {*} jobMasterId 
     * @returns
     * {
     *      appModuleId : seperator
     * }
     */
    getIdSeparatorMap(jobMasterIdCustomizationMap, jobMasterId) {
        jobMasterIdCustomizationMap = jobMasterIdCustomizationMap ? jobMasterIdCustomizationMap.value ? jobMasterIdCustomizationMap.value : {} : {}
        let jobMasterCustomisationMap = jobMasterIdCustomizationMap[jobMasterId]
        jobMasterCustomisationMap = jobMasterCustomisationMap ? jobMasterCustomisationMap : {}
        let idToSeparatorMap = {}
        for (let key in jobMasterCustomisationMap) {
            idToSeparatorMap[jobMasterCustomisationMap[key].appJobListMasterId] = jobMasterCustomisationMap[key].separator
        }
        return idToSeparatorMap
    }

    /**
     * This function return a object that is passed to form layout ie selected transactions
     * @param {*} jobTransaction 
     * @returns
     * {
     *     jobTransactionId,
     *     jobId,
     *     jobMasterId
     * }
     */
    getSelectedTransactionObject(jobTransaction) {
        return {
            jobTransactionId: jobTransaction.id,
            jobId: jobTransaction.jobId,
            jobMasterId: jobTransaction.jobMasterId
        }
    }
}

export let bulkService = new Bulk()