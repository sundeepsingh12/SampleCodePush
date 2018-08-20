'use strict'

import { setState, showToastAndAddUserExceptionLog } from "../global/globalActions";
import { SET_QC_LOADING, SET_QC_INITIAL_PARAMETERS, SET_QC_ARRAY, SET_QC_REASON_LOADING, SET_QC_REASON, SET_QC_PASS_FAIl, SET_QC_IMAGE_REMARKS_LOADING, SET_QC_IMAGE, SET_QC_IMAGE_REMARKS_DATA, FormLayout, NEXT_FOCUS, UPDATE_FIELD_DATA_WITH_CHILD_DATA } from '../../lib/constants';
import { qcService } from '../../services/classes/QC'
import { navDispatch } from '../navigators/NavigationService';
import { StackActions } from 'react-navigation'
import { PASS, FAIL, OK } from '../../lib/ContainerConstants'
import { navigate } from '../navigators/NavigationService';
import { Toast } from 'native-base';
import { formLayoutEventsInterface } from '../../services/classes/formLayout/FormLayoutEventInterface';

/**
 * This action prepares qc data either from job data to display 
 * @param {*} initialParameters 
 * initialParameters : {
 *                          currentElement,
 *                          formLayoutState,
 *                          jobTransaction
 *                     }
 */
export function getQcData(initialParameters) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_QC_LOADING, { qcLoading: true }));
            let qcData = qcService.prepareQCAttributeAndData(initialParameters);
            dispatch(setState(SET_QC_INITIAL_PARAMETERS, { qcAttributeMaster: qcData.qcAttributeMasterArray, qcDataArray: qcData.qcObject.qcDataArray, qcImageURLDataArray: qcData.qcObject.qcImageUrlDataArray }));
        } catch (error) {
            dispatch(setState(SET_QC_LOADING, { qcLoading: false }));
            showToastAndAddUserExceptionLog(3101, error.message, 'danger', 1);
        }
    }
}

/**
 * This action toggles the qc result of an item corresponding to object id
 * @param {*} objectId 
 * @param {*} value 
 * @param {*} qcDataArray 
 */
export function changeQCResult(objectId, value, qcDataArray) {
    return async function (dispatch) {
        try {
            let qcCloneDataArray = JSON.parse(JSON.stringify(qcDataArray));
            let qcObject = qcCloneDataArray.filter(object => object.objectId == objectId)[0];
            qcObject.qcResult = value;
            dispatch(setState(SET_QC_ARRAY, { qcDataArray: qcCloneDataArray }));
        } catch (error) {
            showToastAndAddUserExceptionLog(3102, error.message, 'danger', 1);
        }
    }
}

/**
 * This action save qc data(checklist) and navigate to screen depending on qc validation
 * @param {*} isQCPass 
 * @param {*} stateParameters 
 * {
 *      qcDataArray,
 *      qcAttributeMaster
 * }
 * @param {*} propsParameters 
 * {
 *      formLayoutState,
 *      jobTransaction
 * }
 */
export function saveQCDataAndNavigate(isQCPass, stateParameters, propsParameters) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_QC_LOADING, { qcLoading: true }));
            let navigationObject = qcService.saveQCDataAndNavigate(isQCPass, stateParameters, propsParameters);
            dispatch(setState(SET_QC_PASS_FAIl, { qcPassFailResult: isQCPass }));
            if (navigationObject.screenNameToBeNavigated && navigationObject.screenNameToBeNavigated == FormLayout) {
                dispatch(saveQCAndNavigateToFormLayout(navigationObject.formLayoutState, stateParameters.qcAttributeMaster, propsParameters.jobTransaction));
                return;
            } else if (navigationObject.screenNameToBeNavigated) {
                navigate(navigationObject.screenNameToBeNavigated, {
                    qcAttributeMaster: stateParameters.qcAttributeMaster,
                    qcDataArray: stateParameters.qcDataArray,
                    jobTransaction: propsParameters.jobTransaction,
                    formLayoutState: navigationObject.formLayoutState
                })
            } else if (navigationObject.formLayoutState.formElement[stateParameters.qcAttributeMaster.fieldAttributeMasterId].alertMessage) {
                Toast.show({ text: navigationObject.formLayoutState.formElement[stateParameters.qcAttributeMaster.fieldAttributeMasterId].alertMessage, buttonText: OK, duration: 10000 })
            }
        } catch (error) {
            dispatch(setState(SET_QC_LOADING, { qcLoading: false }));
            showToastAndAddUserExceptionLog(3103, error.message, 'danger', 1);
        }
    }
}

/**
 * This action prepares qc reason data from job data to display
 * @param {*} qcDataArray 
 * @param {*} qcAttributeMaster 
 * @param {*} jobTransaction 
 * @param {*} formElement 
 */
export function getQCReasonData(qcDataArray, qcAttributeMaster, jobTransaction, formLayoutState) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_QC_REASON_LOADING, { qcReasonLoading: true }));
            let qcReasonData = qcService.getQCReasons(qcDataArray, qcAttributeMaster, jobTransaction, formLayoutState);
            dispatch(setState(SET_QC_REASON, { qcReasonData: qcReasonData ? qcReasonData : null }));
        } catch (error) {
            dispatch(setState(SET_QC_REASON_LOADING, { qcReasonLoading: false }));
            showToastAndAddUserExceptionLog(3104, error.message, 'danger', 1);
        }
    }
}

/**
 * This action toggles qc reason result
 * @param {*} qcReasonObjectId 
 * @param {*} qcReasonData 
 */
export function changeQCReasonResult(qcReasonObjectId, qcReasonData) {
    return async function (dispatch) {
        try {
            let cloneQCReasonData = JSON.parse(JSON.stringify(qcReasonData));
            cloneQCReasonData[qcReasonObjectId].qcResult = cloneQCReasonData[qcReasonObjectId].qcResult ? false : true;
            dispatch(setState(SET_QC_REASON, { qcReasonData: cloneQCReasonData }));
        } catch (error) {
            showToastAndAddUserExceptionLog(3105, error.message, 'danger', 1);
        }
    }
}

export function saveQCReasonAndNavigate(qcReasonData, qcAttributeMaster, jobTransaction, formLayoutState, qcDataArray) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_QC_REASON_LOADING, { qcReasonLoading: true }));
            let navigationObject = qcService.saveQCReasonAndNavigate(qcReasonData, qcAttributeMaster, jobTransaction, formLayoutState);
            dispatch(setState(SET_QC_REASON_LOADING, { qcReasonLoading: false }));
            if (navigationObject.screenNameToBeNavigated && navigationObject.screenNameToBeNavigated == FormLayout) {
                dispatch(saveQCAndNavigateToFormLayout(navigationObject.formLayoutState, stateParameters.qcAttributeMaster, propsParameters.jobTransaction));
                return;
            } else if (navigationObject.screenNameToBeNavigated) {
                navigate(navigationObject.screenNameToBeNavigated, {
                    qcAttributeMaster,
                    qcDataArray,
                    jobTransaction,
                    formLayoutState: navigationObject.formLayoutState,
                    qcReasonData
                })
            } else if (navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.optionCheckboxArray.fieldAttributeMasterId].alertMessage) {
                Toast.show({ text: navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.optionCheckboxArray.fieldAttributeMasterId].alertMessage, buttonText: OK, duration: 10000 })
            }
        } catch (error) {
            dispatch(setState(SET_QC_REASON_LOADING, { qcReasonLoading: false }));
            showToastAndAddUserExceptionLog(3106, error.message, 'danger', 1);
        }
    }
}

export function getQCImageAndRemarksData(qcAttributeMaster, formLayoutState, jobTransaction, qcImageAndRemarkPresentObject) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_QC_IMAGE_REMARKS_LOADING, { qcImageAndRemarksLoading: true }));
            let imageAndRemarksObject = qcService.getQCImageAndRemarksData(qcAttributeMaster, formLayoutState, jobTransaction, qcImageAndRemarkPresentObject);
            dispatch(setState(SET_QC_IMAGE_REMARKS_DATA, { qcImageData: imageAndRemarksObject.imageData, qcRemarksData: imageAndRemarksObject.remarksData }));
        } catch (error) {
            dispatch(setState(SET_QC_IMAGE_REMARKS_LOADING, { qcImageAndRemarksLoading: false }));
            showToastAndAddUserExceptionLog(3107, error.message, 'danger', 1);
        }
    }
}

export function saveQCImageData(fieldAttributeMaster, value) {
    return async function (dispatch) {
        try {
            let clonefieldAttributeMaster = { ...fieldAttributeMaster };
            clonefieldAttributeMaster.value = value ? value : clonefieldAttributeMaster.value;
            navDispatch(StackActions.pop());
            dispatch(setState(SET_QC_IMAGE, { qcImageData: clonefieldAttributeMaster }));
        } catch (error) {
            console.log('error', error);
        }
    }
}

export function saveImageRemarksAndNavigate(qcImageRemarksObject, qcAttributeMaster, formLayoutState, jobTransaction) {
    return async function (dispatch) {
        try {
            dispatch(setState(SET_QC_IMAGE_REMARKS_LOADING, { qcImageAndRemarksLoading: true }));
            let navigationObject = qcService.saveOCImageRemarksAndNavigate(qcImageRemarksObject, qcAttributeMaster, formLayoutState, jobTransaction);
            if (navigationObject.screenNameToBeNavigated && navigationObject.screenNameToBeNavigated == FormLayout) {
                dispatch(saveQCAndNavigateToFormLayout(navigationObject.formLayoutState, stateParameters.qcAttributeMaster, propsParameters.jobTransaction));
                return;
            } else if (navigationObject.screenNameToBeNavigated) {
                navigate(navigationObject.screenNameToBeNavigated, {
                    qcAttributeMaster,
                    jobTransaction,
                    formLayoutState: navigationObject.formLayoutState,
                })
            } else if (navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId] && navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId].alertMessage) {
                Toast.show({ text: navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.qcImage.fieldAttributeMasterId].alertMessage, buttonText: OK, duration: 10000 })
            } else if (navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId] && navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId].alertMessage) {
                Toast.show({ text: navigationObject.formLayoutState.formElement[qcAttributeMaster.childList.qcRemark.fieldAttributeMasterId].alertMessage, buttonText: OK, duration: 10000 })
            }
            dispatch(setState(SET_QC_IMAGE_REMARKS_LOADING, { qcImageAndRemarksLoading: false }));
        } catch (error) {
            console.log(error)
            dispatch(setState(SET_QC_IMAGE_REMARKS_LOADING, { qcImageAndRemarksLoading: false }));
        }
    }
}

export function saveQCAndNavigateToFormLayout(formLayoutState, qcAttributeMaster, jobTransaction) {
    return async function (dispatch) {
        try {
            let cloneFormLayoutState = JSON.parse(JSON.stringify(formLayoutState));
            const updatedFieldDataObject = formLayoutEventsInterface.findNextFocusableAndEditableElement(qcAttributeMaster.fieldAttributeMasterId, cloneFormLayoutState.formElement, cloneFormLayoutState.isSaveDisabled, cloneFormLayoutState.formElement[qcAttributeMaster.fieldAttributeMasterId].value, null, NEXT_FOCUS, jobTransaction, cloneFormLayoutState.fieldAttributeMasterParentIdMap, cloneFormLayoutState.jobAndFieldAttributesList, cloneFormLayoutState.sequenceWiseFieldAttributeMasterIds);
            dispatch(setState(UPDATE_FIELD_DATA_WITH_CHILD_DATA, {
                formElement: updatedFieldDataObject.formLayoutObject,
                latestPositionId: cloneFormLayoutState.latestPositionId,
                isSaveDisabled: updatedFieldDataObject.isSaveDisabled,
            }));
            navigate(FormLayout);
        } catch (error) {
            console.log(error);
        }
    }
}

