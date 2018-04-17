'use strict'
import {
    NEXT_FOCUS,
    SET_IMAGE_DATA,
    VIEW_IMAGE_DATA,
    SET_SHOW_IMAGE,
    SET_SHOW_VIEW_IMAGE,
    SET_VALIDATION_FOR_CAMERA
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { getNextFocusableAndEditableElements, updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions';

export function saveImage(result, fieldAttributeMasterId, formElement, isSaveDisabled, calledFromArray, rowId, latestPositionId, jobTransaction) {
    return async function (dispatch) {
        try {
            const value = await signatureService.saveFile(result, moment(), true)
            if (calledFromArray) {
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, isSaveDisabled, value, formElement, rowId, [], NEXT_FOCUS, 1, null))
            } else {
                dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formElement, isSaveDisabled, value, { latestPositionId }, jobTransaction))
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

export function getValidation(value) {
    return async function (dispatch) {
        try {
            const result = await signatureService.getValidations(value)
            dispatch(setState(SET_VALIDATION_FOR_CAMERA, result))
        } catch (error) {
            showToastAndAddUserExceptionLog(-302, error.message, 'danger', 1)
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
            if (item.value && item.value != '') {
                const result = await signatureService.getImageData(item.value)
                dispatch(setState(SET_IMAGE_DATA, result))
                if (result) {
                    dispatch(setState(SET_SHOW_IMAGE, true))
                }
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(304, error.message, 'danger', 1)
        }
    }
}