'use strict'
import {
    SET_MESSAGE_LIST,
    SET_MESSAGE_LOADER
} from '../../lib/constants'

const InitialState = require('./messageInitialState').default

const initialState = new InitialState()

export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case SET_MESSAGE_LIST:
            return state.set('messageList', action.payload)
                .set('isLoading', false)

        case SET_MESSAGE_LOADER:
            return state.set('isLoading', action.payload)

    }
    return state
}