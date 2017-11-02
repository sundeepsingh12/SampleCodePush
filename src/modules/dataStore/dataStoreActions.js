'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { setState } from '../global/globalActions'
const {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER,
    SHOW_ERROR_MESSAGE,
    ON_BLUR
} = require('../../lib/constants').default
import CONFIG from '../../lib/config'
import _ from 'underscore'
import { getNextFocusableAndEditableElements } from '../form-layout/formLayoutActions'

export function setValidation(validationArray) {
    return async function (dispatch) {
        try {
            let validation = dataStoreService.getValidations(validationArray)
            dispatch(setState(SET_VALIDATIONS, validation))
        } catch (error) {
            console.log(error)
        }
    }
}

export function getDataStoreAttrValueMap(searchText, dataStoreMasterId, dataStoreMasterAttributeId) {
    return async function (dispatch) {
        try {
            dispatch(setState(SHOW_LOADER, true))
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const dataStoreResponse = await dataStoreService.fetchJson(token, searchText, dataStoreMasterId, dataStoreMasterAttributeId)
            const dataStorejsonResponse = await dataStoreResponse.json
            const dataStoreAttrValueMap = await dataStoreService.getDataStoreAttrValueMapFromJson(dataStorejsonResponse)
            if (_.isEmpty(dataStoreAttrValueMap)) {
                dispatch(setState(SHOW_ERROR_MESSAGE, {
                    errorMessage: 'No records found for search value: ',
                    dataStoreAttrValueMap: {},
                }))
            } else {
                dispatch(setState(SET_DATA_STORE_ATTR_MAP, dataStoreAttrValueMap))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export function onSave(fieldAttributeMasterId, formElements, nextEditable, isSaveDisabled, dataStorevalue) {
    return async function (dispatch) {
        try {
            dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElements, nextEditable, isSaveDisabled, dataStorevalue, ON_BLUR))
        } catch (error) {
            console.log(error)
        }
    }
}

export function fillKeysAndSave(dataStoreAttributeValueMap, fieldAttributeMasterId, formElements, nextEditable, isSaveDisabled, dataStorevalue) {
    return async function (dispatch) {
        let formElementResult = dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formElements)
        dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElementResult, nextEditable, isSaveDisabled, dataStorevalue, ON_BLUR))
    }
}