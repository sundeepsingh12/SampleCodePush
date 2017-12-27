'use strict'

var actions = require('../offlineDSActions')
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../../services/classes/DataStoreService'
import { setState } from '../../global/globalActions'
import {
    SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR,
    LAST_DATASTORE_SYNC_TIME,
    UPDATE_PROGRESS_BAR,
    SET_DOWNLOADING_STATUS,
    SET_LAST_SYNC_TIME
} from '../../../lib/constants'
import CONFIG from '../../../lib/config'
import moment from 'moment'
import {
    LAST_SYNCED,
    NEVER_SYNCED
} from '../../../lib/AttributeConstants'


describe('test for getLastSyncTime', () => {

    const lastSyncTime = {
        value: '27-07-2017'
    }
    const expectedActions = [
        {
            type: SET_LAST_SYNC_TIME,
            payload: LAST_SYNCED + lastSyncTime
        }
    ]

    it('should set all last sync time', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(lastSyncTime)
        dataStoreService.getLastSyncTimeInFormat = jest.fn()
        dataStoreService.getLastSyncTimeInFormat.mockReturnValue(LAST_SYNCED + lastSyncTime)
        const store = mockStore({})
        return store.dispatch(actions.setValidation(validationArray))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(dataStoreService.getLastSyncTimeInFormat).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})
