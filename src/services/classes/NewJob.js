const {
    JOB_MASTER,
    JOB_STATUS,
    PENDING,
    TABLE_JOB
} = require('../../lib/constants').default

import {keyValueDBService} from './KeyValueDBService.js'
import * as realm from '../../repositories/realmdb'


class NewJob {

    async getMastersWithNewJob(){
        const jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER);
        return jobMasters.value.filter(jobMaster => jobMaster.allowAddNew);
    }

    async getNextPendingStatusForJobMaster(jobMasterId){
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS);
        const pendingStatusList = statusList.value.filter(status => status.jobMasterId == jobMasterId && status.code == PENDING);
        if(!pendingStatusList || pendingStatusList.length == 0 || pendingStatusList.length > 1){
            throw new Error('configuration issues with PENDING status'); // there should be exactly 1 status in PENDING
        }
        let nextPendingStatus = this._getNextStatusForPendingStatus(pendingStatusList[0]);
        let negativeId = this._getNegativeId();
        return {
            nextPendingStatus,
            negativeId
        }
    }

    _getNextStatusForPendingStatus(pendingStatus){
        if(!pendingStatus || !pendingStatus.nextStatusList){
            throw new Error('configuration issues with PENDING status')
        }
        let nextStatusList = [];
        for(let i = 0; i< pendingStatus.nextStatusList.length; i++){
            let nextStatus = pendingStatus.nextStatusList[i];
            if(nextStatus && nextStatus.transient){
                //TODO not handled for transient status, if current status is transient then add their next status at the moment
                //TODO chane this logic in future
                nextStatusList = nextStatusList.concat(nextStatus.nextStatusList); // push next status of transient status
                pendingStatus.nextStatusList.splice(i,1)// remove transient from array, to avoid being added again in the list
            }
        }
        return nextStatusList.concat(pendingStatus.nextStatusList); // add next status of pending status to nextStatus list
    }

     _getNegativeId(){
        let jobId = realm.getRecordListOnQuery(TABLE_JOB, null, false).length;
        return (-jobId -1);
    }
}

export let newJob = new NewJob()
