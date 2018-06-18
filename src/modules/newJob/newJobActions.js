'use strict'
import {
    SAVE_ACTIVATED,
    POPULATE_DATA,
    FormLayout,
    SET_NEWJOB_DRAFT_INFO,
    USER,
    CHECK_TRANSACTION_STATUS_NEW_JOB,
    PAGES_LOADING
} from '../../lib/constants'
import { newJob } from '../../services/classes/NewJob'
import { setState, navigateToScene } from '../global/globalActions'
import { checkForPaymentAtEnd } from '../job-details/jobDetailsActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import _ from 'lodash'
import { draftService } from '../../services/classes/DraftService'
import { DELETE_DRAFT } from '../../lib/ContainerConstants'
import moment from 'moment';

/**
 * It will navigate to FormLayout container
 * @param {*} status 
 * @param {*} negativeId 
 * @param {*} jobMasterId 
 */
export function redirectToFormLayout(status, negativeId, jobMasterId, navigate, deleteDraft, action) {
    return async function (dispatch) {
        try {
            const user = await keyValueDBService.getValueFromStore(USER)
            const referenceNumber = user.value.id + '/' + user.value.hubId + '/' + moment().valueOf()
            if(deleteDraft ) {
                dispatch(setState(action, DELETE_DRAFT))
                draftService.deleteDraftFromDb({ id: -1, jobId: -1, jobMasterId }, jobMasterId)
            }
            dispatch(navigateToScene(FormLayout, {
                statusId: status.id,
                statusName: status.name,
                jobTransactionId: negativeId,
                jobMasterId,
                jobTransaction: {
                    id: negativeId,
                    jobMasterId,
                    jobId: negativeId,
                    referenceNumber
                }
            },
                navigate))
        } catch (error) {
            //TODO
        }
    }
}

/**
 * This method is called from home container and is use to check which container to navigate to
 */
export function redirectToContainer(pageObject, navigate) {
    return async function (dispatch) {
        try {
            let jobMasterId = JSON.parse(pageObject.jobMasterIds)[0]
            let saveActivatedData = await keyValueDBService.getValueFromStore(SAVE_ACTIVATED)//get saveActiavted data
            let returnParams = await newJob.checkForNextContainer(jobMasterId, saveActivatedData)//from saveActivated data check which container to go to
            if (returnParams.screenName == FormLayout) { //if screenName is FormLayout check if draft exists
                const draftStatusInfo = draftService.getDraftForState(null, jobMasterId)
                const nextStatus = await newJob.getNextPendingStatusForJobMaster(jobMasterId, JSON.parse(pageObject.additionalParams).statusId)
                if (_.isEmpty(draftStatusInfo)) {
                    dispatch(redirectToFormLayout(nextStatus, -1, jobMasterId, navigate))
                } else {
                    let checkTransactionStatus = await dispatch(checkForPaymentAtEnd(draftStatusInfo, null, null, null, CHECK_TRANSACTION_STATUS_NEW_JOB, PAGES_LOADING , navigate))
                    if(checkTransactionStatus !== true){ 
                        dispatch(setState(SET_NEWJOB_DRAFT_INFO, { draft: draftStatusInfo, nextStatus }))
                    }
                }
            }else { //this is the case of saveActivated data which is present so navigate to saveActivated container or CheckoutDetails container depending upon screeName
                if (returnParams.stateParam) { //if state params is present then populate state of saveActivated
                    await dispatch(setState(POPULATE_DATA, returnParams.stateParam))
                }
                dispatch(navigateToScene(returnParams.screenName, returnParams.navigationParams, navigate))
            }
        } catch (error) {
            //TODO
        }
    }
}