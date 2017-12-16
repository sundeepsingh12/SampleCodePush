'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { setState } from '../global/globalActions'
import {
    FIELD_ATTRIBUTE,
    LAST_DATASTORE_SYNC_TIME
} from '../../lib/constants'
import {
    EXTERNAL_DATA_STORE,
    DATA_STORE
} from '../../lib/AttributeConstants'
import CONFIG from '../../lib/config'
import _ from 'lodash'
import * as realm from '../../repositories/realmdb'
import moment from 'moment'


/**This is called when save button is clicked 
 * Fills all the corresponding matched key fieldAttributes from dataStoreAttributeMap and update formLayout state
 * 
 * @param {*} dataStoreAttributeValueMap 
 * @param {*} fieldAttributeMasterId 
 * @param {*} formElements  
 * @param {*} isSaveDisabled 
 * @param {*} dataStorevalue 
 */
export function getDataStore() {
    return async function (dispatch) {
        try {

            // realm.save('Car', {
            //     make: 'honda',
            //     model: 'city'
            // })
            // let obj = realm.getAll('Car')
            // console.log('test>>', { ...obj[0] })
            // console.log('getDataStore')
            // realm.save('Person',
            //     {
            //         name: 'abhisehk',
            //         birthday: 'date',
            //         cars: [{ ...obj[0] }]
            //     }
            // )
            // let obj1 = realm.getAll('Person')
            // let temp = { ...obj1[0] }
            // let result = temp.cars
            // console.log('temp',obj1)
            // console.log('resultfilter',result)
            // let result1 = result.filtered('make = "honda"')
            // console.log(result1)
            // console.log({...result1[0]})
            // console.log('test1>>', { ...obj1[0] }, { ...temp.cars[0] })
            // console.log('getDataStore')


            // realm.save(Datastore_Master_DB, {
            //     attributeTypeId: 12222,
            //     datastoreMasterId: 2,
            //     id: 3,
            //     key: 'DS',
            //     label: 'dataStore',
            //     lastSyncTime: '123',
            //     searchIndex: true,
            //     uniqueIndex: true
            // })

            // let obj = realm.getAll(Datastore_Master_DB)
            // console.log('test>>', { ...obj[0] })
            // console.log('getDataStore')

        } catch (error) {
            console.log(error)
        }
    }
}


export function syncDataStore() {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let dataStoreMasterIdList = await dataStoreService.syncDataStore(token)
            const lastSyncTime = await keyValueDBService.getValueFromStore(LAST_DATASTORE_SYNC_TIME)
            console.log('lastDataStoreSyncTime', lastSyncTime)
            lastSyncTime = (lastSyncTime) ? lastSyncTime.value : null
            for (let datastoreMasterId of dataStoreMasterIdList) {
                let currentPageNumber = 0, totalPage = 1;
                let responseResults
                console.log('datastoreMasterId', datastoreMasterId)
                do {
                    responseResults = await dataStoreService.fetchDatastoreAndSaveInDB(token, datastoreMasterId, currentPageNumber, lastSyncTime)
                    currentPageNumber++
                }
                while (currentPageNumber < responseResults)
            }
            console.log('after')
            // await keyValueDBService.validateAndSaveData(LAST_DATASTORE_SYNC_TIME, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            // let time = await keyValueDBService.getValueFromStore(LAST_DATASTORE_SYNC_TIME)
            // console.log('time', time.value)
        } catch (error) {

        }
    }
}