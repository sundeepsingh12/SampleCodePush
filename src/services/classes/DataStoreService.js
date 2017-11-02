'use strict'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
const {
    REMARKS,
    MINMAX,
    SPECIAL
} = require('../../lib/constants').default

import {
    DATA_STORE_ATTR_MASTER_ID,
    DATA_STORE_MASTER_ID,
    SEARCH_VALUE,
    GET
} from '../../lib/AttributeConstants'

class DataStoreService {

    getValidations(validationArray) {
        if (!validationArray) {
            throw new Error('Validation Array Missing')
        }
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
                        validationObject.isAllowFromField = (validation.condition == 'true')
                        break
                }
            }
        }
        return validationObject;
    }

    fetchJson(token, searchText, dataStoreMasterId, dataStoreMasterAttributeId) {
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

    getDataStoreAttrValueMapFromJson(dataStoreResponse) {
        if (!dataStoreResponse) {
            throw new Error('dataStoreResponse is missing')
        }
        let dataStoreAttrValueMap = {}
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
}

export let dataStoreService = new DataStoreService()