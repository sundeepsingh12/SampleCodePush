'use strict'

import { setState } from "../global/globalActions";
import { SET_QC_LOADING, SET_QC_INITIAL_PARAMETERS, SET_QC_ARRAY, SET_QC_MODAL_LOADING, SET_QC_MODAL_VIEW_PARAMETERS } from '../../lib/constants';
import { qcService } from '../../services/classes/QC'

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
            // dispatch(setState(SET_QC_LOADING, { qcLoading: false }));
            // let fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS);
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
            dispatch(setState(SET_QC_MODAL_LOADING, { qcModalLoading: true }));
            let passFailParameters = qcService.getQCPassFailParameters(qcDataArray, qcAttributeMaster, qcPassFail, jobTransaction)
            dispatch(setState(SET_QC_MODAL_VIEW_PARAMETERS, { qcReasonData: passFailParameters.qcFailReasons }));
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
            dispatch(setState(SET_QC_MODAL_VIEW_PARAMETERS, { qcReasonData: cloneQCReasonData }));
        } catch (error) {
            console.log('error', error)
        }
    }
}

export function saveQCImageData(fieldAttributeMaster, value) {
    return async function (dispatch) {
        try {
        } catch (error) {
            console.log('error', error)
        }
    }
}

