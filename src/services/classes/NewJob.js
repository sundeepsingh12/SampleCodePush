import {
    JOB_STATUS,
    PENDING,
    NewJobStatus,
    SaveActivated
} from '../../lib/constants'
import { transientStatusAndSaveActivatedService } from './TransientStatusAndSaveActivatedService.js'
import { keyValueDBService } from './KeyValueDBService.js'
import _ from 'lodash'
import {
    CONFIGURATION_ISSUES_WITH_PENDING_STATUS,
    JOB_MASTER_MISSING
} from '../../lib/ContainerConstants'


class NewJob {

    /**
     * get nextStatusList of pending status mapped to jobMaster and there should be only one pending status present with a particular jobMaster
     * @param {*} jobMasterId 
     */
    async getNextPendingStatusForJobMaster(jobMasterId) {
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)//get all status
        const pendingStatusList = statusList.value.filter(status => status.jobMasterId == jobMasterId && status.code == PENDING)//filter those status whose code is Pending and whose jobMasterId is as given in function parameters
        if (!pendingStatusList || pendingStatusList.length != 1) {
            throw new Error(CONFIGURATION_ISSUES_WITH_PENDING_STATUS)// there should be exactly 1 status in PENDING if not throw an error
        }
        let nextPendingStatus = pendingStatusList[0].nextStatusList//get nextStatusList of pending status
        let negativeId = -1//initially set -1 as trasactionId we will change this id before saving the transaction in DB
        return {
            nextPendingStatus,
            negativeId
        }
    }

    /**
     * This method is used to find which is the next container to navigate to
     * @param {*} jobMasterId 
     * @param {*} saveActivatedData 
     */
    checkForNextContainer(jobMasterId, saveActivatedData, jobMasterName) {
        if (!jobMasterId || !jobMasterName) {
            throw new Error(JOB_MASTER_MISSING)
        }
        let navigationParams, stateParam, screenName
        //if save activated data is not present or save activated data is present but not with that jobMaster which is been clicked than NewJobStatus is the next container
        if (!saveActivatedData || !saveActivatedData.value[jobMasterId]) {
            return {
                screenName: NewJobStatus,
                navigationParams: {
                    jobMasterId,
                    jobMasterName
                }
            }
        }//if saveActivated data is present and it has screenName of SaveActivated then navigate to SaveActivated Container
        else if (saveActivatedData.value[jobMasterId].screenName == SaveActivated) {
            let result = transientStatusAndSaveActivatedService.convertMapToArrayOrArrayToMap(saveActivatedData.value[jobMasterId].saveActivatedState.differentData, saveActivatedData.value[jobMasterId].navigationFormLayoutStates, false)//we have to convert array to es6 Map
            stateParam = {//state of SaveActivated container
                commonData: saveActivatedData.value[jobMasterId].saveActivatedState.commonData,
                statusName: saveActivatedData.value[jobMasterId].saveActivatedState.statusName,
                differentData: result.differentData,
                isSignOffVisible: saveActivatedData.value[jobMasterId].saveActivatedState.isSignOffVisible,
            }
            navigationParams = {//navigation params which is passed to saveActivated container
                calledFromNewJob: true,
                jobMasterId,
                navigationFormLayoutStates: saveActivatedData.value[jobMasterId].navigationFormLayoutStates,
                jobTransaction: saveActivatedData.value[jobMasterId].navigationParams.jobTransaction,
                contactData: saveActivatedData.value[jobMasterId].navigationParams.contactData,
                currentStatus: saveActivatedData.value[jobMasterId].navigationParams.currentStatus
            }
        }//this is the case when saveActivated data is present and screen name is CheckoutDetails
        else {
            navigationParams = {//navigation params which is passed to CheckoutDetails container
                calledFromNewJob: true,
                jobMasterId,
                commonData: saveActivatedData.value[jobMasterId].navigationParams.commonData,
                recurringData: saveActivatedData.value[jobMasterId].navigationParams.recurringData,
                signOfData: saveActivatedData.value[jobMasterId].navigationParams.signOfData,
                totalAmount: saveActivatedData.value[jobMasterId].navigationParams.totalAmount,
                emailTableElement: saveActivatedData.value[jobMasterId].navigationParams.emailTableElement,
                emailIdInFieldData: saveActivatedData.value[jobMasterId].navigationParams.emailIdInFieldData,
                contactNumberInFieldData: saveActivatedData.value[jobMasterId].navigationParams.contactNumberInFieldData
            }
        }
        return {
            screenName: screenName = saveActivatedData.value[jobMasterId].screenName,
            navigationParams,
            stateParam
        }
    }
}

export let newJob = new NewJob()
