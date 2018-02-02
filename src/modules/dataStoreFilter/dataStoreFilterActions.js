'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreFilterService } from '../../services/classes/DataStoreFilterService'
import { setState } from '../global/globalActions'
import {
    SHOW_LOADER_DSF,
    DATA_STORE_FILTER_LIST,
    SEARCHED_DATA_STORE_FILTER_LIST,
    SET_DSF_REVERSE_MAP,
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import _ from 'lodash'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'


/**
 * 
 * @param {*} currentElement 
 * @param {*} formElement 
 * @param {*} jobTransaction 
 * @param {*} dataStoreFilterReverseMap 
 * this action sets dataStoreFilterResponse and dataStoreFilterReverseMap by fetching data from server
 */
export function getDSFListContent(currentElement, formElement, jobTransaction, dataStoreFilterReverseMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER_DSF, true))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let returnParams = await dataStoreFilterService.fetchDataForFilter(token, currentElement, false, formElement, jobTransaction, dataStoreFilterReverseMap)
            dispatch(setState(DATA_STORE_FILTER_LIST, returnParams.dataStoreFilterResponse))
            dispatch(setState(SET_DSF_REVERSE_MAP, returnParams.dataStoreFilterReverseMap))
        } catch (error) {
           
        }
    }
}

/**
 * 
 * @param {*} dataStoreFilterList 
 * @param {*} cloneDataStoreFilterList 
 * @param {*} searchText 
 * this action filters dataStoreFilterList using searchText
 */
export function getFilteredResults(dataStoreFilterList, cloneDataStoreFilterList, searchText) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER_DSF, true))
            let searchResult = await dataStoreFilterService.searchDSFList(dataStoreFilterList, cloneDataStoreFilterList, searchText)
            dispatch(setState(SEARCHED_DATA_STORE_FILTER_LIST, {
                dataStoreFilterList: searchResult.dataStoreFilterList,
                cloneDataStoreFilterList: searchResult.cloneDataStoreFilterList
            }))
        } catch (error) {
           
        }
    }
}


export function onSave(fieldAttributeMasterId, formElement, isSaveDisabled, dataStoreFiltervalue, latestPositionId, jobTransaction, dataStoreFilterReverseMap) {
    return async function (dispatch) {
        try {
            formElement = await dataStoreFilterService.clearMappedDSFValue(fieldAttributeMasterId, dataStoreFilterReverseMap, _.cloneDeep(formElement))
            dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formElement, isSaveDisabled, dataStoreFiltervalue, { latestPositionId }, jobTransaction))
        } catch (error) {
            
        }
    }
}

