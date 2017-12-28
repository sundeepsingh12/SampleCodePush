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
    LAST_DATASTORE_SYNC_TIME,
    _id
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
            console.log('getDataStoreAttrValueMapFromJson', dataStoreAttrValueMap)
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
                currentObject.displayValue = dataStoreAttributeValueMap[currentObject.key]
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

    /**
     * This function return fieldAttribute with matching fieldAttributeMasterId
     * @param {*} fieldAttributes
     * @param {*} fieldAttributeMasterId
     * @returns 
     * array having only one fieldData object
     */
    getFieldAttribute(fieldAttributes, fieldAttributeMasterId) {
        if (!fieldAttributes) {
            throw new Error('fieldAttributes missing')
        }
        if (!fieldAttributeMasterId) {
            throw new Error('fieldAttributeMasterId missing')
        }
        return fieldAttributes.filter(fieldAttribute => fieldAttribute.id == fieldAttributeMasterId)
    }

    /**
     * This function return jobAttribute with matching jobAttributeMasterId
     * @param {*} jobAttributes
     * @param {*} jobAttributeMasterId
     * @returns 
     * array having only one jobData object
     */
    getJobAttribute(jobAttributes, jobAttributeMasterId) {
        if (!jobAttributes) {
            throw new Error('jobAttributes missing')
        }
        if (!jobAttributeMasterId) {
            throw new Error('jobAttributeMasterId missing')
        }
        return jobAttributes.filter(jobAttributes => jobAttributes.id == jobAttributeMasterId)
    }

    /*
    Offline Datastore service methods  
    */


    /**
    * This function fetch data store master
    * @param {*} token
    * @returns 
    * jsonReponse from Server
    */
    fetchDataStoreMaster(token) {
        if (!token) {
            throw new Error('Token Missing')
        }
        const url = CONFIG.API.DATASTORE_MASTER
        const dataStoreMasterResponse = RestAPIFactory(token.value).serviceCall(null, url, GET)
        return dataStoreMasterResponse
    }

    /**
   * This function return list of dataStoreMasterId
   * @param {*} fieldAttributes
   * @returns 
   * array - dataStoreMasterId List which have mapping with fieldAttributes
   */
    getDataStoreMasterIdMappedWithFieldAttribute(fieldAttributes) {
        if (!fieldAttributes) {
            throw new Error('fieldAttributes missing')
        }
        let dataStoreMasterIdList = []
        for (let fieldAttributeObject of fieldAttributes) {
            if (fieldAttributeObject.attributeTypeId == DATA_STORE && _.indexOf(dataStoreMasterIdList, fieldAttributeObject.dataStoreMasterId) < 0) {
                dataStoreMasterIdList.push(fieldAttributeObject.dataStoreMasterId)
            }
        }
        return dataStoreMasterIdList
    }

    /**
    * @param {*} dataStoreMasterjsonResponse
    * @param {*} dataStoreMasterIdList
    * @returns 
    * object
    {
            dataStoreIdVSTitleMap, //contains dataStoreMasterId vs data store name 
            dataStoreMasterList // contains dataStoreMasters which we have to save in db
    } 
    */
    getDataStoreMasterList(dataStoreMasterjsonResponse, dataStoreMasterIdList) {
        if (!dataStoreMasterjsonResponse) {
            throw new Error('dataStoreMasterjsonResponse missing')
        }
        if (!dataStoreMasterIdList) {
            throw new Error('dataStoreMasterIdList missing')
        }
        const dataStoreMasterListToBeSaved = dataStoreMasterjsonResponse.filter(dataStoreMaster => _.indexOf(dataStoreMasterIdList, dataStoreMaster.dsMasterId) >= 0)
        let dataStoreMasterList = []
        let dataStoreIdVSTitleMap = {}
        let id = 0
        for (let dataStoreMaster of dataStoreMasterListToBeSaved) {
            dataStoreIdVSTitleMap[dataStoreMaster.dsMasterId] = dataStoreMaster.dsMasterTitle
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
        return {
            dataStoreIdVSTitleMap,
            dataStoreMasterList
        }
    }

    /**
    * This function fetch dataStoreMasters
    * @param {*} token
    * @returns 
    * object
            dataStoreIdVSTitleMap, //contains dataStoreMasterId vs data store name 
    */
    async getDataStoreMasters(token) {
        if (!token) {
            throw new Error('Token Missing')
        }
        const dataStoreMasterResponse = await this.fetchDataStoreMaster(token)
        const dataStoreMasterjsonResponse = await dataStoreMasterResponse.json
        const fieldAttributes = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
        const dataStoreMasterIdList = await this.getDataStoreMasterIdMappedWithFieldAttribute(fieldAttributes.value)
        await realm.deleteSpecificTableRecords(Datastore_Master_DB)
        let { dataStoreIdVSTitleMap, dataStoreMasterList } = await this.getDataStoreMasterList(dataStoreMasterjsonResponse, dataStoreMasterIdList)
        realm.performBatchSave({
            tableName: Datastore_Master_DB,
            value: dataStoreMasterList
        })
        return dataStoreIdVSTitleMap
    }


    /**
    * This function fetch data store
    * @param {*} token
    * @param {*} datastoreMasterId
    * @param {*} lastSyncTime
    * @param {*} currentPageNumber
    * @returns 
    * dataStoreResponse: jsonReponse from Server
    */
    fetchDataStore(token, datastoreMasterId, lastSyncTime, currentPageNumber) {
        if (!token) {
            throw new Error('Token Missing')
        }
        if (!datastoreMasterId) {
            throw new Error('datastoreMasterId missing')
        }
        const url = CONFIG.API.DATASTORE_DATA_FETCH_WITH_DATETIME + '?dataStoreMasterId=' + datastoreMasterId + '&pageNumber=' + currentPageNumber + '&pageSize=500' + '&lastDataStoreSyncTime=' + encodeURIComponent(lastSyncTime)
        const dataStoreResponse = RestAPIFactory(token.value).serviceCall(null, url, GET)
        return dataStoreResponse
    }

    /**
    * This function save data store to DB 
    * @param {*} dataStoreJsonResponse
    */
    async saveDataStoreToDB(dataStoreJsonResponse) {
        if (!dataStoreJsonResponse) {
            return
        }
        let dataStoreId = realm.getAll(DataStore_DB).length
        let dataStoreList = []
        for (let dataStore of dataStoreJsonResponse.content) {
            for (let attribute in dataStore.dataStoreAttributeValueMap) {
                let dataStoreAttrValue = { id: dataStoreId++, key: attribute, value: dataStore.dataStoreAttributeValueMap[attribute], serverUniqueKey: dataStore.id, datastoreMasterId: dataStore.dataStoreMasterId }
                dataStoreList.push(dataStoreAttrValue)
            }
            await this.checkIfRecordPresentWithServerId(dataStore.id)
        }
        await realm.performBatchSave({ tableName: DataStore_DB, value: dataStoreList })
    }

    /**
     * delete records if present with given serverKey
     * @param {*} serverKey 
     */
    async checkIfRecordPresentWithServerId(serverKey) {
        if (!serverKey) {
            throw new Error('serverUniqueKey missing')
        }
        await realm.deleteSingleRecord(DataStore_DB, serverKey, 'serverUniqueKey')
    }

    /**
   * This function fetch data store with page size of 500 
   * @param {*} token
   * @param {*} datastoreMasterId
   * @param {*} currentPageNumber
   * @param {*} lastSyncTime
   * @returns 
   * jsonReponse from Server containing totalElements & numberOfElements
   */
    async fetchDatastoreAndSaveInDB(token, datastoreMasterId, currentPageNumber, lastSyncTime) {
        if (!token) {
            throw new Error('Token Missing')
        }
        if (!datastoreMasterId) {
            throw new Error('datastoreMasterId missing')
        }
        const dataStoreResponse = await this.fetchDataStore(token, datastoreMasterId, lastSyncTime, currentPageNumber)
        let dataStoreJsonResponse = await dataStoreResponse.json
        await this.saveDataStoreToDB(dataStoreJsonResponse)
        return {
            totalElements: dataStoreJsonResponse.totalElements,
            numberOfElements: dataStoreJsonResponse.numberOfElements
        }
    }

    /**
   * This function returns time difference
   * @param {*} lastSyncTime
   * string - time difference between current time and last synced time
   */
    getLastSyncTimeInFormat(lastSyncTime) {
        if (!lastSyncTime) {
            throw new Error('lastSyncTime not present')
        }
        const differenceInDays = moment().diff(lastSyncTime, 'days')
        const differenceInHours = moment().diff(lastSyncTime, 'hours')
        const differenceInMinutes = moment().diff(lastSyncTime, 'minutes')
        const differenceInSeconds = moment().diff(lastSyncTime, 'seconds')
        let timeDifference = ""
        if (differenceInDays > 0) {
            timeDifference = `${differenceInDays} days ago`
        } else if (differenceInHours > 0) {
            timeDifference = `${differenceInHours} hours ago`
        } else if (differenceInMinutes > 0) {
            timeDifference = `${differenceInMinutes} minutes ago`
        } else {
            timeDifference = `${differenceInSeconds} seconds ago`
        }
        return timeDifference
    }

    /**
* This function check if offline data store is present or not and if present then return the queried results
* @param {*} searchText
* @param {*} dataStoreMasterId
* @returns
* {
            offlineDSPresent: boolean,
            dataStoreAttrValueMap: map containing queried records
   }
*/
    async checkForOfflineDsResponse(searchText, dataStoreMasterId) {
        if (!searchText) {
            throw new Error('searchText not present')
        }
        if (!dataStoreMasterId) {
            throw new Error('dataStoreMasterId not present')
        }
        let query = `datastoreMasterId = ${dataStoreMasterId}`
        let dataStoreMasterResult = await realm.getRecordListOnQuery(Datastore_Master_DB, query)
        if (dataStoreMasterResult.length == 0) {
            return { offlineDSPresent: false }
        }
        let searchList = [], uniqueKey
        for (let index in dataStoreMasterResult) {
            let dataStoreMasterAttribute = { ...dataStoreMasterResult[index] }
            if (dataStoreMasterAttribute.uniqueIndex) {
                uniqueKey = dataStoreMasterAttribute.key
                searchList.push(dataStoreMasterAttribute.key)
            } else if (dataStoreMasterAttribute.searchIndex) {
                searchList.push(dataStoreMasterAttribute.key)
            }
        }
        let listOfUniqueRecords = await this.searchDataStore(searchText, dataStoreMasterId, searchList)
        let dataStoreAttrValueMap = await this.createDataStoreAttrValueMap(uniqueKey, listOfUniqueRecords)
        return {
            offlineDSPresent: true,
            dataStoreAttrValueMap
        }
    }

    /**
 * This function search records that contains given search text
 * @param {*} searchText
 * @param {*} dataStoreMasterId
 * @param {*} searchList
 * @returns
 * listOfUniqueRecords: array of records which contains search text
 */
    async searchDataStore(searchText, dataStoreMasterId, searchList) {
        if (!searchList) {
            throw new Error('searchList not present')
        }
        let searchQuery = `(`
        searchQuery += searchList.map(listItem => `key  = "${listItem}"`).join(` OR `)
        searchQuery += `) AND value CONTAINS[c] "${searchText}" AND datastoreMasterId = ${dataStoreMasterId}`
        let queryList = realm.getRecordListOnQuery(DataStore_DB, searchQuery)
        let listOfUniqueRecords = []
        for (let index in queryList) {
            let resultObject = { ...queryList[index] }
            if (listOfUniqueRecords.indexOf(resultObject.serverUniqueKey) < 0) {
                listOfUniqueRecords.push({
                    serverUniqueKey: resultObject.serverUniqueKey,
                    matchKey: resultObject.key
                })
            }
        }
        return listOfUniqueRecords
    }

    /**
  * This function returns map containing search records from data store table
  * @param {*} uniqueKey
  * @param {*} listOfUniqueRecords
  * dataStoreAttrValueMap : map containing queried records
  */
    createDataStoreAttrValueMap(uniqueKey, listOfUniqueRecords) {
        if (!listOfUniqueRecords) {
            throw new Error('listOfUniqueRecords not present')
        }
        let dataStoreAttrValueMap = {}, id = 0
        for (let record of listOfUniqueRecords) {
            let dataStoreAttributeValueMapQuery = `serverUniqueKey = "${record.serverUniqueKey}"`
            let dataStoreAttributeResult = realm.getRecordListOnQuery(DataStore_DB, dataStoreAttributeValueMapQuery, null, null)
            let listOfAttributes = {}
            for (let index in dataStoreAttributeResult) {
                let singleEntryOfAttrValueMap = { ...dataStoreAttributeResult[index] }
                listOfAttributes[singleEntryOfAttrValueMap.key] = singleEntryOfAttrValueMap.value
            }
            listOfAttributes[_id] = record.serverUniqueKey
            if (!uniqueKey) {
                uniqueKey = _id
            }
            let dataStoreObject = { id, uniqueKey: uniqueKey, matchKey: record.matchKey, dataStoreAttributeValueMap: listOfAttributes }
            dataStoreAttrValueMap[id] = dataStoreObject
            id++
        }
        console.log('dataStoreAttrValueMap', dataStoreAttrValueMap)
        return dataStoreAttrValueMap
    }
}

export let dataStoreService = new DataStoreService()