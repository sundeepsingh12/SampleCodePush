'use strict'
const InitialState = require('../offlineDSInitialState').default


import offlineDataStoreReducer from '../offlineDSReducer'
import {
    SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR,
    UPDATE_PROGRESS_BAR,
    SET_DOWNLOADING_STATUS,
    SET_OFFLINEDS_INITIAL_STATE,
    SET_LAST_SYNC_TIME
} from '../../../lib/constants'
const initialState = new InitialState()

describe('offline Data Store reducer', () => {
    const resultState = new InitialState()
    const action =
        [{
            type: SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR,
            payload: {
                progressBarStatus: 80,
                fileName: 'temp'
            }
        }, {
            type: UPDATE_PROGRESS_BAR,
            payload: 80,
        }, {
            type: SET_DOWNLOADING_STATUS,
            payload: {
                progressBarStatus: 80,
                downLoadingStatus: 1
            }
        }, {
            type: SET_LAST_SYNC_TIME,
            payload: '20 mins ago'
        }, {
            type: SET_OFFLINEDS_INITIAL_STATE,
        }, {
            type: 'DEFAULT',
        }]

    it('test case for SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR should set progressBarStatus and fileName', () => {
        let nextState = offlineDataStoreReducer(undefined, action[0])
        expect(nextState.progressBarStatus).toBe(action[0].payload.progressBarStatus)
        expect(nextState.fileName).toBe(action[0].payload.fileName)
    })

    it('test case for UPDATE_PROGRESS_BAR should set progressBarStatus', () => {
        let nextState = offlineDataStoreReducer(undefined, action[1])
        expect(nextState.progressBarStatus).toBe(action[1].payload)
    })

    it('test case for SET_DOWNLOADING_STATUS should set progressBarStatus and downLoadingStatus', () => {
        let nextState = offlineDataStoreReducer(undefined, action[2])
        expect(nextState.progressBarStatus).toBe(action[2].payload.progressBarStatus)
        expect(nextState.downLoadingStatus).toBe(action[2].payload.downLoadingStatus)
    })

    it('test case for SET_LAST_SYNC_TIME should set lastSyncTime', () => {
        let nextState = offlineDataStoreReducer(undefined, action[3])
        expect(nextState.lastSyncTime).toBe(action[3].payload)
    })

    it('should set initialState for offlineDS', () => {
        let nextState = offlineDataStoreReducer(undefined, action[4])
        expect(nextState).toEqual(resultState)
    })

    it('default case', () => {
        let nextState = offlineDataStoreReducer(undefined, action[5])
        expect(nextState).toEqual(resultState)
    })
})
