'use strict'
import {
    NEW_JOB_STATUS,
    SAVE_ACTIVATED,
    POPULATE_DATA,
    FormLayout,
    NewJobStatus,
    SET_NEWJOB_DRAFT_INFO
} from '../../lib/constants'
import { newJob } from '../../services/classes/NewJob'
import { setState, navigateToScene } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import _ from 'lodash'
import { draftService } from '../../services/classes/DraftService'

/**
 * It will navigate to FormLayout container
 * @param {*} status 
 * @param {*} negativeId 
 * @param {*} jobMasterId 
 */
export function redirectToFormLayout(status, negativeId, jobMasterId) {
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
 */
export function redirectToContainer(pageObject) {
    return async function (dispatch) {
        try {
            let saveActivatedData = await keyValueDBService.getValueFromStore(SAVE_ACTIVATED)//get saveActiavted data
            let returnParams = await newJob.checkForNextContainer(pageObject, saveActivatedData)//from saveActivated data check which container to go to
            if (returnParams.screenName == NewJobStatus) {//if screenName is NewJobStatus check if draft exists
                const draftStatusInfo = draftService.getDraftForState(null, pageObject.jobMasterIds[0])
                const nextStatus = await newJob.getNextPendingStatusForJobMaster(pageObject.jobMasterIds[0], pageObject.additionalParams.statusId)
                if (_.isEmpty(draftStatusInfo)) {
                    dispatch(redirectToFormLayout(nextStatus, -1, pageObject.jobMasterIds[0]))
                } else {
                    dispatch(setState(SET_NEWJOB_DRAFT_INFO, { draft: draftStatusInfo, nextStatus }))
                }
            } else { //this is the case of saveActivated data which is present so navigate to saveActivated container or CheckoutDetails container depending upon screeName
                if (returnParams.stateParam) { //if state params is present then populate state of saveActivated
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