'use strict'
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SET_CAMERA_LOADER, SET_IMAGE_DATA, SET_SHOW_IMAGE, SET_SHOW_VIEW_IMAGE, VIEW_IMAGE_DATA } from '../../../lib/constants';
import { signatureService } from '../../../services/classes/SignatureRemarks';
import { userExceptionLogsService } from '../../../services/classes/UserException';
var actions = require('../cameraActions')
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import CompressImage from 'react-native-compress-image';
import {
    ImageStore,
} from 'react-native';
describe('test for saveImage', () => {

    let result = 'test'
    let parameters = {
        parentObject: {},
        formElement: {},
        isSaveDisabled: true,
        latestPositionId: 2,
        jobTransactionId: 123
    }
    const expectedActions = [
        {
            type: SET_SHOW_VIEW_IMAGE,
            payload: {
                imageData: '',
                showImage: false,
                viewData: ''
            }
        }
    ]
    it('should save image in form layout state', () => {
        const store = mockStore({})
        signatureService.saveFile = jest.fn()
        signatureService.saveFile.mockReturnValue('test.jpg')
        return store.dispatch(actions.saveImage(result, 1, parameters, false, null, {}))
            .then(() => {
                expect(signatureService.saveFile).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should save image in array state', () => {
        const store = mockStore({})
        signatureService.saveFile = jest.fn()
        signatureService.saveFile.mockReturnValue('test.jpg')
        return store.dispatch(actions.saveImage(result, 1, parameters, true, 0, {}))
            .then(() => {
                expect(signatureService.saveFile).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for getImageData', () => {

    let result = 'test'
    const expectedActions = [
        {
            type: VIEW_IMAGE_DATA,
            payload: result
        }
    ]

    it('get image data and set in state', () => {
        const store = mockStore({})
        signatureService.getImageData = jest.fn()
        signatureService.getImageData.mockReturnValue(result)
        return store.dispatch(actions.getImageData('abc'))
            .then(() => {
                expect(signatureService.getImageData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for setInitialState', () => {

    const expectedActions = [
        {
            type: VIEW_IMAGE_DATA,
            payload: ''
        }
    ]

    it('set image data empty', () => {
        const store = mockStore({})

        return store.dispatch(actions.setInitialState())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for setExistingImage', () => {

    const expectedActions = [
        {
            type: SET_IMAGE_DATA,
            payload: 'test'
        },
        {
            type: SET_SHOW_IMAGE,
            payload: true
        }
    ]

    it('throw error', () => {
        const store = mockStore({})
        userExceptionLogsService.addUserExceptionLogs = jest.fn()
        return store.dispatch(actions.setExistingImage())
            .then(() => {
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalledTimes(1)
            })
    })
    it('set image data', () => {
        const store = mockStore({})
        signatureService.getImageData = jest.fn()
        signatureService.getImageData.mockReturnValue('test')
        return store.dispatch(actions.setExistingImage({ value: 'avc' }))
            .then(() => {
                expect(signatureService.getImageData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('test for compressImages', () => {

    const expectedActions = [
        {
            type: SET_CAMERA_LOADER,
            payload: true
        }
    ]

    it('throw error in image store', () => {
        const store = mockStore({})
        ImageStore.getBase64ForTag = jest.fn(() => {
            throw new Error('error')
        })
        return store.dispatch(actions.compressImages('uri'))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].payload).toEqual(false)
            })
    })

    it('throw error in image compress', () => {
        const store = mockStore({})
        return store.dispatch(actions.compressImages())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].payload).toEqual(false)
            })
    })
})