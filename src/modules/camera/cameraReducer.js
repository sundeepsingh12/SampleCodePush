'use strict'
import {
    VIEW_IMAGE_DATA,
    SET_SHOW_IMAGE_AND_DATA,
    SET_CAMERA_LOADER,
    SET_CAMERA_LOADER_INITIAL_SET_UP,
    SET_SHOW_IMAGE_AND_VALIDATION
} from '../../lib/constants'

const InitialState = require('./cameraInitialState').default

const initialState = new InitialState()

export default function cameraReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CAMERA_LOADER:
            return state.set('cameraLoader', action.payload)

        case VIEW_IMAGE_DATA:
            return state.set('viewData', action.payload)

        case SET_SHOW_IMAGE_AND_DATA:
            return state.set('imageData', action.payload)
                .set('cameraLoader',false)
        case SET_CAMERA_LOADER_INITIAL_SET_UP: 
        return state.set('imageData', '')
                    .set('validation', null)
                    .set('viewData','')
                    .set('cameraLoader', true)
        case SET_SHOW_IMAGE_AND_VALIDATION:
            return state.set('imageData', action.payload.data)
                        .set('validation', action.payload.validation)
                        .set('cameraLoader',false)
    }
    return state
}