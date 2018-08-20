'use strict'

import InitialState from './qcInitialState'
import { SET_QC_LOADING, SET_QC_INITIAL_PARAMETERS, SET_QC_ARRAY, SET_QC_REASON, SET_QC_IMAGE, SET_QC_REMARKS, SET_QC_REASON_LOADING, SET_QC_PASS_FAIl, SET_QC_IMAGE_REMARKS_DATA, SET_QC_IMAGE_REMARKS_LOADING } from '../../lib/constants'

const initialState = new InitialState()

export default function qcReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) {
        return initialState.mergeDeep(state)
    }

    switch (action.type) {
        case SET_QC_LOADING: {
            return state.set('qcLoading', action.payload.qcLoading)
        }

        case SET_QC_INITIAL_PARAMETERS: {
            return state.set('qcAttributeMaster', action.payload.qcAttributeMaster)
                .set('qcDataArray', action.payload.qcDataArray)
                .set('qcImageURLDataArray', action.payload.qcImageURLDataArray)
                .set('qcLoading', false)
        }

        case SET_QC_ARRAY: {
            return state.set('qcDataArray', action.payload.qcDataArray)
        }

        case SET_QC_PASS_FAIl: {
            return state.set('qcPassFailResult', action.payload.qcPassFailResult)
                .set('qcLoading', false)
        }

        case SET_QC_REASON_LOADING: {
            return state.set('qcReasonLoading', action.payload.qcReasonLoading)
        }

        case SET_QC_REASON: {
            return state.set('qcReasonData', action.payload.qcReasonData)
                .set('qcReasonLoading', false)
        }

        case SET_QC_IMAGE_REMARKS_LOADING: {
            return state.set('qcImageAndRemarksLoading', action.payload.qcImageAndRemarksLoading)
        }

        case SET_QC_IMAGE_REMARKS_DATA: {
            return state.set('qcImageData', action.payload.qcImageData)
                .set('qcRemarksData', action.payload.qcRemarksData)
                .set('qcImageAndRemarksLoading', false)
        }

        case SET_QC_IMAGE: {
            return state.set('qcImageData', action.payload.qcImageData)
        }

        case SET_QC_REMARKS: {
            return state.set('qcRemarksData', action.payload.qcRemarksData)
        }

        // case SET_QC_MODAL_REMARKS: {
        //     return state.set('qcRemarksData', action.payload.qcRemarksData)
        // }
    }
    return state
}