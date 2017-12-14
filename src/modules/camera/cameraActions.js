'use strict'
import {
    NEXT_FOCUS
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { getNextFocusableAndEditableElements, updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import {

} from '../../lib/AttributeConstants'

export function saveImage(result, fieldAttributeMasterId, formElement, isSaveDisabled) {
    return async function (dispatch) {
        const value = await signatureService.saveFile(result, moment(), true)
        dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, isSaveDisabled, value, NEXT_FOCUS))
    }
}