'use strict'
import { jobTransactionService } from './JobTransaction'
import { transactionCustomizationService } from './TransactionCustomization'
import _ from 'lodash'
import { INVALID_SCAN, SELECT_ALL, SELECT_NONE } from '../../lib/ContainerConstants'
import moment from 'moment'

class Bulk {

    /**
     * This function returns job transaction map of job transaction corresponding to job master id and status id
     * @param {*} bulkParamas 
     * @returns
     * {
     *      jobTransactionId : jobTransactionCustomization {
                                                circleLine1
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
    async getJobListingForBulk(bulkParamas) {
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters();
        let queryDTO = {};
        let jobMaster = jobTransactionCustomizationListParametersDTO.jobMasterList.filter(jobmaster => jobmaster.id == bulkParamas.pageObject.jobMasterIds[0])[0];
        queryDTO.jobTransactionQuery = `jobMasterId = ${bulkParamas.pageObject.jobMasterIds[0]} AND jobStatusId = ${bulkParamas.pageObject.additionalParams.statusId} AND jobId > 0`;
        queryDTO.jobQuery = bulkParamas.pageObject.groupId ? `jobMasterId = ${bulkParamas.pageObject.jobMasterIds[0]} AND groupId = "${bulkParamas.pageObject.groupId}"` : jobMaster.enableMultipartAssignment ? `jobMasterId = ${bulkParamas.pageObject.jobMasterIds[0]} AND groupId = null` : `jobMasterId = ${bulkParamas.pageObject.jobMasterIds[0]}`;
        let jobTransactionCustomizationList = jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, queryDTO)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList, 'jobId');
        return {idJobTransactionCustomizationListMap,statusList:jobTransactionCustomizationListParametersDTO.statusList};
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
    performSearch(searchValue, bulkTransactions, searchSelectionOnLine1Line2, idToSeparatorMap, selectedTransactionLength, pageObject) {
        let searchText = _.toLower(searchValue)
        let isSearchFound = false, bulkTransactionLength = 0
        let errorMessage = '', numberOfEnabledItems
        let clonePageObject = JSON.parse(JSON.stringify(pageObject))
        let bulkJobSimilarityConfig = this.getBulkJobSimilarityConfig(clonePageObject)
        let isTransactionSelected = false
        for (let key in bulkTransactions) {
            if(bulkTransactions[key].statusId != clonePageObject.additionalParams.statusId || (!_.isEmpty(bulkTransactions[key].jobExpiryData.value) && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isAfter(bulkTransactions[key].jobExpiryData.value))){
                continue
            }
            bulkTransactionLength++;
            if  (_.isEqual(_.toLower(bulkTransactions[key].referenceNumber), searchText) || _.isEqual(_.toLower(bulkTransactions[key].runsheetNo), searchText)) { // If search text is equal to reference number or runsheet number.Search on reference or runsheet can toggle multiple transactions
                if (bulkJobSimilarityConfig && isSearchFound) {
                    errorMessage = INVALID_SCAN
                    break
                }
                if (bulkJobSimilarityConfig) {
                    numberOfEnabledItems = this.setEnabledTransactions(bulkTransactions, bulkTransactions[key], bulkJobSimilarityConfig, selectedTransactionLength)
                }
                isTransactionSelected = (bulkTransactions[key].isChecked) ? bulkTransactions[key].referenceNumber : null
                isSearchFound = this.toggleTransaction(bulkTransactions, key, isSearchFound)
                selectedTransactionLength = (isSearchFound) ? selectedTransactionLength + 1 : selectedTransactionLength - 1
            } else if(searchSelectionOnLine1Line2 && this.checkForPresenceInDisplayText(searchText, bulkTransactions[key], idToSeparatorMap)) { // If search on line1 and line2 is allowed and search text is present in line1 or line2
                if(isSearchFound) { // Search on lin1 or line2 cannot toggle multiple transactions
                    errorMessage = INVALID_SCAN
                    break
                }
                if (bulkJobSimilarityConfig) {
                    numberOfEnabledItems = this.setEnabledTransactions(bulkTransactions, bulkTransactions[key], bulkJobSimilarityConfig, selectedTransactionLength)
                }
                isTransactionSelected = (bulkTransactions[key].isChecked) ? bulkTransactions[key].referenceNumber : null
                isSearchFound = this.toggleTransaction(bulkTransactions, key, isSearchFound)
                selectedTransactionLength = (isSearchFound) ? selectedTransactionLength + 1 : selectedTransactionLength - 1
            }
        }
        let { displayText, selectAll } = this.getDisplayTextAndSelectAll(bulkJobSimilarityConfig, selectedTransactionLength, numberOfEnabledItems, bulkTransactionLength, clonePageObject)
        if (!isSearchFound) { // If transaction not found
            return { errorMessage: INVALID_SCAN }
        } else {
            return { errorMessage, displayText, selectAll, isTransactionSelected }
        }
    }

    toggleTransaction(bulkTransactions, key, isSearchFound) {
        if (!bulkTransactions[key].disabled) { 
            bulkTransactions[key].isChecked = !bulkTransactions[key].isChecked
            isSearchFound = true
        }
        return isSearchFound
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
        let line1match = false
        if (bulkTransaction.line1 && _.toLower(bulkTransaction.line1).includes(searchValue)) { // If line1 includes search text
            line1match = this.checkLineContents(_.toLower(bulkTransaction.line1), idToSeparatorMap[1], searchValue)
        }
        if (!line1match && bulkTransaction.line2 && _.toLower(bulkTransaction.line2).includes(searchValue)) { // If line2 includes search text
            line1match = this.checkLineContents(_.toLower(bulkTransaction.line2), idToSeparatorMap[2], searchValue)
        }
        if (!line1match && bulkTransaction.circleLine1 && _.toLower(bulkTransaction.circleLine1).includes(searchValue)) { // If circleline1 includes search text
            line1match = this.checkLineContents(_.toLower(bulkTransaction.circleLine1), idToSeparatorMap[3], searchValue)
        }
        if (!line1match && bulkTransaction.circleLine2 && _.toLower(bulkTransaction.circleLine2).includes(searchValue)) { // If circleline2 includes search text
            line1match = this.checkLineContents(_.toLower(bulkTransaction.circleLine2), idToSeparatorMap[4], searchValue)
        }
        return line1match;
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
            jobMasterId: jobTransaction.jobMasterId,
            referenceNumber: jobTransaction.referenceNumber
        }
    }

    checkForSimilarityBulk(jobTransaction, previousJobTransaction, bulkJobSimilarityConfig) {
        let differentDataPresent = false

        if (bulkJobSimilarityConfig.lineOneEnabled && jobTransaction.line1 != previousJobTransaction.line1) {
            differentDataPresent = true
        } else if (bulkJobSimilarityConfig.lineTwoEnabled && jobTransaction.line2 != previousJobTransaction.line2) {
            differentDataPresent = true
        } else if (bulkJobSimilarityConfig.circleLineOneEnabled && jobTransaction.circleLine1 != previousJobTransaction.circleLine1) {
            differentDataPresent = true
        } else if (bulkJobSimilarityConfig.circleLineTwoEnabled && jobTransaction.circleLine2 != previousJobTransaction.circleLine2) {
            differentDataPresent = true
        }
        return differentDataPresent
    }

    setEnabledTransactions(bulkTransactions, currentTransaction, bulkJobSimilarityConfig, selectedTransactionLength) {
        let numberOfEnabledItems = 0
        for (let index in bulkTransactions) {
            if (selectedTransactionLength == 0) {
                let differentDataPresent = this.checkForSimilarityBulk(bulkTransactions[index], currentTransaction, bulkJobSimilarityConfig)
                bulkTransactions[index].disabled = differentDataPresent
            } else if (bulkTransactions[currentTransaction.jobId].isChecked && !bulkTransactions[currentTransaction.jobId].disabled && selectedTransactionLength == 1) {
                bulkTransactions[index].disabled = false
            }
            if (!bulkTransactions[index].disabled) {
                numberOfEnabledItems++
            }
        }
        return numberOfEnabledItems
    }

    checkForJobMasterIdsOfUpdatedJobsInBulk(updatedTransactionListIds, statusId, jobTransactionCustomizationList){
        for(let item in updatedTransactionListIds){
          if(updatedTransactionListIds[item].jobStatusId == statusId || (jobTransactionCustomizationList[item] && jobTransactionCustomizationList[item].statusId == statusId)){
            return true
          }
        }
        return false
      }


    getBulkJobSimilarityConfig(clonePageObject) {
        clonePageObject.additionalParams = JSON.parse(clonePageObject.additionalParams)
        let bulkJobSimilarityConfig = clonePageObject.additionalParams.bulkJobSimilarityConf
        if (!bulkJobSimilarityConfig || !(bulkJobSimilarityConfig.lineOneEnabled || bulkJobSimilarityConfig.lineTwoEnabled || bulkJobSimilarityConfig.circleLineOneEnabled || bulkJobSimilarityConfig.circleLineTwoEnabled)) {
            return
        } else {
            return bulkJobSimilarityConfig
        }
    }

    getDisplayTextAndSelectAll(bulkJobSimilarityConfig, selectedTransactionLength, numberOfEnabledItems, bulkTransactionLength, clonePageObject) {
        let displayText, selectAll = clonePageObject.additionalParams.selectAll
        if (bulkJobSimilarityConfig) {
            displayText = selectedTransactionLength == numberOfEnabledItems ? SELECT_NONE : SELECT_ALL
        } else {
            displayText = selectedTransactionLength == bulkTransactionLength ? SELECT_NONE : SELECT_ALL
        }
        if (!clonePageObject.additionalParams.selectAll) {
            selectAll = false
        } else if (bulkJobSimilarityConfig) {
            selectAll = (selectedTransactionLength > 0) ? true : false
        }
        return { displayText, selectAll }
    }

    performFilterBeforeSelectAll(bulkTransaction, searchText) {
        if (!searchText || searchText == '') {
            return true
        } else {
            let values = [bulkTransaction.runsheetNo, bulkTransaction.referenceNumber, bulkTransaction.line1, bulkTransaction.line2, bulkTransaction.circleLine1, bulkTransaction.circleLine2]
            if (_.some(values, (data) => _.includes(_.toLower(data), _.toLower(searchText)))) {
                return true
            }
        }
    }

}

export let bulkService = new Bulk()