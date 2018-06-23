import {
    JOB_STATUS,
    PENDING,
    SaveActivated,
    FormLayout
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
    async getNextPendingStatusForJobMaster(jobMasterId, statusId) {
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)//get all status
        if (!statusList || !statusList.value) {
            throw new Error(CONFIGURATION_ISSUES_WITH_PENDING_STATUS)
        }
        const pendingStatusList = statusList.value.filter(status => status.jobMasterId == jobMasterId && status.id == statusId)//filter those status whose code is Pending and whose jobMasterId is as given in function parameters
        return pendingStatusList[0]
    }

    /**
     * This method is used to find which is the next container to navigate to
     * @param {*} jobMasterId 
     * @param {*} saveActivatedData 
     */
    checkForNextContainer(jobMasterId, saveActivatedData) {
        if (!jobMasterId) {
            throw new Error(JOB_MASTER_MISSING)
        }
        let navigationParams, stateParam, screenName
        //if save activated data is not present or save activated data is present but not with that jobMaster which is been clicked than form layout is the next container
        if (!saveActivatedData || !saveActivatedData.value[jobMasterId]) {
            return {
                screenName: FormLayout,
            }
        }//if saveActivated data is present and it has screenName of SaveActivated then navigate to SaveActivated Container
        else if (saveActivatedData.value[jobMasterId].screenName == SaveActivated) {
            stateParam = {//state of SaveActivated container
                commonData: saveActivatedData.value[jobMasterId].saveActivatedState.commonData,
                statusName: saveActivatedData.value[jobMasterId].saveActivatedState.statusName,
                differentData: saveActivatedData.value[jobMasterId].saveActivatedState.differentData,
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
