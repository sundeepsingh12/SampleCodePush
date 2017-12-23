'use strict'
import {
    NEW_JOB_MASTER,
    NEW_JOB_STATUS,
    SAVE_ACTIVATED,
    SaveActivated,
    CheckoutDetails,
    POPULATE_DATA,
    JOB_MASTER,
    FormLayout,
    SET_ERROR_MSG_FOR_NEW_JOB
} from '../../lib/constants'
import {
    NEW_JOB_CONFIGURATION_ERROR
} from '../../lib/ContainerConstants'
import { newJob } from '../../services/classes/NewJob'
import { setState, navigateToScene } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import _ from 'lodash'


export function getMastersWithNewJob() {
    return async function (dispatch) {
        let mastersWithNewJob = await newJob.getMastersWithNewJob();
        if (_.size(mastersWithNewJob) == 1) {
            dispatch(redirectToContainer(mastersWithNewJob[0]))
        } else if (_.size(mastersWithNewJob) == 0) {
            dispatch(setState(SET_ERROR_MSG_FOR_NEW_JOB, NEW_JOB_CONFIGURATION_ERROR))
        }
        dispatch(setState(NEW_JOB_MASTER, mastersWithNewJob));
    }
}

export function getMastersFromMasterIds(jobMasterIds) {
    return async function (dispatch) {
        const jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER)
        let mastersWithNewJob = await newJob.getMastersFromMasterIds(jobMasters.value, jobMasterIds)
        if (_.size(mastersWithNewJob) == 1) {
            dispatch(redirectToContainer(mastersWithNewJob[0]))
        } else if (_.size(mastersWithNewJob) == 0) {
            dispatch(setState(SET_ERROR_MSG_FOR_NEW_JOB, NEW_JOB_CONFIGURATION_ERROR))
        }
        dispatch(setState(NEW_JOB_MASTER, mastersWithNewJob))
    }
}

export function getStatusAndIdForJobMaster(jobMasterId) {
    return async function (dispatch) {
        if (!jobMasterId) {
            // fire error action for missing jobMasterId
        }
        //initially reset the statusList
        dispatch(setState(NEW_JOB_STATUS, []));
        let nextPendingStatusWithId = await newJob.getNextPendingStatusForJobMaster(jobMasterId);
        if (_.size(nextPendingStatusWithId.nextPendingStatus) == 1) {
            dispatch(redirectToFormLayout(nextPendingStatusWithId.nextPendingStatus[0], nextPendingStatusWithId.negativeId, jobMasterId))
        }
        dispatch(setState(NEW_JOB_STATUS, nextPendingStatusWithId));
    }
}

export function redirectToFormLayout(status, negativeId, jobMasterId) {
    return async function (dispatch) {
        try {
            dispatch(navigateToScene(FormLayout, {
                statusId: status.id,
                statusName: status.name,
                jobTransactionId: negativeId,
                jobMasterId: jobMasterId,
                jobTransaction: {
                    id: negativeId,
                    jobMasterId: jobMasterId,
                    jobId: negativeId,
                }
            }))
        } catch (error) {

        }
    }
}

export function redirectToContainer(jobMaster) {
    return async function (dispatch) {
        try {
            let saveActivatedData = await keyValueDBService.getValueFromStore(SAVE_ACTIVATED)
            let returnParams = await newJob.checkForNextContainer(jobMaster, saveActivatedData)
            if (returnParams.stateParam) {
                await dispatch(setState(POPULATE_DATA, returnParams.stateParam))
            }
            dispatch(navigateToScene(returnParams.screenName, returnParams.navigationParams))
        } catch (error) {
            console.log(error)
        }
    }
}