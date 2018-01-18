'use strict'
import {
    SET_LOADER_IN_AUTOLOGOUT
} from '../../lib/constants'

const InitialState = require('./autoLogoutInitialState').default

const initialState = new InitialState()

export default function autoLogoutReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOADER_IN_AUTOLOGOUT:
            return state.set('isLoaderRunning', action.payload)
    }
    return state
}