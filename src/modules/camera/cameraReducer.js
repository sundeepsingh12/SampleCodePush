'use strict'
import {
    SET_IMAGE_DATA,
    SET_SHOW_IMAGE
} from '../../lib/constants'

const InitialState = require('./cameraInitialState').default

const initialState = new InitialState()

export default function cameraReducer(state = initialState, action) {
    switch (action.type) {
        case SET_IMAGE_DATA:
            return state.set('imageData', action.payload)
        case SET_SHOW_IMAGE:
            return state.set('showImage', action.payload)
    }
    return state
}