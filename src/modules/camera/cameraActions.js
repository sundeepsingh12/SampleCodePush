'use strict'
import { NEXT_FOCUS, VIEW_IMAGE_DATA, SET_CAMERA_LOADER, SET_SHOW_IMAGE_AND_DATA, SET_SHOW_IMAGE_AND_VALIDATION, SET_CAMERA_LOADER_INITIAL_SET_UP } from '../../lib/constants'
import { signatureService } from '../../services/classes/SignatureRemarks'
import moment from 'moment'
import { updateFieldDataWithChildData } from '../form-layout/formLayoutActions'
import { getNextFocusableAndEditableElement } from '../array/arrayActions'
import { setState, showToastAndAddUserExceptionLog } from '../global/globalActions';
import CompressImage from 'react-native-compress-image';
import { ImageStore, Platform } from 'react-native';
import { PATH_CUSTOMER_IMAGES } from '../../lib/AttributeConstants'
import { OPEN_CAMERA } from '../../lib/ContainerConstants'
import RNFS from 'react-native-fs'
import ImageCropPicker from 'react-native-image-crop-picker';
import isEmpty from 'lodash/isEmpty'

var PATH_COMPRESS_IMAGE = '/compressImages';

export function saveImage(result, fieldAttributeMasterId, formLayoutState, calledFromArray, rowId, jobTransaction) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_CAMERA_LOADER, true))
            if (Platform.OS == 'android') {
                CompressImage.createCompressedImage(result.uri, PATH_COMPRESS_IMAGE).then((resizedImage) => {
                    ImageStore.getBase64ForTag(resizedImage.uri, (base64Data) => {
                        dispatch(saveImageInFormLayout(base64Data, fieldAttributeMasterId, formLayoutState, calledFromArray, rowId, jobTransaction))
                        RNFS.unlink(resizedImage.path)
                    }, (reason) => {
                        dispatch(setState(SET_CAMERA_LOADER, false))
                        showToastAndAddUserExceptionLog(310, reason.message, 'danger', 1)
                    })
                }, (error) => {
                    dispatch(setState(SET_CAMERA_LOADER, false))
                    showToastAndAddUserExceptionLog(311, error.message, 'danger', 1)
                });
            } else {
                const iosImageData = (result.base64) ? result.base64 : (result.data) ? result.data :  result.uri
                dispatch(saveImageInFormLayout(iosImageData, fieldAttributeMasterId, formLayoutState, calledFromArray, rowId, jobTransaction))
            }
        } catch (error) {
            dispatch(setState(SET_CAMERA_LOADER, false))
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

// export function takePicture(ref) {
//     return async function (dispatch) {
//         // try {
//         //     let options = { quality: 0.2, base64: true, fixOrientation: true };
//         //     if (Platform.OS === "ios") {
//         //         options.orientation = 'portrait'
//         //     }
//         //     ref.takePictureAsync(options).then((capturedImg) => {
//         //         const { uri, base64 } = capturedImg;
//         //     })
//         //     dispatch(setState(SET_SHOW_IMAGE_AND_DATA, { data: base64, uri }))

//         // } catch (error) {
//         //     dispatch(setState(SET_CAMERA_LOADER, false))
//         //     showToastAndAddUserExceptionLog(316, error.message, 'danger', 1)
//         // }
//         //console.logs('taking picture')
//         dispatch(setState(SET_SHOW_IMAGE_AND_DATA, ref))
//     }
// }

export function saveImageInFormLayout(data, fieldAttributeMasterId, formLayoutState, calledFromArray, rowId, jobTransaction) {
    return async function (dispatch) {
        try {
            const value = await signatureService.saveFile(data, moment(), true)
            if (calledFromArray) {
                dispatch(getNextFocusableAndEditableElement(fieldAttributeMasterId, formLayoutState.isSaveDisabled, value, formLayoutState.formElement, rowId, [], NEXT_FOCUS, 1, null, formLayoutState))
            } else {
                dispatch(updateFieldDataWithChildData(fieldAttributeMasterId, formLayoutState, value, { latestPositionId: formLayoutState.latestPositionId }, jobTransaction))
            }
        } catch (error) {
            showToastAndAddUserExceptionLog(312, error.message, 'danger', 1)
        }
    }
}

export function setCameraInitialView(item) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_CAMERA_LOADER_INITIAL_SET_UP))
            let validation = null, data = null
            if (!isEmpty(item.validation)) {
                validation = await signatureService.getValidations(item.validation, item.attributeTypeId)
            }
            if (item.value && item.value != '' && item.value != OPEN_CAMERA) {
                const base64Data = await signatureService.getImageData(item.value)
                let imageName = item.value.split('/')
                data = (base64Data) ? { data: base64Data, uri: 'file://' + PATH_CUSTOMER_IMAGES + imageName[imageName.length - 1] } : null
            }
            dispatch(setState(SET_SHOW_IMAGE_AND_VALIDATION, { data, validation }))
        } catch (error) {
            dispatch(setState(SET_CAMERA_LOADER, false))
            showToastAndAddUserExceptionLog(305, error.message, 'danger', 1)
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

export function cropImage(path, setImage) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_CAMERA_LOADER, true))
            ImageCropPicker.openCropper({
                path,
                width: 300,
                height: 300,
                freeStyleCropEnabled: true,
                includeBase64:(Platform.OS==='android')?false:true

            }).then((image) => {
                if (image) {
                    (Platform.OS==='android')?setImage(image.path):setImage(image.path,image.data)
                    dispatch(setState(SET_CAMERA_LOADER, false))
                }
            }).catch(e => {
                dispatch(setState(SET_CAMERA_LOADER, false))
            });
        } catch (error) {
            dispatch(setState(SET_CAMERA_LOADER, false))
            showToastAndAddUserExceptionLog(313, error.message, 'danger', 1)
        }
    }
}