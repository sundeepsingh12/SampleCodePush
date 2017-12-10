'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { setState } from '../global/globalActions'
import {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER,
    SHOW_ERROR_MESSAGE,
    ON_BLUR,
    NEXT_FOCUS,
    SAVE_SUCCESSFUL,
    CLEAR_ATTR_MAP_AND_SET_LOADER
} from '../../lib/constants'
import {
    EXTERNAL_DATA_STORE,
    DATA_STORE
} from '../../lib/AttributeConstants'
import CONFIG from '../../lib/config'
import _ from 'lodash'
import { getNextFocusableAndEditableElements } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'


export function getFieldAttribute(fieldAttributeMasterId, value) {
    return async function (dispatch) {
        dispatch(setState(CLEAR_ATTR_MAP_AND_SET_LOADER, {}))
        const fieldAttributes = await keyValueDBService.getValueFromStore('FIELD_ATTRIBUTE')
        let fieldAttribute = dataStoreService.getFieldAttribute(fieldAttributes.value, fieldAttributeMasterId)
        dispatch(getDataStoreAttrValueMap(value, fieldAttribute[0].dataStoreMasterId, fieldAttribute[0].dataStoreAttributeId, fieldAttribute[0].externalDataStoreMasterUrl, fieldAttribute[0].key))
    }
}

/**
 * @param {*} validationArray 
 * 
 * This method takes validation array from current element and set all validations accordingly
 */
export function setValidation(validationArray) {
    return async function (dispatch) {
        try {
            if (validationArray) {
                let validation = dataStoreService.getValidations(validationArray)
                dispatch(setState(SET_VALIDATIONS, validation))
            }
        } catch (error) {
            console.log(error)
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
            dispatch(setState(SHOW_LOADER, true))
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
export function onSave(fieldAttributeMasterId, formElements, isSaveDisabled, dataStorevalue, calledFromArray, rowId) {
    return async function (dispatch) {
        try {
            if (!calledFromArray)
                dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElements, isSaveDisabled, dataStorevalue, NEXT_FOCUS))
            else
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, isSaveDisabled, dataStorevalue, formElements, rowId))

        } catch (error) {
            console.log(error)
        }
    }
}

/**This is called when save button is clicked 
 * Fills all the corresponding matched key fieldAttributes from dataStoreAttributeMap 
 * 
 * In case of External Data Store and minMaxvalidation{i.e. unique is allowed} 
 * it first check dataStoreValue is present in FieldData or not 
 * than act accordingly by throwing error or saving
 * 
 * @param {*} dataStoreAttributeValueMap 
 * @param {*} fieldAttributeMasterId 
 * @param {*} formElements 
 * @param {*} nextEditable 
 * @param {*} isSaveDisabled 
 * @param {*} dataStorevalue 
 * @param {*} isMinMaxValidation 
 * @param {*} attributeTypeId 
 */
export function fillKeysAndSave(dataStoreAttributeValueMap, fieldAttributeMasterId, formElements, isSaveDisabled, dataStorevalue, isMinMaxValidation, attributeTypeId, calledFromArray, rowId) {
    return async function (dispatch) {
        try {
            let formElementResult = {}
            let formElement
            if (calledFromArray) formElement = _.cloneDeep(formElements[rowId].formLayoutObject)
            if (attributeTypeId == EXTERNAL_DATA_STORE && isMinMaxValidation) {
                if (!await dataStoreService.dataStoreValuePresentInFieldData(dataStorevalue, fieldAttributeMasterId)) {
                    formElementResult = (!calledFromArray) ? dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formElements) : dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formElement)
                } else {
                    throw new Error('This value is already added')
                }
            }
            if (attributeTypeId == DATA_STORE) {
                formElementResult = (!calledFromArray) ? dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formElements) : dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formElement)
            }
            dispatch(setState(SAVE_SUCCESSFUL, true))
            if (!calledFromArray)
                dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElementResult, isSaveDisabled, dataStorevalue, NEXT_FOCUS))
            else {
                formElements[rowId].formLayoutObject = formElementResult
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, isSaveDisabled, dataStorevalue, formElements, rowId))
            }
        } catch (error) {
            dispatch(setState(SHOW_ERROR_MESSAGE, {
                errorMessage: error.message,
                dataStoreAttrValueMap: {},
            }))
        }
    }
}