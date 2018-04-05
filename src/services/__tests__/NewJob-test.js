'use strict'

import { newJob } from '../classes/NewJob'
import {
    keyValueDBService
} from '../classes/KeyValueDBService'

describe('get next pending status for job master with id', () => {
    it('should not get next status for pending status with negative id', () => {
        try {
            let pendingStatusList = [{ jobMasterId: 1, code: 'unseen' }]
            keyValueDBService.getValueFromStore = jest.fn();
            keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
            newJob.getNextPendingStatusForJobMaster(1);
        } catch (error) {
            expect(error.message).toEqual('configuration issues with PENDING status');
        }
    })

    it('should not get next status for pending status with negative id', () => {
        try {
            let pendingStatusList = [{ jobMasterId: 1, code: 'PENDING' }, { jobMasterId: 2, code: 'PENDING' }]
            keyValueDBService.getValueFromStore = jest.fn();
            keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
            newJob.getNextPendingStatusForJobMaster(1);
        } catch (error) {
            expect(error.message).toEqual('configuration issues with PENDING status');
        }
    })

    it('should  get next status for pending status with negative id with mocks', () => {
        let pendingStatusList = [{ jobMasterId: 1, code: 'PENDING' }, { jobMasterId: 2, code: 'UNSEEN' }]
        let nextPendingStatus = [{ id: 2, name: 'test' }, { id: 3, name: 'test1', transient: false }];
        let negativeId = -1
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
        newJob._getNextStatusForPendingStatus = jest.fn();
        newJob._getNextStatusForPendingStatus.mockReturnValue(nextPendingStatus);
        newJob.getNextPendingStatusForJobMaster(1).then((res) => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(res).toEqual({ nextPendingStatus, negativeId });

        })
    })

    it('should get next status for pending status with negative id without mocks', () => {
        let pendingStatusList = [{ jobMasterId: 1, code: 'PENDING', nextStatusList: ['ds'] }, { jobMasterId: 2, code: 'UNSEEN' }]
        let nextPendingStatus = ['ds'];
        let negativeId = -1
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
        newJob.getNextPendingStatusForJobMaster(1).then((res) => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(res).toEqual({ nextPendingStatus, negativeId });

        })
    })
})