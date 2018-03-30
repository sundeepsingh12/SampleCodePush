'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreFilterService } from '../../services/classes/DataStoreFilterService'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import {
    SHOW_LOADER_DSF,
    DATA_STORE_FILTER_LIST,
    SEARCHED_DATA_STORE_FILTER_LIST,
    SET_DSF_REVERSE_MAP,
    SET_ARRAY_DATA_STORE_FILTER_MAP,
    NEXT_FOCUS,
} from '../../lib/constants'
import CONFIG from '../../lib/config'
import _ from 'lodash'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'


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
            dispatch(showToastAndAddUserExceptionLog(801, error.message, 'danger', 1))
            dispatch(setState(SHOW_LOADER_DSF, false))
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
            dispatch(showToastAndAddUserExceptionLog(802, error.message, 'danger', 1))
            dispatch(setState(SHOW_LOADER_DSF, false))
        }
    }
}


export function onSave(fieldAttributeMasterId, formElement, isSaveDisabled, dataStoreFiltervalue, latestPositionId, jobTransaction, dataStoreFilterReverseMap, fieldAttributeMasterParentIdMap, calledFromArray, rowId, arrayReverseDataStoreFilterMap, arrayFieldAttributeMasterId) {
    return async function (dispatch) {
        try {
            // In case DSF is present in Array field attribute
            if (calledFromArray) {
                let rowFormElement = formElement[rowId].formLayoutObject // get current formElement from rowId
                let dataStoreFilterReverseMap = arrayReverseDataStoreFilterMap[arrayFieldAttributeMasterId] // get DSF reverse Map in case of array used for back tracking, if it is edited
                let singleFormElement = await dataStoreFilterService.clearMappedDSFValue(fieldAttributeMasterId, dataStoreFilterReverseMap, _.cloneDeep(rowFormElement))
                formElement[rowId].formLayoutObject = singleFormElement
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, isSaveDisabled, dataStoreFiltervalue, formElement, rowId, null, NEXT_FOCUS, 2, null, fieldAttributeMasterParentIdMap)) // call save method of array actions and pass NEXT_FOCUS as event
            } else {
                formElement = await dataStoreFilterService.clearMappedDSFValue(fieldAttributeMasterId, dataStoreFilterReverseMap, _.cloneDeep(formElement))
                dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formElement, isSaveDisabled, dataStoreFiltervalue, { latestPositionId }, jobTransaction, fieldAttributeMasterParentIdMap, true))
            }
        } catch (error) {

        }
    }
}

 /**
  * In case of dsf in array this action is called and set dsf data which is fetched by hitting an API
  * @param {Object} functionParamsFromDSF {
                                currentElement 
                                formElement 
                                jobTransaction 
                                arrayReverseDataStoreFilterMap 
                                rowId 
                                arrayFieldAttributeMasterId        
                             }
  */
export function getDSFListContentForArray(functionParamsFromDSF) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER_DSF, true))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const returnParams = await dataStoreFilterService.fetchDataForFilterInArray(token, functionParamsFromDSF) // get data for DSF and map of fieldAttributeId's
            dispatch(setState(DATA_STORE_FILTER_LIST, returnParams.dataStoreFilterResponse))
            dispatch(setState(SET_ARRAY_DATA_STORE_FILTER_MAP, returnParams.arrayReverseDataStoreFilterMap)) // set formLayout state of arrayReverseDataStoreFilterMap which is avilable globally
        } catch (error) {
            dispatch(showToastAndAddUserExceptionLog(803, error.message, 'danger', 1))
        }
    }
}

