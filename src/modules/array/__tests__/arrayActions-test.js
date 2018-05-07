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
    SET_ERROR_MSG
} from '../../../lib/constants'
import { arrayService } from '../../../services/classes/ArrayFieldAttribute'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
var formLayoutActions = require('../../form-layout/formLayoutActions')
import { formLayoutService } from '../../../services/classes/formLayout/FormLayout.js'
import { formLayoutEventsInterface } from '../../../services/classes/formLayout/FormLayoutEventInterface.js'
import { fieldValidationService } from '../../../services/classes/FieldValidation'
import { userExceptionLogsService } from '../../../services/classes/UserException'

// describe('getSortedArrayChildElements ', () => {
//     it('sets error message in case of invalid configuration', () => {
//         const arrayROW = {
//             childElementsTemplate: {
//                 sequenceWiseRootFieldAttributes
//             },
//             arrayRowDTO: {
//                 arrayElements: { test: 1 },
//                 lastRowId: 0,
//                 isSaveDisabled: true,
//             },
//             errorMessage: 'test error'
//         }
//         const expectedActions = [
//             {
//                 type: SET_ERROR_MSG,
//                 payload: arrayROW.errorMessage
//             },
//         ]
//         const sequenceWiseRootFieldAttributes = {
//             formLayoutObject: {},
//             nextEditable: 'test',
//             latestPositionId: 1
//         }
//         formLayoutService.getSequenceWiseRootFieldAttributes = jest.fn()
//         formLayoutService.getSequenceWiseRootFieldAttributes.mockReturnValue(sequenceWiseRootFieldAttributes)
//         arrayService.getSortedArrayChildElements = jest.fn()
//         arrayService.getSortedArrayChildElements.mockReturnValue(arrayROW)
//         const store = mockStore({})
//         return store.dispatch(actions.getSortedArrayChildElements(1, 1, 0, {}))
//             .then(() => {
//                 expect(formLayoutService.getSequenceWiseRootFieldAttributes).toHaveBeenCalledTimes(1)
//                 expect(arrayService.getSortedArrayChildElements).toHaveBeenCalledTimes(1)
//                 expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
//                 expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
//             })
//     })
//     it('prepares array template and adds first row initially', () => {
//         const arrayROW = {
//             childElementsTemplate: {
//                 sequenceWiseRootFieldAttributes
//             },
//             arrayRowDTO: {
//                 arrayElements: { test: 1 },
//                 lastRowId: 0,
//                 isSaveDisabled: true
//             }
//         }
//         const expectedActions = [
//             {
//                 type: SET_ARRAY_CHILD_LIST,
//                 payload: arrayROW
//             },
//         ]
//         const sequenceWiseRootFieldAttributes = {
//             formLayoutObject: {},
//             nextEditable: 'test',
//             latestPositionId: 1
//         }
//         formLayoutService.getSequenceWiseRootFieldAttributes = jest.fn()
//         formLayoutService.getSequenceWiseRootFieldAttributes.mockReturnValue(sequenceWiseRootFieldAttributes)
//         arrayService.getSortedArrayChildElements = jest.fn()
//         arrayService.getSortedArrayChildElements.mockReturnValue(arrayROW)
//         const store = mockStore({})
//         return store.dispatch(actions.getSortedArrayChildElements(1, 1, 0, {}))
//             .then(() => {
//                 expect(formLayoutService.getSequenceWiseRootFieldAttributes).toHaveBeenCalledTimes(1)
//                 expect(arrayService.getSortedArrayChildElements).toHaveBeenCalledTimes(1)
//                 expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
//                 expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
//             })
//     })
//     it('no action called for empty array dto', () => {
//         const arrayROW = {
//             childElementsTemplate: {
//                 sequenceWiseRootFieldAttributes
//             },
//             arrayRowDTO: {
//                 arrayElements: { test: 1 },
//                 lastRowId: 0,
//                 isSaveDisabled: true
//             }
//         }
//         const expectedActions = [
//             {
//                 type: SET_ARRAY_CHILD_LIST,
//                 payload: arrayROW
//             },
//         ]
//         const sequenceWiseRootFieldAttributes = {
//             formLayoutObject: {},
//             nextEditable: 'test',
//             latestPositionId: 1
//         }
//         formLayoutService.getSequenceWiseRootFieldAttributes = jest.fn()
//         formLayoutService.getSequenceWiseRootFieldAttributes.mockReturnValue(sequenceWiseRootFieldAttributes)
//         arrayService.getSortedArrayChildElements = jest.fn()
//         arrayService.getSortedArrayChildElements.mockReturnValue(null)
//         const store = mockStore({})
//         return store.dispatch(actions.getSortedArrayChildElements(1, 1, 0, {}))
//             .then(() => {
//                 expect(formLayoutService.getSequenceWiseRootFieldAttributes).toHaveBeenCalledTimes(1)
//                 expect(arrayService.getSortedArrayChildElements).toHaveBeenCalledTimes(1)
//             })
//     })
// })

describe('test for addRowInarray', () => {
    it('should add new row in arrayElements object', () => {
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
    it('should throw for null arrayrow', () => {
        const lastRowId = 1
        const childElementsTemplate = {
            test: 1
        }
        const arrayElements = {
            0: {
                test: 2
            },
        }
        const message = 'Row could not be added'
        const expectedActions = [
            {
                type: SET_ERROR_MSG,
                payload: message
            },
        ]
        arrayService.addArrayRow = jest.fn()
        arrayService.addArrayRow.mockReturnValue(null);
        userExceptionLogsService.addUserExceptionLogs = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.addRowInArray(lastRowId, childElementsTemplate, arrayElements))
            .then(() => {
                expect(arrayService.addArrayRow).toHaveBeenCalledTimes(1)
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalledTimes(1)
            })
    })
})

describe('test for deleteArrayRow', () => {
    it('should delete row in arrayElements object', () => {
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
    it('should throw error for null newArrayElements', () => {
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
        const message = 'Row could not be deleted'
        const expectedActions = [
            {
                type: SET_ERROR_MSG,
                payload: message
            },
        ]
        const isSaveDisabled = true
        userExceptionLogsService.addUserExceptionLogs = jest.fn()
        arrayService.deleteArrayRow = jest.fn()
        arrayService.deleteArrayRow.mockReturnValue(null);
        arrayService.enableSaveIfRequired = jest.fn()
        arrayService.enableSaveIfRequired.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.deleteArrayRow(arrayElements, rowId, lastRowId, isSaveDisabled))
            .then(() => {
                expect(arrayService.addArrayRow).toHaveBeenCalledTimes(1)
                expect(arrayService.enableSaveIfRequired).toHaveBeenCalledTimes(1)
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalledTimes(1)
            })
    })
})

describe('test for getNextFocusableAndEditableElement', () => {
    it('should find next focusable element and set value in array elements', () => {
        const lastRowId = 1
        const rowId = 0
        let formLayoutObject = new Map()
        formLayoutObject.set(1, {
            displayValue: 'abc'
        })
        const arrayElements = {
            0: {
                formLayoutObject,
                isSaveDisabled: true
            },
            1: {
                formLayoutObject: {},

                isSaveDisabled: true
            },
        }
        const newArrayElements = {
            arrayElements: {
                formLayoutObject: {},
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
        arrayService.findNextEditableAndSetSaveDisabled = jest.fn()
        arrayService.findNextEditableAndSetSaveDisabled.mockReturnValue(newArrayElements)
        const store = mockStore({})
        return store.dispatch(actions.getNextFocusableAndEditableElement(1, isSaveDisabled, 'test', arrayElements, rowId))
            .then(() => {
                expect(arrayService.findNextEditableAndSetSaveDisabled).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
    it('should throw error for null array elements', () => {
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
        const message = 'Row could not be deleted'
        const expectedActions = [
            {
                type: SET_ERROR_MSG,
                payload: message
            },
        ]
        const nextEditable = 'testedit'
        const isSaveDisabled = true
        arrayService.findNextEditableAndSetSaveDisabled = jest.fn()
        arrayService.findNextEditableAndSetSaveDisabled.mockReturnValue(null)
        const store = mockStore({})
        return store.dispatch(actions.getNextFocusableAndEditableElement(1, isSaveDisabled, 'test', arrayElements, rowId))
            .then(() => {
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalled()
            })
    })
})
describe('test for saveArray', () => {
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
    const isSaveDisabled = true
    const fieldDataListWithLatestPositionId = {

    }
    let parameters = {
        parentObject: {},
        formElement: {},
        isSaveDisabled: true,
        latestPositionId: 2,
        jobTransactionId: 123
    }

    it('should save array', () => {
        arrayService.prepareArrayForSaving = jest.fn()
        arrayService.prepareArrayForSaving.mockReturnValue(arrayElements);
        formLayoutActions.updateFieldDataWithChildData = jest.fn()
        formLayoutActions.updateFieldDataWithChildData.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.saveArray(arrayElements, parameters.parentObject, parameters.jobTransactionId, parameters, {}, {}))
            .then(() => {
                expect(arrayService.prepareArrayForSaving).toHaveBeenCalled()
                expect(formLayoutActions.updateFieldDataWithChildData).toHaveBeenCalled()
            })
    })
    it('should throw error', () => {
        const message = 'Array Could not be saved'
        const expectedActions = [
            {
                type: SET_ERROR_MSG,
                payload: message
            },
        ]
        arrayService.prepareArrayForSaving = jest.fn()
        arrayService.prepareArrayForSaving.mockReturnValue(null);
        formLayoutActions.updateFieldDataWithChildData = jest.fn()
        formLayoutActions.updateFieldDataWithChildData.mockReturnValue({})

        const store = mockStore({})
        return store.dispatch(actions.saveArray(arrayElements, parameters.parentObject, parameters.jobTransactionId, parameters.latestPositionId, parameters.formElement, parameters.nextEditable, parameters.isSaveDisabled))
            .then(() => {
                expect(arrayService.prepareArrayForSaving).toHaveBeenCalled()
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalled()
            })
    })
})

// describe('test for fieldValidationsArray', () => {
//     const lastRowId = 1
//     const rowId = 0
//     const arrayElements = {
//         0: {
//             test: 2,
//             formLayoutObject: {}
//         },
//         1: {
//             test: 1
//         },
//     }
//     const newArrayElements = {
//         arrayElements: {
//             formLayoutObject: {},
//             nextEditable: 'test',
//             isSaveDisabled: true
//         },
//         isSaveDisabled: true
//     }
//     const expectedActions = [
//         {
//             type: SET_ARRAY_ELEMENTS,
//             payload: newArrayElements
//         },
//     ]
//     const currentElement = {
//         fieldAttributeMasterId: 0
//     }
//     const nextEditable = 'testedit'
//     const isSaveDisabled = true
//     it('should find next focusable element and set value in array elements', () => {
//         fieldValidationService.fieldValidations = jest.fn()
//         fieldValidationService.fieldValidations.mockReturnValue(true)
//         const store = mockStore({})
//         return store.dispatch(actions.fieldValidationsArray(currentElement, arrayElements, 'AFTER', {}, 0, isSaveDisabled))
//             .then(() => {
//                 expect(fieldValidationService.fieldValidations).toHaveBeenCalled()
//                 expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
//                 expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
//             })
//     })
// })

describe('test for showOrDropModal', () => {
    it('should delete row in arrayElements object', () => {
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
            0: {
                test: 2,
                modalFieldAttributeMasterId: 1
            },
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
        const store = mockStore({})
        return store.dispatch(actions.showOrDropModal(1, arrayElements, 0, 1, true))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})