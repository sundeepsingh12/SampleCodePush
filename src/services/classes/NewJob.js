import {
    JOB_MASTER,
    JOB_STATUS,
    PENDING,
    TABLE_JOB,
    NewJobStatus,
    SaveActivated
} from '../../lib/constants'

import { transientStatusService } from './TransientStatusService.js'
import { keyValueDBService } from './KeyValueDBService.js'
import * as realm from '../../repositories/realmdb'
import _ from 'lodash'


class NewJob {

    async getMastersWithNewJob() {
        const jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER);
        return jobMasters.value.filter(jobMaster => jobMaster.allowAddNew);
    }

    getMastersFromMasterIds(jobMasters, jobMasterIds) {
        if (!jobMasters || !jobMasters.value) {
            throw new Error('configuration issues with job master')
        }
        if (jobMasterIds) {
            return jobMasters.value.filter(jobMaster => _.indexOf(jobMasterIds, jobMaster.id) >= 0 && jobMaster.allowAddNew)
        } else {
            return jobMasters.value.filter(jobMaster => jobMaster.allowAddNew);
        }
    }

    async getNextPendingStatusForJobMaster(jobMasterId) {
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS);
        const pendingStatusList = statusList.value.filter(status => status.jobMasterId == jobMasterId && status.code == PENDING);
        if (!pendingStatusList || pendingStatusList.length == 0 || pendingStatusList.length > 1) {
            throw new Error('configuration issues with PENDING status'); // there should be exactly 1 status in PENDING
        }
        let nextPendingStatus = pendingStatusList[0].nextStatusList
        let negativeId = this._getNegativeId();
        return {
            nextPendingStatus,
            negativeId
        }
    }

    _getNegativeId() {
        let jobId = realm.getRecordListOnQuery(TABLE_JOB, null, false).length;
        return (-jobId - 1);
    }

    checkForNextContainer(jobMaster, saveActivatedData) {
        if (!jobMaster) {
            throw new Error('jobMaster not present')
        }
        let navigationParams, stateParam, screenName
        if (!saveActivatedData || !saveActivatedData.value[jobMaster.id]) {
            return {
                screenName: NewJobStatus,
                navigationParams: {
                    jobMaster
                }
            }
        } else if (saveActivatedData.value[jobMaster.id].screenName == SaveActivated) {
            let result = transientStatusService.convertMapToArrayOrArrayToMap(saveActivatedData.value[jobMaster.id].saveActivatedState.differentData, saveActivatedData.value[jobMaster.id].navigationFormLayoutStates, false)
            stateParam = {
                commonData: saveActivatedData.value[jobMaster.id].saveActivatedState.commonData,
                statusName: saveActivatedData.value[jobMaster.id].saveActivatedState.statusName,
                differentData: result.differentData,
                isSignOffVisible: saveActivatedData.value[jobMaster.id].saveActivatedState.isSignOffVisible,
            }
            navigationParams = {
                calledFromNewJob: true,
                jobMasterId: jobMaster.id,
                navigationFormLayoutStates: saveActivatedData.value[jobMaster.id].navigationFormLayoutStates,
                jobTransaction: saveActivatedData.value[jobMaster.id].navigationParams.jobTransaction,
                contactData: saveActivatedData.value[jobMaster.id].navigationParams.contactData,
                currentStatus: saveActivatedData.value[jobMaster.id].navigationParams.currentStatus
            }
        }
        else {
            navigationParams = {
                calledFromNewJob: true,
                jobMasterId: jobMaster.id,
                commonData: saveActivatedData.value[jobMaster.id].navigationParams.commonData,
                recurringData: saveActivatedData.value[jobMaster.id].navigationParams.recurringData,
                signOfData: saveActivatedData.value[jobMaster.id].navigationParams.signOfData,
                totalAmount: saveActivatedData.value[jobMaster.id].navigationParams.totalAmount,
                emailTableElement: saveActivatedData.value[jobMaster.id].navigationParams.emailTableElement,
                emailIdInFieldData: saveActivatedData.value[jobMaster.id].navigationParams.emailIdInFieldData,
                contactNumberInFieldData: saveActivatedData.value[jobMaster.id].navigationParams.contactNumberInFieldData
            }
        }
        return {
            screenName: screenName = saveActivatedData.value[jobMaster.id].screenName,
            navigationParams,
            stateParam
        }
    }
}

export let newJob = new NewJob()
