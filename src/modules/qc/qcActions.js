'use strict'

import { setState } from "../global/globalActions";
import { SET_QC_LOADING, SET_QC_INITIAL_PARAMETERS, SET_QC_ARRAY, SET_QC_MODAL_LOADING, SET_QC_MODAL_VIEW_PARAMETERS, SET_QC_MODAL_IMAGE, SET_QC_MODAL_REASON } from '../../lib/constants';
import { qcService } from '../../services/classes/QC'
import { navDispatch } from '../navigators/NavigationService';
import { StackActions } from 'react-navigation'
import { PASS, FAIL } from '../../lib/ContainerConstants'

/**
 * This action prepares qc data either from job data or current element draft to display 
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
            console.log('getQcData intialParameters', initialParameters);
            dispatch(setState(SET_QC_LOADING, { qcLoading: true }));
            let qcChildAttributes = qcService.prepareQCAttributes(initialParameters);
            dispatch(setState(SET_QC_INITIAL_PARAMETERS, { qcAttributeMaster: qcChildAttributes.qcAttributeMasterArray, qcDataArray: qcChildAttributes.qcDataArray }));
        } catch (error) {
        }
    }
}

export function changeQCResult(objectId, value, qcDataArray) {
    return async function (dispatch) {
        try {
            let qcCloneDataArray = _.cloneDeep(qcDataArray);
            let qcObject = qcCloneDataArray.filter(object => object.objectId == objectId)[0];
            qcObject.qcResult = value;
            dispatch(setState(SET_QC_ARRAY, { qcDataArray: qcCloneDataArray }));
        } catch (error) {
        }
    }
}

export function getQCPassFailParamaters(qcDataArray, qcAttributeMaster, qcPassFail, jobTransaction) {
    return async function (dispatch) {
        try {
            console.log('getQCPassFailParamaters qcDataArray', qcDataArray, 'qcAttributeMaster', qcAttributeMaster, 'qcPassFail', qcPassFail, jobTransaction);
            let passFailParameters = qcService.getQCPassFailParameters(qcDataArray, qcAttributeMaster, qcPassFail, jobTransaction);
            dispatch(setState(SET_QC_MODAL_VIEW_PARAMETERS, { qcReasonData: passFailParameters ? passFailParameters.qcFailReasons : null, qcPassFailResult: qcPassFail, qcImageData: null, qcRemarksData: null }));
        } catch (error) {
            console.log(error);
        }
    }
}

export function changeQCReasonResult(qcReasonObjectId, qcReasonData) {
    return async function (dispatch) {
        try {
            let cloneQCReasonData = _.cloneDeep(qcReasonData);
            cloneQCReasonData[qcReasonObjectId].qcResult = cloneQCReasonData[qcReasonObjectId].qcResult ? false : true;
            dispatch(setState(SET_QC_MODAL_REASON, { qcReasonData: cloneQCReasonData }));
        } catch (error) {
            console.log('error', error)
        }
    }
}

export function saveQCImageData(fieldAttributeMaster, value) {
    return async function (dispatch) {
        try {
            console.log('saveQCImageData fieldAttributeMaster', fieldAttributeMaster, 'value', value);
            let clonefieldAttributeMaster = { ...fieldAttributeMaster };
            clonefieldAttributeMaster.value = value ? value : clonefieldAttributeMaster.value;
            console.log('saveQCImageData fieldAttributeMaster', clonefieldAttributeMaster);
            navDispatch(StackActions.pop());
            dispatch(setState(SET_QC_MODAL_IMAGE, { qcImageData: clonefieldAttributeMaster }));
        } catch (error) {
            console.log('error', error);
        }
    }
}

export function validateQCDataAndProceed(qcAttributeMaster, qcModalData) {
    return async function (dispatch) {
        try {
            let dataValid = true;
            if (qcModalData.qcPassFailResult == PASS) {
                if (qcAttributeMaster.qcImageValidation && qcAttributeMaster.childList.qcImage) {
                    if(!qcModalData.qcImageData) {
                        throw new Error('test')
                    }
                }
                if(qcAttributeMaster.qcPassRemarksValidation && qcAttributeMaster.childList.qcRemark) {
                    // if()
                }
            } else {

            }
        } catch (error) {
            console.log(error);
        }
    }
}

