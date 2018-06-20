'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions'
import {
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER_DS,
    SHOW_ERROR_MESSAGE,
    SHOW_DETAILS,
    NEXT_FOCUS,
    CLEAR_ATTR_MAP_AND_SET_LOADER,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE,
    SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP,
    SET_DSF_REVERSE_MAP,
    SEARCH_DATA_STORE_RESULT,
    SET_ARRAY_DATA_STORE_FILTER_MAP,

} from '../../lib/constants'
import {
    DATA_STORE,
} from '../../lib/AttributeConstants'
import CONFIG from '../../lib/config'
import _ from 'lodash'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'


/**
 * 
 * @param {*} fieldAttributeMasterId 
 * @param {*} value 
 * this method is used for getting data store result list from searched value when field detail item is clicked
 */
export function getFieldAttribute(fieldAttributeMasterId, value) {
    return async function (dispatch) {
        try {
            dispatch(setState(CLEAR_ATTR_MAP_AND_SET_LOADER, {}))
            const fieldAttributes = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            let fieldAttribute = dataStoreService.getFieldAttribute(fieldAttributes.value, fieldAttributeMasterId)
            dispatch(getDataStoreAttrValueMap(value, fieldAttribute[0].dataStoreMasterId, fieldAttribute[0].dataStoreAttributeId, fieldAttribute[0].externalDataStoreMasterUrl, fieldAttribute[0].key))
        } catch (error) {
            showToastAndAddUserExceptionLog(701, error.message, 'danger', 0)
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
        }
    }
}

/**
 * 
 * @param {*} jobAttributeMasterId 
 * @param {*} value 
 * this method is used for getting data store result list from searched value when job detail item is clicked 
 */
export function getJobAttribute(jobAttributeMasterId, value) {
    return async function (dispatch) {
        try {
            dispatch(setState(CLEAR_ATTR_MAP_AND_SET_LOADER, {}))
            const jobAttributes = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
            let jobAttribute = dataStoreService.getJobAttribute(jobAttributes.value, jobAttributeMasterId)
            dispatch(getDataStoreAttrValueMap(value, jobAttribute[0].dataStoreMasterId, jobAttribute[0].dataStoreAttributeId, null, null))
        } catch (error) {
            showToastAndAddUserExceptionLog(702, error.message, 'danger', 0)
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
        }
    }
}

/**
 * 
 * @param {*} currentElement 
 * @param {*} formElement 
 * @param {*} jobTransaction 
 * @param {*} dataStoreFilterReverseMap 
 * this actions check for filters and validations
 */
export function checkForFiltersAndValidation(currentElement, formLayoutState, jobTransaction, dataStoreFilterReverseMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER_DS, true))
            let cloneFormElement = _.cloneDeep(formLayoutState.formElement)
            let returnParams = await dataStoreService.runDataStoreBeforeValidations(currentElement, formLayoutState, jobTransaction, cloneFormElement, dataStoreFilterReverseMap)
            dispatch(setState(SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP, {
                dataStoreAttrValueMap: returnParams.dataStoreAttrValueMap,
                isFiltersPresent: returnParams.isFiltersPresent,
                validation: returnParams.validationObject,
                searchText: returnParams.searchText,
                isDataStoreEditable: returnParams.isDataStoreEditable
            }))
            if (!returnParams.isFiltersPresent && !_.isEmpty(returnParams.searchText) && returnParams.validationObject.isSearchEnabled) {
                dispatch(checkOfflineDS(returnParams.searchText, currentElement.dataStoreMasterId, currentElement.dataStoreAttributeId, currentElement.externalDataStoreMasterUrl, currentElement.key, currentElement.attributeTypeId))
            }
            dispatch(setState(SET_DSF_REVERSE_MAP, returnParams.dataStoreFilterReverseMap))
        } catch (error) {
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
            showToastAndAddUserExceptionLog(703, error.message, 'danger', 0)
        }
    }
}

/**This action is called when search takes place 
 * change dataStoreAttrValueMap in case of succesful search
 * set error message in case if error is occurred  
 * 
 * @param {*} searchText 
 * @param {*} dataStoreMasterId  // for Data Store
 * @param {*} dataStoreMasterAttributeId // for Data Store
 * @param {*} externalDataStoreUrl // for External Data Store
 * @param {*} attributeKey // for External Data Store
 */
export function getDataStoreAttrValueMap(searchText, dataStoreMasterId, dataStoreMasterAttributeId, externalDataStoreUrl, attributeKey) {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            let dataStoreResponse
            if (externalDataStoreUrl) {
                dataStoreResponse = await dataStoreService.fetchJsonForExternalDS(token, searchText, externalDataStoreUrl, attributeKey)
                // dataStoreResponse = {
                //     status: 200,
                //     json: {
                //         items: [{
                //             matchKey: 'name',
                //             uniqueKey: 'contact',
                //             details: {
                //                 dataStoreAttributeValueMap: {
                //                     _id: '_1234',
                //                     name: 'xyz',
                //                     contact: '123456'
                //                 }
                //             }
                //         }, {
                //             matchKey: 'name',
                //             uniqueKey: 'contact',
                //             details: {
                //                 dataStoreAttributeValueMap: {
                //                     _id: '_1234',
                //                     name: 'qwe',
                //                     contact: '234567'
                //                 }
                //             }
                //         }]
                //     }
                // }
            } else {
                dataStoreResponse = await dataStoreService.fetchJsonForDS(token, searchText, dataStoreMasterId, dataStoreMasterAttributeId)
            }
            if (dataStoreResponse.status != 200) {
                throw new Error(dataStoreResponse.message)
            }
            const dataStorejsonResponse = await dataStoreResponse.json
            const dataStoreAttrValueMap = await dataStoreService.getDataStoreAttrValueMapFromJson(dataStorejsonResponse)
            if (_.isEmpty(dataStoreAttrValueMap)) {
                throw new Error('No records found for search')
            } else {
                dispatch(setState(SET_DATA_STORE_ATTR_MAP, {
                    dataStoreAttrValueMap,
                    searchText
                }))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(704, error.message, 'danger', 0)
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
        }
    }
}

/**This is called when save button is clicked in case of minMaxValidation (i.e. allow from field is true) for Data Store 
 * 
 * @param {*} fieldAttributeMasterId 
 * @param {*} formElements 
 * @param {*} nextEditable 
 * @param {*} isSaveDisabled 
 * @param {*} dataStorevalue 
 */
export function onSave(fieldAttributeMasterId, formLayoutState, dataStorevalue, calledFromArray, rowId, jobTransaction,goBack) {
    return async function (dispatch) {
        try {
            if (!calledFromArray) {
                dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formLayoutState, dataStorevalue, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction,null,null,goBack))
            } else {
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, formLayoutState.isSaveDisabled, dataStorevalue, formLayoutState.formElement, rowId, null, NEXT_FOCUS, 1, null, formLayoutState,goBack))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(705, error.message, 'danger', 0)
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
        }
    }
}

/**
 * In case of External Data Store and minMaxvalidation{i.e. unique is allowed} 
 * it checks dataStoreValue is present in FieldData or not 
 * than act accordingly by throwing error or show details
 * 
 * @param {*} dataStorevalue 
 * @param {*} fieldAttributeMasterId 
 * @param {*} itemId 
 * 
 */
export function uniqueValidationCheck(dataStorevalue, fieldAttributeMasterId, itemId) {
    return async function (dispatch) {
        try {
            if (!await dataStoreService.checkForUniqueValidation(dataStorevalue, fieldAttributeMasterId)) {
                dispatch(setState(SHOW_DETAILS, itemId))
            } else {
                throw new Error('This value is already added')
            }
        } catch (error) {
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
            showToastAndAddUserExceptionLog(706, error.message, 'danger', 0)
        }
    }
}

/**This is called when save button is clicked 
 * Fills all the corresponding matched key fieldAttributes from dataStoreAttributeMap and update formLayout state
 * 
 * @param {*} dataStoreAttributeValueMap 
 * @param {*} fieldAttributeMasterId 
 * @param {*} formElements  
 * @param {*} isSaveDisabled 
 * @param {*} dataStorevalue 
 */
export function fillKeysAndSave(dataStoreAttributeValueMap, fieldAttributeMasterId, formLayoutState, dataStorevalue, calledFromArray, rowId, jobTransaction,goBack) {
    return async function (dispatch) {
        try {
            if (!calledFromArray) {
                let formElementResult = dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formLayoutState.formElement)
                formLayoutState.formElement = formElementResult
                dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formLayoutState, dataStorevalue, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction,null,null,goBack))
            } else {
                let formElementResult = await dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formLayoutState.formElement[rowId].formLayoutObject)
                formLayoutState.formElement[rowId].formLayoutObject = formElementResult
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, formLayoutState.isSaveDisabled, dataStorevalue, formLayoutState.formElement, rowId, null, NEXT_FOCUS, 1, null, formLayoutState))
            }
        } catch (error) {
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
            showToastAndAddUserExceptionLog(707, error.message, 'danger', 0)
        }
    }
}

/**
 * 
 * @param {*} searchText 
 * @param {*} dataStoreMasterId 
 * @param {*} dataStoreMasterAttributeId 
 * @param {*} externalDataStoreUrl 
 * @param {*} attributeKey 
 * @param {*} attributeTypeId 
 * // this method first checks for offline DS if present then fetch results from that if not present then check for online DS
 */
export function checkOfflineDS(searchText, dataStoreMasterId, dataStoreMasterAttributeId, externalDataStoreUrl, attributeKey, attributeTypeId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER_DS, true))
            if (attributeTypeId == DATA_STORE) {
                let { offlineDSPresent, dataStoreAttrValueMap } = await dataStoreService.checkForOfflineDsResponse(searchText, dataStoreMasterId)
                if (offlineDSPresent) {
                    if (_.isEmpty(dataStoreAttrValueMap)) {
                        throw new Error('No records found for search')
                    } else {
                        dispatch(setState(SET_DATA_STORE_ATTR_MAP, {
                            dataStoreAttrValueMap,
                            searchText
                        }))
                    }
                } else {
                    dispatch(getDataStoreAttrValueMap(searchText, dataStoreMasterId, dataStoreMasterAttributeId, null, null))
                }
            } else {
                dispatch(getDataStoreAttrValueMap(searchText, null, null, externalDataStoreUrl, attributeKey))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(708, error.message, 'danger', 0)
            dispatch(setState(SHOW_ERROR_MESSAGE, { errorMessage: error.message, dataStoreAttrValueMap: {} }))
        }
    }
}

/**
 * 
 * @param {*} searchText 
 * @param {*} dataStoreAttrValueMap 
 * @param {*} cloneDataStoreAttrValueMap 
 * this action filters dataStoreAttrMap and set results
 */
export function searchDataStoreAttributeValueMap(searchText, dataStoreAttrValueMap, cloneDataStoreAttrValueMap) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER_DS, true))
            let searchResult = await dataStoreService.searchDataStoreAttributeValueMap(searchText, dataStoreAttrValueMap, cloneDataStoreAttrValueMap)
            dispatch(setState(SEARCH_DATA_STORE_RESULT, {
                dataStoreAttrValueMap: searchResult.dataStoreAttrValueMap,
                cloneDataStoreAttrValueMap: searchResult.cloneDataStoreAttrValueMap,
                searchText
            }))
        } catch (error) {
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
            showToastAndAddUserExceptionLog(709, error.message, 'danger', 0)
        }
    }
}

/**
 *  In case of data store is in array this action is called it checks for filter is mapped or not if not mapped then get validations to change the view accordingly
 * @param {Object} functionParamsFromDS //{
 *                 currentElement 
                   formElement 
                   jobTransaction 
                   arrayReverseDataStoreFilterMap 
                   arrayFieldAttributeMasterId 
                   rowId 
                 }
 */
export function checkForFiltersAndValidationForArray(functionParamsFromDS) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER_DS, true))
            let returnParams = await dataStoreService.checkForFiltersAndValidationsForArray(functionParamsFromDS)
            dispatch(setState(SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP, {
                dataStoreAttrValueMap: returnParams.dataStoreAttrValueMap,
                isFiltersPresent: returnParams.isFiltersPresent,
                validation: returnParams.validationObject,
                searchText: returnParams.searchText,
                isDataStoreEditable: returnParams.isDataStoreEditable
            }))
            let currentElement=functionParamsFromDS.currentElement
            if (!returnParams.isFiltersPresent && !_.isEmpty(returnParams.searchText) && returnParams.validationObject.isSearchEnabled) {
                dispatch(checkOfflineDS(returnParams.searchText, currentElement.dataStoreMasterId, currentElement.dataStoreAttributeId, currentElement.externalDataStoreMasterUrl, currentElement.key, currentElement.attributeTypeId))
            }
            dispatch(setState(SET_ARRAY_DATA_STORE_FILTER_MAP, returnParams.arrayReverseDataStoreFilterMap))  // set formLayout state of arrayReverseDataStoreFilterMap which is avilable globally
        } catch (error) {
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
            showToastAndAddUserExceptionLog(710, error.message, 'danger', 0)
        }
    }
}