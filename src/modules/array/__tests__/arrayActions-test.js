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


describe('getSortedArrayChildElements ', () => {
    it('prepares array template and adds first row initially', () => {
        const arrayROW = {
            childElementsTemplate: {
                0: {
                    id: 1
                }
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
        arrayService.getSortedArrayChildElements = jest.fn()
        arrayService.getSortedArrayChildElements.mockReturnValue(arrayROW)
        const store = mockStore({})
        return store.dispatch(actions.getSortedArrayChildElements(1, 1, 0, {}))
            .then(() => {
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