'use strict'
const {
    NEW_JOB_MASTER,
    NEW_JOB_STATUS
} = require('../../lib/constants').default

import {newJob} from '../../services/classes/NewJob'
import { setState } from '../global/globalActions'


export function getMastersWithNewJob() {
    return async function (dispatch) {
        let mastersWithNewJob = await newJob.getMastersWithNewJob();
        dispatch(setState(NEW_JOB_MASTER,mastersWithNewJob));
    }
}


export function getStatusAndIdForJobMaster(jobMasterId) {
    return async function (dispatch) {
        if(!jobMasterId){
            // fire error action for missing jobMasterId
        }
        //initially reset the statusList
        dispatch(setState(NEW_JOB_STATUS,[]));
        let nextPendingStatusWithId = await newJob.getNextPendingStatusForJobMaster(jobMasterId);
        dispatch(setState(NEW_JOB_STATUS,nextPendingStatusWithId));
    }
}