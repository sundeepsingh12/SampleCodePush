'use strict'

import InitialState from './qcInitialState'
import { SET_QC_LOADING, SET_QC_INITIAL_PARAMETERS, SET_QC_ARRAY, SET_QC_MODAL_VIEW, SET_QC_MODAL_LOADING, SET_QC_MODAL_VIEW_PARAMETERS, SET_QC_MODAL_IMAGE, SET_QC_MODAL_REASON, SET_QC_MODAL_REMARKS } from '../../lib/constants'

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
                .set('qcLoading', false)
        }
        case SET_QC_ARRAY: {
            return state.set('qcDataArray', action.payload.qcDataArray)
        }
        case SET_QC_MODAL_VIEW: {
            return state.set('qcModal', action.payload.qcModal)
        }
        case SET_QC_MODAL_LOADING: {
            return state.set('qcModalLoading', action.payload.qcModalLoading)
        }
        case SET_QC_MODAL_VIEW_PARAMETERS: {
            return state.set('qcReasonData', action.payload.qcReasonData)
                .set('qcModalLoading', false)
                .set('qcModal', true)
                .set('qcPassFailResult', action.payload.qcPassFailResult)
                .set('qcImageData', action.payload.qcImageData)
                .set('qcRemarksData', action.payload.qcRemarksData)
        }
        case SET_QC_MODAL_IMAGE: {
            return state.set('qcImageData', action.payload.qcImageData)
                .set('qcModal', true)
        }
        case SET_QC_MODAL_REASON: {
            return state.set('qcReasonData', action.payload.qcReasonData)
        }
        case SET_QC_MODAL_REMARKS: {
            return state.set('qcRemarksData', action.payload.qcRemarksData)
        }
    }
    return state
}