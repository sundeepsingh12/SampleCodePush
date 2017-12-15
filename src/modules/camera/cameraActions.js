'use strict'
import {
    NEXT_FOCUS,
    VIEW_IMAGE_DATA
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { getNextFocusableAndEditableElements, updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import {

} from '../../lib/AttributeConstants'
import { setState } from '../global/globalActions';

export function saveImage(result, fieldAttributeMasterId, formElement, isSaveDisabled) {
    return async function (dispatch) {
        const value = await signatureService.saveFile(result, moment(), true)
        dispatch(getNextFocusableAndEditableElements(fieldAttributeMasterId, formElement, isSaveDisabled, value, NEXT_FOCUS))
    }
}
export function getImageData(value) {
    return async function (dispatch) {
        const result = await signatureService.getImageData(value)
        dispatch(setState(VIEW_IMAGE_DATA, result))
    }
}