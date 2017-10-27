'use strict'
import {
    keyValueDBService,
} from './KeyValueDBService'

import {
    FIXED_SKU_QUANTITY,
    FIXED_SKU_UNIT_PRICE,
    FIXED_SKU_CODE,
    OBJECT_ATTR_ID,
    OBJECT_SAROJ_FAREYE,
    TOTAL_AMOUNT
} from '../../lib/AttributeConstants'

import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'

class DataStoreService {

    getValidationsArray(validationArray) {
        let validationObject = {}
        for (let validation of validationArray) {
            if (validation.timeOfExecution) {
                switch (validation.timeOfExecution) {
                    case 'REMARKS':
                        if (validationObject.isScannerEnabled) {
                            validationObject.isAutoStartScannerEnabled = (validation.condition == 'true') ? true : false
                        } else {
                            validationObject.isScannerEnabled = (validation.condition == 'true') ? true : false
                            validationObject.isAutoStartScannerEnabled = false
                        }
                    case 'SPECIAL':
                        validationObject.isSearchEnabled = validation.condition == 'true' ? true : false
                        break
                    case 'MINMAX':
                        validationObject.isAllowFromField = (validation.condition == 'true') ? true : false
                        break
                }
            }
        }
        return validationObject;
    }

    fetchJson(token, searchText, dataStoreMasterId, dataStoreMasterAttributeId) {
        const url = CONFIG.API.SERVICE_DSA + "?searchValue=" + encodeURIComponent(searchText) + "&dataStoreMasterId=" + dataStoreMasterId + "&dataStoreMasterAttributeId=" + dataStoreMasterAttributeId
        const dataStoreResponse = RestAPIFactory(token.value).serviceCall(null, url, 'GET')
        return dataStoreResponse
    }

    async getDataStoreAttrValueMapFromJson(dataStoreResponse) {
        if (dataStoreResponse && dataStoreResponse.status == 200) {
            let dataStoreAttrValueMap = {}
            let jsonResponse = await dataStoreResponse.json
            for (let itemCounter in jsonResponse.items) {
                let itemObject = jsonResponse.items[itemCounter]
                let { matchKey, uniqueKey, details } = itemObject
                delete details.dataStoreAttributeValueMap._id;
                let dataStoreObject = {
                    id: itemCounter,
                    uniqueKey,
                    matchKey,
                    dataStoreAttributeValueMap: details.dataStoreAttributeValueMap
                }
                dataStoreAttrValueMap[itemCounter] = dataStoreObject
            }
            return dataStoreAttrValueMap
        }
        return null
    }
}

export let dataStoreService = new DataStoreService()