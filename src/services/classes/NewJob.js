import {
    JOB_MASTER,
    JOB_STATUS,
    PENDING,
    TABLE_JOB,
    NewJobStatus
} from '../../lib/constants'

import { keyValueDBService } from './KeyValueDBService.js'
import * as realm from '../../repositories/realmdb'
import _ from 'lodash'


class NewJob {

    async getMastersWithNewJob() {
        const jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER);
        return jobMasters.value.filter(jobMaster => jobMaster.allowAddNew);
    }

    getMastersFromMasterIds(jobMasters, jobMasterIds) {
        if (!jobMasters) {
            throw new Error('configuration issues with job master')
        }
        if (!jobMasterIds) {
            throw new Error('configuration issues with next status in job master')
        }
        return jobMasters.filter(jobMaster => _.indexOf(jobMasterIds, jobMaster.id) >= 0 && jobMaster.allowAddNew)
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
        if (!saveActivatedData || !saveActivatedData.value[jobMaster.id]) {
            return {
                screenName: NewJobStatus,
                jobMaster
            }
        } else {
            return {
                screenName: saveActivatedData.value[jobMaster.id].screenName,
                saveActivatedState: saveActivatedData.value[jobMaster.id].saveActivatedState,
                navigationParams: saveActivatedData.value[jobMaster.id].navigationParams,
                navigationFormLayoutStates: saveActivatedData.value[jobMaster.id].navigationFormLayoutStates
            }
        }
    }
}

export let newJob = new NewJob()
