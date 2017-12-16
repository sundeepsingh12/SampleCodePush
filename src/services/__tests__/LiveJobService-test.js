'use strict'

import { liveJobService } from '../classes/LiveJobService'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    TABLE_JOB,
    TABLE_JOB_DATA
} from '../../lib/constants'
import { jobTransactionService } from '../classes/JobTransaction'
import {
    transactionCustomizationService
} from '../classes/TransactionCustomization'
import * as realm from '../../repositories/realmdb'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
describe('test cases for checkJobExpiry', () => {

    it('should return empty list for undefined ', () => {
        liveJobService.checkJobExpiry(undefined).then(() => {
            expect(result).toEqual({})
        })
    })

    it('should return empty list for empty map', () => {
        liveJobService.checkJobExpiry({}).then(() => {
            expect(result).toEqual({})
        })
    })

    it('should return live job map for no expired jobs', () => {

        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            },
            1: {
                id: 1,
                jobEndTime: '02:00:00'
            }
        }
        liveJobService.checkJobExpiry(liveJobMap).then(() => {
            expect(result).toEqual(liveJobMap)
        })
    })

    it('should return 1 job for livejob map', () => {

        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            },
            1: {
                id: 1,
                jobEndTime: '12:30:00'
            }
        }
        liveJobService.deleteJob = jest.fn()
        liveJobService.deleteJob.mockReturnValue({})

        return liveJobService.checkJobExpiry(liveJobMap).then((result) => {
            expect(liveJobService.deleteJob).toHaveBeenCalledTimes(1)
            expect(result).toEqual({})
        })
    })
})
describe('test cases for requestServerForApproval', () => {

    it('should accept live job', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        return liveJobService.requestServerForApproval(1, 'test', liveJobMap).then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
})

describe('test cases for getSelectedJobIds', () => {

    it('should return empty job Ids list', () => {
        let jobs = [
            {
                id: 0,
                jobTransactionCustomization: {
                    isChecked: false
                }
            }
        ]
        expect(liveJobService.getSelectedJobIds(jobs)).toEqual([])
    })
    it('should return job Ids list', () => {
        let jobs = [
            {
                id: 0,
                jobTransactionCustomization: {
                    isChecked: true
                }
            }
        ]
        let jobIds = [0]
        expect(liveJobService.getSelectedJobIds(jobs)).toEqual(jobIds)
    })
})

describe('test cases for deleteJob', () => {

    it('should delete job from db', () => {
        let jobIdList = [0]
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        realm.deleteRecordsInBatch = jest.fn()
        return liveJobService.deleteJob(jobIdList, liveJobMap).then((data) => {
            expect(realm.deleteRecordsInBatch).toHaveBeenCalledTimes(1)
            expect(data).toEqual([])
        })
    })
})