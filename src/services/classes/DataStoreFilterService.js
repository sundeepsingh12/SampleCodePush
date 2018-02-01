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
    FORM_ELEMENT_IS_MISSING
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

    fetchDSF(token, postJSON) {
        const url = CONFIG.API.DATA_STORE_FILTER_SEARCH
        const dataStoreFilterResponse = RestAPIFactory(token.value).serviceCall(postJSON, url, POST)
        return dataStoreFilterResponse
    }

    prepareDataStoreFilterMap(currentElement, formElement, jobTransaction, jobAttributes, dataStoreFilterReverseMap) {
        if (!currentElement) {
            throw new Error(CURRENT_ELEMENT_MISSING)
        }
        if (!currentElement.dataStoreFilterMapping || _.isEqual(currentElement.dataStoreFilterMapping, '[]')) {
            return {}
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

    parseKey(key, fieldAttributeMasterId, formElement, jobTransaction, jobAttributes, dataStoreAttributeIdtoValueMap, dataStoreFilterReverseMap) {
        if (key[0] == 'F') {
            let fieldAttributeKey = fieldValidationService.splitKey(key, false)
            for (let [id, currentObject] of formElement.entries()) {
                if (_.isEqual(fieldAttributeKey, currentObject.key)) {
                    if (currentObject.value) {
                        dataStoreAttributeIdtoValueMap[currentObject.dataStoreAttributeId] = currentObject.value
                    }
                    if (dataStoreFilterReverseMap[currentObject.fieldAttributeMasterId]) {
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
            let jobDataQuery = `jobId = ${jobTransaction.jobId} AND jobAttributeMasterId = ${filteredJobAttribute[0].id} AND parentId = 0`
            const jobData = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobDataQuery)
            if (jobData[0]) {
                dataStoreAttributeIdtoValueMap[filteredJobAttribute[0].dataStoreAttributeId] = jobData[0].value
            }
        }
        return {
            dataStoreAttributeIdtoValueMap,
            dataStoreFilterReverseMap
        }
    }

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
}

export let dataStoreFilterService = new DataStoreFilterService()