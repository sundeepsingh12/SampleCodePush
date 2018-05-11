'use strict'

import {
    SET_IMAGE_DATA,
    SET_SHOW_IMAGE,
    VIEW_IMAGE_DATA,
    SET_SHOW_VIEW_IMAGE,
    SET_SHOW_IMAGE_AND_DATA
} from '../../../lib/constants'

import cameraReducer from '../cameraReducer'

describe('camera reducer', () => {

    it('should set image data', () => {
        const action = {
            type: SET_IMAGE_DATA,
            payload: 'test'
        }
        let nextState = cameraReducer(undefined, action)
        expect(nextState.imageData).toBe(action.payload)
    })

    it('should set show image', () => {
        const action = {
            type: SET_SHOW_IMAGE,
            payload: true
        }
        let nextState = cameraReducer(undefined, action)
        expect(nextState.showImage).toBe(action.payload)
    })

    it('should set view data', () => {
        const action = {
            type: VIEW_IMAGE_DATA,
            payload: 'test'
        }
        let nextState = cameraReducer(undefined, action)
        expect(nextState.viewData).toBe(action.payload)
    })

    it('should set image data and show image and view data', () => {
        const action = {
            type: SET_SHOW_VIEW_IMAGE,
            payload: {
                imageData: '',
                showImage: false,
                viewData: ''
            }
        }
        let nextState = cameraReducer(undefined, action)
        expect(nextState.imageData).toBe(action.payload)
        expect(nextState.viewData).toBe(action.payload)
        expect(nextState.showImage).toBe(action.payload)
    })

    it('should set image data and show image', () => {
        const action = {
            type: SET_SHOW_IMAGE_AND_DATA,
            payload: {
                data: '',
                showImage: false,
            }
        }
        let nextState = cameraReducer(undefined, action)
        expect(nextState.imageData).toBe(action.payload.data)
        expect(nextState.showImage).toBe(action.payload.showImage)
    })

    it('should return initial state', () => {
        const action = {
            type: null
        }
        let nextState = cameraReducer(undefined, action)
        expect(nextState.imageData).toBe('')
        expect(nextState.viewData).toBe('')
        expect(nextState.showImage).toBe(false)
    })
})