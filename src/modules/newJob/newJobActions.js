'use strict'
import {
    NEW_JOB_STATUS,
    SAVE_ACTIVATED,
    POPULATE_DATA,
    FormLayout,
    NewJobStatus,
} from '../../lib/constants'
import { newJob } from '../../services/classes/NewJob'
import { setState, navigateToScene } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import _ from 'lodash'

/**
 * It will navigate to FormLayout container
 * @param {*} status 
 * @param {*} negativeId 
 * @param {*} jobMasterId 
 */
export function redirectToFormLayout(status, negativeId, jobMasterId, jobMasterName) {
    return async function (dispatch) {
        try {
            dispatch(navigateToScene(FormLayout, {
                statusId: status.id,
                statusName: status.name,
                jobTransactionId: negativeId,
                jobMasterId,
                jobTransaction: {
                    id: negativeId,
                    jobMasterId,
                    jobId: negativeId,
                }
            }))
        } catch (error) {
            //TODO
            console.log(error)
        }
    }
}

/**
 * This method is called from home container and is use to check which container to navigate to
 * @param {*} jobMasterId 
 * @param {*} jobMasterName 
 */
export function redirectToContainer(jobMasterId, jobMasterName) {
    return async function (dispatch) {
        try {
            let saveActivatedData = await keyValueDBService.getValueFromStore(SAVE_ACTIVATED)//get saveActiavted data
            let returnParams = await newJob.checkForNextContainer(jobMasterId, saveActivatedData, jobMasterName)//from saveActivated data check which container to go to
            if (returnParams.screenName == NewJobStatus) {//if screenName is NewJobStatus get nextStatusList of pending status
                let nextPendingStatusWithId = await newJob.getNextPendingStatusForJobMaster(jobMasterId)
                if (_.size(nextPendingStatusWithId.nextPendingStatus) == 1) {//if there is only one status directly navigate to formLayout
                    dispatch(redirectToFormLayout(nextPendingStatusWithId.nextPendingStatus[0], nextPendingStatusWithId.negativeId, jobMasterId, jobMasterName))
                } else {//if more than one status is present then set status List and navigate to NewJobStatus
                    dispatch(setState(NEW_JOB_STATUS, nextPendingStatusWithId));
                    dispatch(navigateToScene(NewJobStatus, returnParams.navigationParams))
                }
            } else {//this is the case of saveActivated data which is present so navigate to saveActivated container or CheckoutDetails container depending upon screeName
                if (returnParams.stateParam) {//if state params is present then populate state of saveActivated
                    await dispatch(setState(POPULATE_DATA, returnParams.stateParam))
                }
                dispatch(navigateToScene(returnParams.screenName, returnParams.navigationParams))
            }
        } catch (error) {
            //TODO
            console.log(error)
        }
    }
}