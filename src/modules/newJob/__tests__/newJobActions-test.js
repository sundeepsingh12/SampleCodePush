'use strict'

var actions = require('../newJobActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { newJob } from '../../../services/classes/NewJob'

import {
    POPULATE_DATA
} from '../../../lib/constants'

import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test for redirectToContainer', () => {

    const pageobject = {
        jobMasterIds: JSON.stringify([1])
    }
    const expectedActions = [
        {
            type: POPULATE_DATA,
            payload: {}
        }
    ]

    it('should redirect to save activated', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        newJob.checkForNextContainer = jest.fn()
        newJob.checkForNextContainer.mockReturnValue({
            screenName: 'abc',
            stateParam: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.redirectToContainer(pageobject))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(newJob.checkForNextContainer).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

})
