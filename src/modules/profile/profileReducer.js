
'use strict'

import InitialState from './profileInitialState'
import {
    FETCH_USER_DETAILS,
} from '../../lib/constants'

const initialState = new InitialState()

export default function profileReducer(state = initialState, action) {
    switch (action.type) {

        case FETCH_USER_DETAILS:
            return state.set('name', action.payload.nameOfUser)
                .set('contactNumber', action.payload.contactOfUser)
                .set('email', action.payload.emailOfUser)


    }
    return state
}