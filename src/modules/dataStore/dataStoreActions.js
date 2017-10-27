'use strict'

import { fixedSKUDetailsService } from '../../services/classes/FixedSKUListing'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { dataStoreService } from '../../services/classes/DataStoreService'
import { setState } from '../global/globalActions'
const {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
} = require('../../lib/constants').default
import {
    ARRAY_SAROJ_FAREYE
} from '../../lib/AttributeConstants'

import CONFIG from '../../lib/config'
export function setValidation(validationArray) {
    return async function (dispatch) {
        try {
            if (typeof validationArray !== undefined && validationArray) {
                let validation = await dataStoreService.getValidationsArray(validationArray)
                dispatch(setState(SET_VALIDATIONS, validation))
            }
        } catch (error) {
            console.log(error)
        }
    }
}
export function getDataStoreAttrValueMap(searchText, dataStoreMasterId, dataStoreMasterAttributeId) {
    return async function (dispatch) {
        try {
            const token = await keyValueDBService.getValueFromStore(CONFIG.SESSION_TOKEN_KEY)
            const dataStoreResponse = await dataStoreService.fetchJson(token, searchText, dataStoreMasterId, dataStoreMasterAttributeId)
            const dataStoreAttrValueMap = await dataStoreService.getDataStoreAttrValueMapFromJson(dataStoreResponse)
            if (dataStoreAttrValueMap) {
                dispatch(setState(SET_DATA_STORE_ATTR_MAP,dataStoreAttrValueMap))
            }
        } catch (error) {
            console.log(error)
        }
    }
}