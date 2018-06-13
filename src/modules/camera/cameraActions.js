'use strict'
import {
    NEXT_FOCUS,
    VIEW_IMAGE_DATA,
    SET_VALIDATION_FOR_CAMERA,
    SET_CAMERA_LOADER,
    SET_SHOW_IMAGE_AND_DATA,
    SET_SHOW_IMAGE_AND_VALIDATION,
    SET_CAMERA_LOADER_INITIAL_SET_UP,
} from '../../lib/constants'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions';
import CompressImage from 'react-native-compress-image';
import CONFIG from '../../lib/config'

import {
    ImageStore,
} from 'react-native';

import { PATH_CUSTOMER_IMAGES} from '../../lib/AttributeConstants'
import {OPEN_CAMERA} from '../../lib/ContainerConstants'
import RNFS from 'react-native-fs'
var PATH_COMPRESS_IMAGE = '/compressImages';

export function saveImage(result, fieldAttributeMasterId, formLayoutState, calledFromArray, rowId, jobTransaction,goBack) {
    return async function (dispatch) {
        try {
            const value = await signatureService.saveFile(result, moment(), true)
            if (calledFromArray) {
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, formLayoutState.isSaveDisabled, value, formLayoutState.formElement, rowId, [], NEXT_FOCUS, 1, null, formLayoutState,goBack))
            } else {
                dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formLayoutState, value, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction,null,null,goBack))
            }
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

export function setCameraInitialView(item) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_CAMERA_LOADER_INITIAL_SET_UP))
            const validation = null, data = null
            if (!_.isEmpty(item.validation)) {
                 validation = await signatureService.getValidations(item.validation)
            }
            if (item.value && item.value != '' && item.value != OPEN_CAMERA) {
                const base64Data = await signatureService.getImageData(item.value)
                let imageName = item.value.split('/')
                data = (base64Data) ? {data: base64Data, uri: 'file://' + PATH_CUSTOMER_IMAGES + imageName[imageName.length - 1]} : null
            }
            dispatch(setState(SET_SHOW_IMAGE_AND_VALIDATION,{data, validation}))
        } catch (error) {
            showToastAndAddUserExceptionLog(305, error.message, 'danger', 1)
        }
    }
}

export function compressImages(uri) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_CAMERA_LOADER, true))
            CompressImage.createCompressedImage(uri, PATH_COMPRESS_IMAGE).then((resizedImage) => {
                ImageStore.getBase64ForTag(resizedImage.uri, (base64Data) => { 
                    dispatch(setState(SET_SHOW_IMAGE_AND_DATA, {data: base64Data, uri : resizedImage.uri}))
                }, (reason) => {
                    dispatch(setState(SET_CAMERA_LOADER, false))
                    showToastAndAddUserExceptionLog(306, reason.message, 'danger', 1)
                });
            }, (error) => {
                dispatch(setState(SET_CAMERA_LOADER, false))
                showToastAndAddUserExceptionLog(307, error.message, 'danger', 1)
            });
        } catch (error) {
            dispatch(setState(SET_CAMERA_LOADER, false))
            showToastAndAddUserExceptionLog(308, error.message, 'danger', 1)
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