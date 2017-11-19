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
    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        moduleCustomizationService.getActiveModules = jest.fn()
    })
    const expectedActions = [
        {
            type: HOME_LOADING,
            payload: {
                loading: true
            }
        },
        {
            type: HOME_LOADING,
            payload: {
                loading: false
            }
        },
    ]
    const store = mockStore({})

    it('should enable modules', () => {
        return store.dispatch(actions.fetchModulesList())
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(moduleCustomizationService.getActiveModules).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})