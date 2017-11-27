'use strict'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    REMARKS,
    MINMAX,
    SPECIAL,
    TABLE_FIELD_DATA
} from '../../lib/constants'

import {
    DATA_STORE_ATTR_MASTER_ID,
    DATA_STORE_MASTER_ID,
    SEARCH_VALUE,
    GET,
    EXTERNAL_DATA_STORE_URL,
    DATA_STORE_ATTR_KEY
} from '../../lib/AttributeConstants'
import * as realm from '../../repositories/realmdb'

class DataStoreService {

    /**
    * This function returns validation object
    * @param {*} validationArray 
    * @returns 
    * {
        isScannerEnabled : boolean
        isAutoStartScannerEnabled : boolean
        isSearchEnabled : boolean
        isMinMaxValidation : boolean
    * }
    */
    getValidations(validationArray) {
        let validationObject = {}
        for (let validation of validationArray) {
            if (validation.timeOfExecution) {
                switch (validation.timeOfExecution) {
                    case REMARKS:
                        if (validationObject.isScannerEnabled) {
                            validationObject.isAutoStartScannerEnabled = (validation.condition == 'true')
                        } else {
                            validationObject.isScannerEnabled = (validation.condition == 'true')
                            validationObject.isAutoStartScannerEnabled = false
                        }
                        break
                    case SPECIAL:
                        validationObject.isSearchEnabled = (validation.condition == 'true')
                        break
                    case MINMAX:
                        validationObject.isMinMaxValidation = (validation.condition == 'true')
                        break
                }
            }
        }
        return validationObject;
    }

    /**
   * This function fetch for data store search value
   * @param {*} token
   * @param {*} searchText
   * @param {*} dataStoreMasterId
   * @param {*} dataStoreMasterAttributeId
   * @returns 
   * jsonReponse from Server
   */
    fetchJsonForDS(token, searchText, dataStoreMasterId, dataStoreMasterAttributeId) {
        if (!token) {
            throw new Error('Token Missing')
        }
        if (!dataStoreMasterAttributeId) {
            throw new Error('DataStoreMasterAttributeId missing in currentElement')
        }
        if (!dataStoreMasterId) {
            throw new Error('DataStoreMasterId missing in currentElement')
        }
        if (!searchText) {
            throw new Error('Search Text not present')
        }
        const url = CONFIG.API.SERVICE_DSA + SEARCH_VALUE + encodeURIComponent(searchText) + DATA_STORE_MASTER_ID + dataStoreMasterId + DATA_STORE_ATTR_MASTER_ID + dataStoreMasterAttributeId
        const dataStoreResponse = RestAPIFactory(token.value).serviceCall(null, url, GET)
        return dataStoreResponse
    }

    /** 
     * This function returns data store attribute Map
        * @param {*} dataStoreResponse 
        * @returns 
        * {
            id:{
                id :integer,
                matchKey : string,
                uniqueKey : string,
                dataStoreAttributeValueMap :{
                    matchKey : string,
                    uniqueKey : string
                }
            }
        * }
        */
    getDataStoreAttrValueMapFromJson(dataStoreResponse) {
        let dataStoreAttrValueMap = {}
        if (!dataStoreResponse) {
            return dataStoreAttrValueMap
        }
        for (let itemCounter in dataStoreResponse.items) {
            let itemObject = dataStoreResponse.items[itemCounter]
            delete itemObject.details.dataStoreAttributeValueMap._id;
            let dataStoreObject = {
                id: itemCounter,
                uniqueKey: itemObject.uniqueKey,
                matchKey: itemObject.matchKey,
                dataStoreAttributeValueMap: itemObject.details.dataStoreAttributeValueMap
            }
            dataStoreAttrValueMap[itemCounter] = dataStoreObject
        }
        return dataStoreAttrValueMap
    }


    /**
        * This function returns data store attribute Map
        * @param {*} dataStoreAttributeValueMap
        * @param {*} formElements
        * @returns 
        * formElements having mapped keys value changed
        */
    fillKeysInFormElement(dataStoreAttributeValueMap, formElements) {
        if (!dataStoreAttributeValueMap) {
            throw new Error('dataStoreAttributeValueMap not present')
        }
        if (!formElements) {
            throw new Error('formElements not present')
        }
        for (let [id, currentObject] of formElements.entries()) {
            if (dataStoreAttributeValueMap[currentObject.key]) {
                currentObject.value = dataStoreAttributeValueMap[currentObject.key]
            }
        }
        return formElements
    }

    /**
  * This function fetch for external data store search value
  * @param {*} token
  * @param {*} searchText
  * @param {*} externalDataStoreUrl
  * @param {*} attributeKey
  * @returns 
  * jsonReponse from Server
  */
    fetchJsonForExternalDS(token, searchText, externalDataStoreUrl, attributeKey) {
        if (!token) {
            throw new Error('Token Missing')
        }
        if (!externalDataStoreUrl) {
            throw new Error('ExternalDataStoreUrl missing in currentElement')
        }
        if (!attributeKey) {
            throw new Error('AttributeKey missing in currentElement')
        }
        if (!searchText) {
            throw new Error('Search Text not present')
        }
        const url = CONFIG.API.SERVICE_DSA_EXTERNAL + SEARCH_VALUE + encodeURIComponent(searchText) + EXTERNAL_DATA_STORE_URL + encodeURIComponent(externalDataStoreUrl) + DATA_STORE_ATTR_KEY + attributeKey
        const dataStoreResponse = RestAPIFactory(token.value).serviceCall(null, url, GET)
        return dataStoreResponse
    }

    /**
      * This function checks for dataStoreValue present in TABLE_FIELD_DATA for external data store fieldAttributeMasterId
      * @param {*} dataStoreValue
      * @param {*} fieldAttributeMasterId
      * @returns 
      * boolean
      */
    dataStoreValuePresentInFieldData(dataStoreValue, fieldAttributeMasterId) {
        if (!dataStoreValue) {
            throw new Error('dataStorevalue missing in currentElement')
        }
        if (!fieldAttributeMasterId) {
            throw new Error('fieldAttributeMasterId missing in currentElement')
        }
        let fieldDataQuery = `fieldAttributeMasterId =  ${fieldAttributeMasterId}`
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery, null, null)
        for (let index in fieldDataList) {
            let fieldData = { ...fieldDataList[index] }
            if (fieldData.value == dataStoreValue) {
                return true
            }
        }
        return false
    }
}

export let dataStoreService = new DataStoreService()