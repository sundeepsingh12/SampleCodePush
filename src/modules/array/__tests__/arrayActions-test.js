'use strict'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
var actions = require('../arrayActions')
import {
    SET_ARRAY_CHILD_LIST,
    SET_NEW_ARRAY_ROW,
    SET_ARRAY_ELEMENTS,
    SET_SAVE_DISABLED,
    ON_BLUR,
} from '../../../lib/constants'
import { arrayService } from '../../../services/classes/ArrayFieldAttribute'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
var formLayoutActions = require('../../form-layout/formLayoutActions')
import { formLayoutService } from '../../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../../services/classes/formLayout/FormLayoutEventInterface.js'

describe('getSortedArrayChildElements ', () => {
    it('prepares array template and adds first row initially', () => {
        const arrayROW = {
            childElementsTemplate: {
                sequenceWiseRootFieldAttributes
            },
            arrayRowDTO: {
                arrayElements: { test: 1 },
                lastRowId: 0,
                isSaveDisabled: true
            }
        }
        const expectedActions = [
            {
                type: SET_ARRAY_CHILD_LIST,
                payload: arrayROW
            },
        ]
        const sequenceWiseRootFieldAttributes = {
            formLayoutObject: {},
            nextEditable: 'test',
            latestPositionId: 1
        }
        formLayoutService.getSequenceWiseRootFieldAttributes = jest.fn()
        formLayoutService.getSequenceWiseRootFieldAttributes.mockReturnValue(sequenceWiseRootFieldAttributes)
        arrayService.getSortedArrayChildElements = jest.fn()
        arrayService.getSortedArrayChildElements.mockReturnValue(arrayROW)
        const store = mockStore({})
        return store.dispatch(actions.getSortedArrayChildElements(1, 1, 0, {}))
            .then(() => {
                expect(formLayoutService.getSequenceWiseRootFieldAttributes).toHaveBeenCalledTimes(1)
                expect(arrayService.getSortedArrayChildElements).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for addRowInarray', () => {
    const lastRowId = 1
    const childElementsTemplate = {
        test: 1
    }
    const arrayElements = {
        0: {
            test: 2
        },
    }
    const newArrayElements = {
        0: {
            test: 2
        },
        1: {
            test: 1
        },
    }
    const expectedActions = [
        {
            type: SET_NEW_ARRAY_ROW,
            payload: newArrayElements
        },
    ]
    it('should add new row in arrayElements object', () => {
        arrayService.addArrayRow = jest.fn()
        arrayService.addArrayRow.mockReturnValue(newArrayElements);
        const store = mockStore({})
        return store.dispatch(actions.addRowInArray(lastRowId, childElementsTemplate, arrayElements))
            .then(() => {
                expect(arrayService.addArrayRow).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for deleteArrayRow', () => {
    const lastRowId = 1
    const rowId = 0
    const arrayElements = {
        0: {
            test: 2
        },
        1: {
            test: 1
        },
    }
    const newArrayElements = {
        1: {
            test: 1
        },
    }
    const expectedActions = [
        {
            type: SET_ARRAY_ELEMENTS,
            payload: { isSaveDisabled: true, newArrayElements }
        },
    ]
    const isSaveDisabled = true
    it('should delete row in arrayElements object', () => {
        arrayService.deleteArrayRow = jest.fn()
        arrayService.deleteArrayRow.mockReturnValue(newArrayElements);
        arrayService.enableSaveIfRequired = jest.fn()
        arrayService.enableSaveIfRequired.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.deleteArrayRow(arrayElements, rowId, lastRowId, isSaveDisabled))
            .then(() => {
                expect(arrayService.addArrayRow).toHaveBeenCalledTimes(1)
                expect(arrayService.enableSaveIfRequired).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for getNextFocusableAndEditableElement', () => {
    const lastRowId = 1
    const rowId = 0
    const arrayElements = {
        0: {
            test: 2
        },
        1: {
            test: 1
        },
    }
    const newArrayElements = {
        arrayElements: {
            formLayoutObject: {},
            nextEditable: 'test',
            isSaveDisabled: true
        },
        isSaveDisabled: true
    }
    const expectedActions = [
        {
            type: SET_ARRAY_ELEMENTS,
            payload: newArrayElements
        },
    ]
    const nextEditable = 'testedit'
    const isSaveDisabled = true
    it('should find next focusable element and set value in array elements', () => {
        arrayService.findNextEditableAndSetSaveDisabled = jest.fn()
        arrayService.findNextEditableAndSetSaveDisabled.mockReturnValue(newArrayElements)
        const store = mockStore({})
        return store.dispatch(actions.getNextFocusableAndEditableElement(1, nextEditable, isSaveDisabled, 'test', arrayElements, rowId))
            .then(() => {
                expect(arrayService.findNextEditableAndSetSaveDisabled).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})
// not completed
// describe('test for saveArrays', () => {
//     const lastRowId = 1
//     const rowId = 0
//     const arrayElements = {
//         0: {
//             test: 2
//         },
//         1: {
//             test: 1
//         },
//     }
//     const isSaveDisabled = true
//     const fieldDataListWithLatestPositionId = {

//     }
//     let parameters = {
//         parentObject: {},
//         formElement: {},
//         nextEditable: {},
//         fixedSKUList: {},
//         isSaveDisabled: true,
//         latestPositionId: 2,
//         jobTransactionId: 123
//     }

//     it('should add new row in arrayElements object', () => {
//         arrayService.prepareArrayForSaving = jest.fn()
//         arrayService.prepareArrayForSaving.mockReturnValue(arrayElements);
//         formLayoutActions.updateFieldDataWithChildData = jest.fn()
//         formLayoutActions.updateFieldDataWithChildData.mockReturnValue({})
//         const store = mockStore({})
//         return store.dispatch(actions.saveArray(arrayElements, parameters.parentObject, parameters.jobTransactionId, parameters.latestPositionId, parameters.formElement, parameters.nextEditable, parameters.isSaveDisabled))
//             .then(() => {
//                 expect(arrayService.prepareArrayForSaving).toHaveBeenCalled()
//                 expect(formLayoutActions.updateFieldDataWithChildData).toHaveBeenCalled()
//             })
//     })
// })