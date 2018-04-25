'use strict'
import {
    NEXT_FOCUS,
    SET_IMAGE_DATA,
    VIEW_IMAGE_DATA,
    SET_SHOW_IMAGE,
    SET_SHOW_VIEW_IMAGE,
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions';

export function saveImage(result, fieldAttributeMasterId, formLayoutState, calledFromArray, rowId, jobTransaction) {
    return async function (dispatch) {
        try {
            const value = await signatureService.saveFile(result, moment(), true)
            if (calledFromArray) {
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, formLayoutState.isSaveDisabled, value, formLayoutState.formElement, rowId, [], NEXT_FOCUS, 1, null))
            } else {
                dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formLayoutState, value, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction))
            }
            dispatch(setState(SET_SHOW_VIEW_IMAGE, {
                imageData: '',
                showImage: false,
                viewData: ''
            }))
        } catch (error) {
            showToastAndAddUserExceptionLog(301, error.message, 'danger', 1)
        }
    }
}
export function getImageData(value) {
    return async function (dispatch) {
        try {
            const result = await signatureService.getImageData(value)
            dispatch(setState(VIEW_IMAGE_DATA, result))
        } catch (error) {
            showToastAndAddUserExceptionLog(302, error.message, 'danger', 1)
        }
    }
}
export function setInitialState() {
    return async function (dispatch) {
        try {
            dispatch(setState(VIEW_IMAGE_DATA, ''))
        } catch (error) {
            showToastAndAddUserExceptionLog(303, error.message, 'danger', 1)
        }
    }
}
export function setExistingImage(item) {
    return async function (dispatch) {
        try {
            if (!item || !item.value || item.value == '') {
                throw new Error('No image found')
            }
            const result = await signatureService.getImageData(item.value)
            if (result) {
                dispatch(setState(SET_IMAGE_DATA, result))
                dispatch(setState(SET_SHOW_IMAGE, true))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(304, error.message, 'danger', 1)
        }
    }
}