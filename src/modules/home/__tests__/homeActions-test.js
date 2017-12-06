'use strict'
import * as actions from '../homeActions'
import {
    HOME_LOADING,
} from '../../../lib/constants'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { moduleCustomizationService } from '../../../services/classes/ModuleCustomization'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test cases for action fetchModulesList', () => {
    let newJobModules = {
        'temp': {
            displayText: 'temp'
        }
    }
    const expectedActions = [
        {
            type: HOME_LOADING,
            payload: {
                loading: true,
                newJobModules: {}
            }
        },
        {
            type: HOME_LOADING,
            payload: {
                loading: false,
                newJobModules
            }
        }, {
            type: HOME_LOADING,
            payload: {
                loading: false,
                newJobModules: {}
            }
        }
    ]

    it('should enable modules and new job is present', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        moduleCustomizationService.getActiveModules = jest.fn()
        moduleCustomizationService.getActiveModules.mockReturnValue(newJobModules)
        const store = mockStore({})
        return store.dispatch(actions.fetchModulesList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(moduleCustomizationService.getActiveModules).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
    it('should enable modules when new job is not present', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        moduleCustomizationService.getActiveModules = jest.fn()
        moduleCustomizationService.getActiveModules.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.fetchModulesList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(moduleCustomizationService.getActiveModules).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})