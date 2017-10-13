'use strict'
const {
    SET_FIELD_DATA_LIST,
    SAVE_SIGNATURE,
} = require('../../lib/constants').default

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'

export function setFieldDataList(fieldDataList) {
    return {
        type: SET_FIELD_DATA_LIST,
        payload: fieldDataList
    }
}

export function saveSignature(result) {
  //  console.log('in onsave' + result.encoded)
    return async function (dispatch) {
        await signatureService.saveFile(result);
    }
}

export function getRemarksValidationList(fieldAttributeMasterId, fieldDataList) {
    return async function (dispatch) {
        try {
            // dispatch(setFieldDataList(signatureService.getRemarksList(fieldDataList.get(fieldAttributeMasterId))))
            dispatch(setFieldDataList(fieldDataList.get(6)))
        } catch (error) {
            console.log(error)
        }
    }
}
