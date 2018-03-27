'use strict'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    JOB_ATTRIBUTE,
    TABLE_JOB_DATA
} from '../../lib/constants'

import {
    POST
} from '../../lib/AttributeConstants'
import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { keyValueDb } from '../../repositories/keyValueDb'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import {
    SEARCH_TEXT_MISSING,
    CURRENT_ELEMENT_MISSING,
    TOKEN_MISSING,
    JOBATTRIBUTES_MISSING,
    DSF_LIST_MISSING,
    FIELD_ATTRIBUTE_ATTR_MASTER_ID_MISSING,
    FORM_ELEMENT_IS_MISSING,
    INVALID_BULK_JOB_CONFIG,
    CONFIGURATION_ERROR_DS_MASTER_ID_MISSING
} from '../../lib/ContainerConstants'
import _ from 'lodash'
class DataStoreFilterService {

    async fetchDataForFilter(token, currentElement, lastFilter, formElement, jobTransaction, dataStoreFilterReverseMap) {
        if (!currentElement) {
            throw new Error(CURRENT_ELEMENT_MISSING)
        }
        if (!token) {
            throw new Error(TOKEN_MISSING)
        }
        if (!currentElement.dataStoreMasterId) {
            throw new Error(CONFIGURATION_ERROR_DS_MASTER_ID_MISSING)
        }
        const jobAttributes = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        let returnParams = await this.prepareDataStoreFilterMap(currentElement, formElement, jobTransaction, jobAttributes, dataStoreFilterReverseMap)
        let postJSON = JSON.stringify({
            dataStoreMasterId: currentElement.dataStoreMasterId,
            dataStoreAttributeId: currentElement.dataStoreAttributeId,
            dataStoreAttributeIdValueMap: returnParams.dataStoreAttributeIdtoValueMap,
            lastFilter
        })
        let dataStoreFilterJsonResponse = await this.fetchDSF(token, postJSON)
        let dataStoreFilterResponse = await dataStoreFilterJsonResponse.json
        return {
            dataStoreFilterResponse,
            dataStoreFilterReverseMap: returnParams.dataStoreFilterReverseMap
        }
    }

    /**
     * 
     * @param {*} token 
     * @param {*} postJSON 
     * @returns {dataStoreFilterResponse} response from server
     */
    fetchDSF(token, postJSON) {
        const url = CONFIG.API.DATA_STORE_FILTER_SEARCH
        const dataStoreFilterResponse = RestAPIFactory(token.value).serviceCall(postJSON, url, POST)
        return dataStoreFilterResponse
    }

    /**
     * 
     * @param {*} currentElement 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     * @param {*} jobAttributes 
     * @param {*} dataStoreFilterReverseMap 
     * @returns {dataStoreFilterReverseMap,dataStoreAttributeIdtoValueMap}
     */
    prepareDataStoreFilterMap(currentElement, formElement, jobTransaction, jobAttributes, dataStoreFilterReverseMap) {
        if (!currentElement) {
            throw new Error(CURRENT_ELEMENT_MISSING)
        }
        if (!currentElement.dataStoreFilterMapping || _.isEqual(currentElement.dataStoreFilterMapping, '[]')) {
            return {
                dataStoreAttributeIdtoValueMap: {},
                dataStoreFilterReverseMap
            }
        }
        if (!jobAttributes || !jobAttributes.value) {
            throw new Error(JOBATTRIBUTES_MISSING)
        }
        let cloneDataStoreFilterReverseMap = _.cloneDeep(dataStoreFilterReverseMap)
        let dataStoreAttributeIdtoValueMap = {}
        let dataStoreFilterList = JSON.parse(currentElement.dataStoreFilterMapping)
        for (let filter of dataStoreFilterList) {
            let returnParams = this.parseKey(filter, currentElement.fieldAttributeMasterId, formElement, jobTransaction, jobAttributes, dataStoreAttributeIdtoValueMap, cloneDataStoreFilterReverseMap)
            cloneDataStoreFilterReverseMap = returnParams.dataStoreFilterReverseMap
            dataStoreAttributeIdtoValueMap = returnParams.dataStoreAttributeIdtoValueMap
        }
        return {
            dataStoreFilterReverseMap: cloneDataStoreFilterReverseMap,
            dataStoreAttributeIdtoValueMap
        }
    }

    /**
     * 
     * @param {*} key 
     * @param {*} fieldAttributeMasterId 
     * @param {*} formElement 
     * @param {*} jobTransaction 
     * @param {*} jobAttributes 
     * @param {*} dataStoreAttributeIdtoValueMap 
     * @param {*} dataStoreFilterReverseMap 
     * @returns {dataStoreAttributeIdtoValueMap,dataStoreFilterReverseMap}
     * this method will create object of mapped attribute which is use for fetching DSF data
     * it also gives dataStoreFilterReverseMap
     */
    parseKey(key, fieldAttributeMasterId, formElement, jobTransaction, jobAttributes, dataStoreAttributeIdtoValueMap, dataStoreFilterReverseMap) {
        if (key[0] == 'F') {
            let fieldAttributeKey = fieldValidationService.splitKey(key, false)
            for (let [id, currentObject] of formElement.entries()) {
                if (_.isEqual(fieldAttributeKey, currentObject.key)) {
                    if (currentObject.value) {
                        dataStoreAttributeIdtoValueMap[currentObject.dataStoreAttributeId] = currentObject.value
                    }
                    if (dataStoreFilterReverseMap[currentObject.fieldAttributeMasterId] && !_.includes(dataStoreFilterReverseMap[currentObject.fieldAttributeMasterId], fieldAttributeMasterId)) { // check if variable is initialized with empty array and if present then check if it contains an entry of fieldAttributeMasterId or not to avoid duplicate entry in map
                        dataStoreFilterReverseMap[currentObject.fieldAttributeMasterId].push(fieldAttributeMasterId)
                    } else {
                        dataStoreFilterReverseMap[currentObject.fieldAttributeMasterId] = []
                        dataStoreFilterReverseMap[currentObject.fieldAttributeMasterId].push(fieldAttributeMasterId)
                    }
                }
            }
        } else if (key[0] == 'J') {
            let jobAttributeKey = fieldValidationService.splitKey(key, true)
            let filteredJobAttribute = jobAttributes.value.filter(jobAttribute => _.isEqual(jobAttribute.key, jobAttributeKey))
            let jobData
            if (jobTransaction && jobTransaction.length) {// In case of bulk check if all jobs contain same jobData value or not
                jobData = this.checkForSameJobDataValue(jobTransaction, filteredJobAttribute)
            } else {
                let jobDataQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${filteredJobAttribute[0].id} AND parentId = 0`
                jobData = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
            }
            if (jobData[0]) {
                dataStoreAttributeIdtoValueMap[filteredJobAttribute[0].dataStoreAttributeId] = jobData[0].value
            }
        }
        return {
            dataStoreAttributeIdtoValueMap,
            dataStoreFilterReverseMap
        }
    }

    /**
     * 
     * @param {*} dataStoreFilterList 
     * @param {*} cloneDataStoreFilterList 
     * @param {*} searchText
     * @returns {dataStoreFilterList,cloneDataStoreFilterList}
     * returns filtered dataStoreFilterList according to searchText and cloneDataStoreFilterList which is origonal DSF list 
     */
    searchDSFList(dataStoreFilterList, cloneDataStoreFilterList, searchText) {
        if (!dataStoreFilterList) {
            throw new Error(DSF_LIST_MISSING)
        }
        if (!searchText) {
            throw new Error(SEARCH_TEXT_MISSING)
        }
        if (_.isEmpty(cloneDataStoreFilterList)) {
            cloneDataStoreFilterList = _.cloneDeep(dataStoreFilterList)
        } else {
            dataStoreFilterList = _.cloneDeep(cloneDataStoreFilterList)
        }
        let filteredData = dataStoreFilterList.filter(DSFlistObject => (DSFlistObject.toUpperCase()).indexOf(searchText.toUpperCase()) == 0)
        return {
            dataStoreFilterList: filteredData,
            cloneDataStoreFilterList
        }
    }


    /**
     * 
     * @param {*} fieldAttributeMasterId 
     * @param {*} dataStoreFilterReverseMap 
     * @param {*} formElement
     * @returns {formElement}
     * this method clear value and displayValue of mapped attribute recursively 
     */
    clearMappedDSFValue(fieldAttributeMasterId, dataStoreFilterReverseMap, formElement) {
        if (!fieldAttributeMasterId) {
            throw new Error(FIELD_ATTRIBUTE_ATTR_MASTER_ID_MISSING)
        }
        if (!formElement) {
            throw new Error(FORM_ELEMENT_IS_MISSING)
        }
        if (_.isEmpty(dataStoreFilterReverseMap)) {
            return formElement
        }
        let fieldAttributeMasterIdList = dataStoreFilterReverseMap[fieldAttributeMasterId]
        for (let childFieldAttributeMasterIdCounter in fieldAttributeMasterIdList) {
            let childFieldAttributeMasterId = fieldAttributeMasterIdList[childFieldAttributeMasterIdCounter]
            let singleFormElement = formElement.get(childFieldAttributeMasterId)
            if (singleFormElement) {
                singleFormElement.value = singleFormElement.displayValue = singleFormElement.value ? null : singleFormElement.value
            }
            if (dataStoreFilterReverseMap[childFieldAttributeMasterId]) {
                formElement = this.clearMappedDSFValue(childFieldAttributeMasterId, dataStoreFilterReverseMap, formElement)
            }
        }
        return formElement
    }

    /**
     * This method works in case of Array having DSF
     * @param {*} token 
     * @param {*} currentElement  // Data store filter element
     * @param {*} formElement // Contains formElement of all rows
     * @param {*} jobTransaction 
     * @param {*} arrayReverseDataStoreFilterMap // Object having mapped id's so we can back track and remove value property from formElement if any dsf is edited by the user
     * @param {*} rowId // Current rowId
     * @param {*} arrayFieldAttributeMasterId // fieldAttributeMasterId of array
     */
    async fetchDataForFilterInArray(token, currentElement, formElement, jobTransaction, arrayReverseDataStoreFilterMap, rowId, arrayFieldAttributeMasterId) {
        let rowFormElement = formElement[rowId].formLayoutObject //get current formElement 
        let dataStoreFilterReverseMap = arrayReverseDataStoreFilterMap[arrayFieldAttributeMasterId] //get map for current array this may contain map of multiple arrays
        let returnParams = await this.fetchDataForFilter(token, currentElement, false, rowFormElement, jobTransaction, dataStoreFilterReverseMap) //get Data for DSF
        let cloneArrayReverseDataStoreFilterMap = _.cloneDeep(arrayReverseDataStoreFilterMap)
        cloneArrayReverseDataStoreFilterMap[arrayFieldAttributeMasterId] = returnParams.dataStoreFilterReverseMap //change reverse DSF map which contains all mapping related to DSF and Data store
        return {
            dataStoreFilterResponse: returnParams.dataStoreFilterResponse,
            arrayReverseDataStoreFilterMap: cloneArrayReverseDataStoreFilterMap
        }
    }

    /** In case of bulk job check value of jobAttribute which is mapped with DSF contains same or not if same value is there then return that value else throw an error
    * @param {*} jobTransaction
    * @param {*} filteredJobAttribute
    */
    checkForSameJobDataValue(jobTransaction, filteredJobAttribute) {
        let uniqueValueObject = {}, jobData
        //loop through all jobTransactions and get jobData for particular jobAttribute i.e. filteredJobAttribute
        for (let jobTransactionObjectIndex in jobTransaction) {
            let jobDataQuery = `jobId = ${jobTransaction[jobTransactionObjectIndex].jobId} AND jobAttributeMasterId = ${filteredJobAttribute[0].id} AND parentId = 0` //get jobData with filteredJobAttribute and it should be parent only
            jobData = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
            if (jobData[0]) { //if jobData is present put its value as key and value
                uniqueValueObject[jobData[0].value] = jobData[0].value
            } else { //if not present than put a dummy value as key and value
                uniqueValueObject['empty_ds_value'] = 'empty_ds_value'
            }
        }
        //if uniqueValueObject is not empty and don't have single entry then throw an error
        if (!_.isEmpty(uniqueValueObject) && _.size(uniqueValueObject) != 1) {
            throw new Error(INVALID_BULK_JOB_CONFIG)
        }
        return jobData //if unique value exist in job data of all jobs
    }
}

export let dataStoreFilterService = new DataStoreFilterService()