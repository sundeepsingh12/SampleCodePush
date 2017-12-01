'use strict'
var actions = require('../transientActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
const {
    ADD_FORM_LAYOUT_STATE,
    LOADER_IS_RUNNING,
} = require('../../../lib/constants').default
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import _ from 'lodash'

describe('test for setStateFromNavigationParams', () => {

    const formLayout = {
        formElement: {
            id: 123
        }
    }

    const currentStatus = {
        id: 1
    }
    const expectedActions = [{
        type: LOADER_IS_RUNNING,
        payload: true
    }, {
        type: ADD_FORM_LAYOUT_STATE,
        payload: {
            '1': {
                id: 123
            }
        }
    }]

    it('should set all formLayoutStates', () => {
        const store = mockStore({})
        return store.dispatch(actions.setStateFromNavigationParams(formLayout, {}, expectedActions))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})
