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
import { NavigationActions } from 'react-navigation'
import { draftService } from '../../../services/classes/DraftService'

describe('test for redirectToContainer', () => {

    const pageobject = {
        jobMasterIds: JSON.stringify([1]),
        additionalParams: JSON.stringify({ statusId: 1 })
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
    it('should redirect to form layout when no draft is present', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        newJob.checkForNextContainer = jest.fn()
        newJob.checkForNextContainer.mockReturnValue({
            screenName: 'FormLayout',
            stateParam: {}
        })
        draftService.getDraftForState = jest.fn()
        draftService.getDraftForState.mockReturnValue({})
        newJob.getNextPendingStatusForJobMaster = jest.fn()
        newJob.getNextPendingStatusForJobMaster.mockReturnValue({
            id: 1,
            name: 'test'
        })
        const store = mockStore({})
        return store.dispatch(actions.redirectToContainer(pageobject))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(newJob.checkForNextContainer).toHaveBeenCalledTimes(1)
                expect(draftService.getDraftForState).toHaveBeenCalledTimes(1)
            })
    })
    it('should restore draft', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        newJob.checkForNextContainer = jest.fn()
        newJob.checkForNextContainer.mockReturnValue({
            screenName: 'FormLayout',
            stateParam: {}
        })
        draftService.getDraftForState = jest.fn()
        draftService.getDraftForState.mockReturnValue({ formlayout: {} })
        newJob.getNextPendingStatusForJobMaster = jest.fn()
        newJob.getNextPendingStatusForJobMaster.mockReturnValue({
            id: 1,
            name: 'test'
        })
        const store = mockStore({})
        return store.dispatch(actions.redirectToContainer(pageobject))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(newJob.checkForNextContainer).toHaveBeenCalledTimes(1)
                expect(draftService.getDraftForState).toHaveBeenCalledTimes(1)
            })
    })
})


describe('test for redirectToFormLayout', () => {

    const expectedActions = [
        {
            type: POPULATE_DATA,
            payload: {}
        }
    ]

    it('should redirect to save activated', () => {
        NavigationActions.navigate = jest.fn()
        const store = mockStore({})
        return store.dispatch(actions.redirectToFormLayout(1, -1, 1))
            .then(() => {
                expect(NavigationActions.navigate).toHaveBeenCalledTimes(1)
            })
    })
})