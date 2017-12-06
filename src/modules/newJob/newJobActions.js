'use strict'
import {
    NEW_JOB_MASTER,
    NEW_JOB_STATUS,
    SAVE_ACTIVATED,
    SaveActivated,
    CheckoutDetails,
    POPULATE_DATA,
    JOB_MASTER
} from '../../lib/constants'

import {newJob} from '../../services/classes/NewJob'
import { setState, navigateToScene } from '../global/globalActions'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { transientStatusService } from '../../services/classes/TransientStatusService'
import  _ from 'lodash'


export function getMastersWithNewJob() {
    return async function (dispatch) {
        let mastersWithNewJob = await newJob.getMastersWithNewJob();
        dispatch(setState(NEW_JOB_MASTER,mastersWithNewJob));
    }
}

export function getMastersFromMasterIds(jobMasterIds) {
    return async function (dispatch) {
        const jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER)
        let mastersWithNewJob = await newJob.getMastersFromMasterIds(jobMasters.value, jobMasterIds)
        dispatch(setState(NEW_JOB_MASTER, mastersWithNewJob))
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

export function redirectToContainer(jobMaster) {
    return async function (dispatch) {
        try {
            let saveActivatedData = await keyValueDBService.getValueFromStore(SAVE_ACTIVATED)
            let returnParams = await newJob.checkForNextContainer(jobMaster, saveActivatedData)
            let navigationParams
            if (returnParams.screenName == SaveActivated) {
                let result = await transientStatusService.convertMapToArrayOrArrayToMap(returnParams.saveActivatedState.differentData, returnParams.navigationFormLayoutStates, false)
                await dispatch(setState(POPULATE_DATA, {
                    commonData: returnParams.saveActivatedState.commonData,
                    statusName: returnParams.saveActivatedState.statusName,
                    differentData: result.differentData,
                    isSignOffVisible: returnParams.saveActivatedState.isSignOffVisible,
                }))
                navigationParams = {
                    calledFromNewJob: true,
                    jobMasterId: jobMaster.id,
                    navigationFormLayoutStates: result.arrayFormElement,
                    jobTransaction: returnParams.navigationParams.jobTransaction,
                    contactData: returnParams.navigationParams.contactData,
                    currentStatus: returnParams.navigationParams.currentStatus
                }
            } else if (returnParams.screenName == CheckoutDetails) {
                navigationParams = {
                    calledFromNewJob: true,
                    jobMasterId: jobMaster.id,
                    commonData: returnParams.navigationParams.commonData,
                    recurringData: returnParams.navigationParams.recurringData,
                    signOfData: returnParams.navigationParams.signOfData,
                    totalAmount: returnParams.navigationParams.totalAmount
                }
            } else {
                navigationParams = {
                    jobMaster: returnParams.jobMaster
                }
            }
            dispatch(navigateToScene(returnParams.screenName, navigationParams))
        } catch (error) {
            console.log(error)
        }
    }
}