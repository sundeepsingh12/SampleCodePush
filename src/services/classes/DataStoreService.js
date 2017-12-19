'use strict'
import CONFIG from '../../lib/config'
import RestAPIFactory from '../../lib/RestAPIFactory'
import {
    REMARKS,
    MINMAX,
    SPECIAL,
    TABLE_FIELD_DATA,
    FIELD_ATTRIBUTE,
    Datastore_Master_DB,
    Datastore_AttributeValue_DB,
    DataStore_DB,
    LAST_DATASTORE_SYNC_TIME
} from '../../lib/constants'

import {
    DATA_STORE_ATTR_MASTER_ID,
    DATA_STORE_MASTER_ID,
    SEARCH_VALUE,
    GET,
    EXTERNAL_DATA_STORE_URL,
    DATA_STORE_ATTR_KEY,
    DATA_STORE,
} from '../../lib/AttributeConstants'
import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import moment from 'moment'
import { keyValueDb } from '../../repositories/keyValueDb'
import _ from 'lodash'
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

    getFieldAttribute(fieldAttributes, fieldAttributeMasterId) {
        if (!fieldAttributes) {
            throw new Error('fieldAttributes missing')
        }
        if (!fieldAttributeMasterId) {
            throw new Error('fieldAttributeMasterId missing')
        }
        return fieldAttributes.filter(fieldAttribute => fieldAttribute.id == fieldAttributeMasterId)
    }

    /*
    Offline Datastore service methods  
    */

    fetchDataStoreMaster(token) {
        if (!token) {
            throw new Error('Token Missing')
        }
        const url = CONFIG.API.DATASTORE_MASTER
        const dataStoreMasterResponse = RestAPIFactory(token.value).serviceCall(null, url, GET)
        return dataStoreMasterResponse
    }

    getDataStoreMasterIdMappedWithFieldAttribute(fieldAttributes) {
        let dataStoreMasterIdList = []
        for (let fieldAttributeObject of fieldAttributes) {
            if (fieldAttributeObject.attributeTypeId == DATA_STORE && _.indexOf(dataStoreMasterIdList, fieldAttributeObject.dataStoreMasterId) < 0) {
                console.log('getDataStoreMasterIdMappedWithFieldAttribute', fieldAttributeObject)
                dataStoreMasterIdList.push({
                    dataStoreMasterId: fieldAttributeObject.dataStoreMasterId,
                })
            }
        }
        return dataStoreMasterIdList
    }

    saveDataStoreMasterToDB(dataStoreMasterjsonResponse, dataStoreMasterIdList) {
        const dataStoreMasterListToBeSaved = dataStoreMasterjsonResponse.filter(dataStoreMaster => _.indexOf(dataStoreMasterIdList, dataStoreMaster.dsMasterId) >= 0)
        let dataStoreMasterList = []
        let id = 0
        for (let dataStoreMaster of dataStoreMasterListToBeSaved) {
            let dataStoreMasterObject = {
                attributeTypeId: dataStoreMaster.attributeTypeId,
                datastoreMasterId: dataStoreMaster.dsMasterId,
                id: id++,
                key: dataStoreMaster.key,
                label: dataStoreMaster.label,
                lastSyncTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                searchIndex: dataStoreMaster.searchIndex,
                uniqueIndex: dataStoreMaster.uniqueIndex,
            }
            dataStoreMasterList.push(dataStoreMasterObject)
        }
        realm.performBatchSave({
            tableName: Datastore_Master_DB,
            value: dataStoreMasterList
        })
    }

    async syncDataStore(token) {
        try {
            const dataStoreMasterResponse = await this.fetchDataStoreMaster(token)
            const dataStoreMasterjsonResponse = await dataStoreMasterResponse.json
            const fieldAttributes = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const dataStoreMasterIdList = await this.getDataStoreMasterIdMappedWithFieldAttribute(fieldAttributes.value)
            await realm.deleteSpecificTableRecords(Datastore_Master_DB)
            await this.saveDataStoreMasterToDB(dataStoreMasterjsonResponse, dataStoreMasterIdList)
            return dataStoreMasterIdList
        } catch (error) {
            console.log(error)
        }
    }

    fetchDataStore(token, datastoreMasterId, lastSyncTime, currentPageNumber) {
        if (!token) {
            throw new Error('Token Missing')
        }
        if (!datastoreMasterId) {
            throw new Error('datastoreMasterId missing')
        }
        console.log('lastSyncTime', encodeURIComponent(lastSyncTime))
        console.log('currentPageNumber', currentPageNumber)
        const url = CONFIG.API.DATASTORE_DATA_FETCH_WITH_DATETIME + '?dataStoreMasterId=' + datastoreMasterId + '&pageNumber=' + currentPageNumber + '&pageSize=500' + '&lastDataStoreSyncTime=' + encodeURIComponent(lastSyncTime)
        const dataStoreResponse = RestAPIFactory(token.value).serviceCall(null, url, GET)
        return dataStoreResponse
    }

    async  saveDataStoreToDB(dataStoreJsonResponse) {
        if (dataStoreJsonResponse) {
            let dataStoreList = []
            let dataStoreId = realm.getAll(DataStore_DB).length
            let id = realm.getAll(Datastore_AttributeValue_DB).length
            for (let dataStore of dataStoreJsonResponse.content) {
                let dataStoreAttrValueList = []
                for (let attribute in dataStore.dataStoreAttributeValueMap) {
                    // let checkServerIdQuery = `serverUniqueKey = "${dataStore.id}"`
                    // let queryResult = realm.getRecordListOnQuery(Datastore_AttributeValue_DB, checkServerIdQuery, null, null)
                    // if (queryResult.length > 0) {
                    //  realm.deleteRecordList
                    // }
                    let dataStoreAttrValue = { id: id++, key: attribute, value: dataStore.dataStoreAttributeValueMap[attribute], serverUniqueKey: dataStore.id }
                    dataStoreAttrValueList.push(dataStoreAttrValue)
                }
                await realm.performBatchSave({ tableName: Datastore_AttributeValue_DB, value: dataStoreAttrValueList })
                let dataStoreAttrQuery = `serverUniqueKey = "${dataStore.id}"`
                let dataStoreAttributeResult = realm.getRecordListOnQuery(Datastore_AttributeValue_DB, dataStoreAttrQuery, null, null)
                let listOfAttributes = []
                for (let index in dataStoreAttributeResult) {
                    listOfAttributes.push({ ...dataStoreAttributeResult[index] })
                }
                let dataStoreObject = { id: dataStoreId++, datastoreMasterId: dataStore.dataStoreMasterId, datastoreAttributeValueMap: listOfAttributes }
                dataStoreList.push(dataStoreObject)
            }
            await realm.performBatchSave({ tableName: DataStore_DB, value: dataStoreList })
            // let all = realm.getAll(DataStore_DB)
            // for (let index in all) {
            //     let fieldData = { ...all[index] }
            //     let abc = fieldData.datastoreAttributeValueMap
            //     console.log('fieldData', abc)
            //     let result1 = abc.filtered('value = "hello"')
            //     console.log({...result1[0]})
            //     console.log('result1', result1)
            // }
        }
    }

    async fetchDatastoreAndSaveInDB(token, datastoreMasterId, currentPageNumber, lastSyncTime) {
        console.log('fetchDatastoreAndSaveInDB')
        const dataStoreResponse = await this.fetchDataStore(token, datastoreMasterId, lastSyncTime, currentPageNumber)
        let dataStoreJsonResponse = await dataStoreResponse.json
        await this.saveDataStoreToDB(dataStoreJsonResponse)
        console.log('dataStoreJsonResponse', dataStoreJsonResponse)
        return {
            totalElements: dataStoreJsonResponse.totalElements,
            totalPage: dataStoreJsonResponse.totalPage
        }
    }
}

export let dataStoreService = new DataStoreService()