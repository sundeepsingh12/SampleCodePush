'use strict'
import {
    SET_IMAGE_DATA,
    SET_SHOW_IMAGE,
    VIEW_IMAGE_DATA,
    SET_SHOW_VIEW_IMAGE,
    SET_SHOW_IMAGE_AND_DATA,
    SET_VALIDATION_FOR_CAMERA,
    SET_CAMERA_LOADER
} from '../../lib/constants'

const InitialState = require('./cameraInitialState').default

const initialState = new InitialState()

export default function cameraReducer(state = initialState, action) {
    switch (action.type) {
        case SET_IMAGE_DATA:
            return state.set('imageData', action.payload)
            case SET_CAMERA_LOADER:
            return state.set('cameraLoader', action.payload)

        case SET_SHOW_IMAGE:
            return state.set('showImage', action.payload)

        case VIEW_IMAGE_DATA:
            return state.set('viewData', action.payload)
        case SET_VALIDATION_FOR_CAMERA:
            return state.set('validation', action.payload)


        case SET_SHOW_VIEW_IMAGE:
            return state.set('imageData', action.payload)
                .set('showImage', action.payload)
                .set('viewData', action.payload)
                .set('cameraLoader',false)

        case SET_SHOW_IMAGE_AND_DATA:
            return state.set('imageData', action.payload.data)
                .set('showImage', action.payload.showImage)
                .set('cameraLoader',false)
    }
    return state
}