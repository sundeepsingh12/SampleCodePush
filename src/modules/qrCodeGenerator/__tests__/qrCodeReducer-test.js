'use strict'

import qrCodeReducer from '../qrCodeReducer'
import {
    SCANNING
} from '../../../lib/constants'

import InitialState from '../qrCodeInitialState'

describe('test cases for qrcode  reducer', () => {
    it('test SCANNING', () => {
        const action = {
            type: SCANNING,
            payload: true
        }
        let nextState = qrCodeReducer(undefined, action)
        expect(nextState.scanning).toEqual(action.payload)
    })

    it('set initial state', () => {
        const action = {
            type: null
        }
        let nextState = qrCodeReducer(undefined, action)
        expect(nextState.scanning).toEqual(true)
    })
})
