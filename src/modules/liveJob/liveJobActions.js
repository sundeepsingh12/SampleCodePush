'use strict'

import {
    SET_LIVE_JOB_LIST
} from '../../lib/constants'

import {

} from '../../lib/AttributeConstants'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { setState, navigateToScene } from '../global/globalActions'
import { TABLE_JOB } from '../../lib/constants'
import * as realm from '../../repositories/realmdb'
import { liveJobService } from '../../services/classes/LiveJobService'

export function fetchAllLiveJobsList() {
    return async function (dispatch) {
        try {
            let liveJobList = await liveJobService.getLiveJobList()
            dispatch(setState(SET_LIVE_JOB_LIST, liveJobList))
        } catch (error) {
            console.log(error)
        }
    }
}