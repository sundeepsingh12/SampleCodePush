'use strict'

const InitialState = require('./dataStoreInitialState').default

const {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
} = require('../../lib/constants').default

const initialState = new InitialState()

export default function dataStoreReducer(state = initialState, action) {
    switch (action.type) {
        case SET_VALIDATIONS:
            return state.set('isScannerEnabled', action.payload.isScannerEnabled)
                .set('isAutoStartScannerEnabled', action.payload.isAutoStartScannerEnabled)
                .set('isAllowFromField', action.payload.isAllowFromField)
                .set('isSearchEnabled', action.payload.isSearchEnabled)

        case SET_DATA_STORE_ATTR_MAP:
            return state.set('dataStoreAttrValueMap', action.payload)

    }
    return state
}
