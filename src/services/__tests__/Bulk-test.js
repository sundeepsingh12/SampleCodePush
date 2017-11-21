'use strict'

import {
    bulkService
} from '../classes/Bulk'

import {
    jobMasterService
} from '../classes/JobMaster'


const jobStatusList = [{
    id: 1,
    jobMasterId: 1,
    code: 'UNSEEN',
    name: 'Unseen'
}, {
    id: 2,
    jobMasterId: 1,
    code: 'PENDING',
    name: 'Pending',
    nextStatusList: [{
        id: 3,
        jobMasterId: 1,
        code: 'Success',
        name: 'Success'
    }]
}]

const bulkConfigList = [{
    jobMasterName: 'A',
    id: 0,
    statusName: 'Pending',
    statusId: 2,
    nextStatusList: [{
        id: 3,
        jobMasterId: 1,
        code: 'Success',
        name: 'Success'
    }],
    jobMasterId: 1
}]

describe('test cases for prepareJobMasterVsStatusList', () => {
    it('should prepare job master vs status', () => {
        const jobMasterList = [{
            id: 1,
            title: 'A'
        }]

        jobMasterService.getIdJobMasterMap = jest.fn()
        jobMasterService.getIdJobMasterMap.mockReturnValue({
            1: {
                id: 1,
                title: 'A'
            }
        })

        bulkService._getJobMasterIdStatusNameList = jest.fn()
        bulkService._getJobMasterIdStatusNameList.mockReturnValue(bulkConfigList)

        expect(bulkService.prepareJobMasterVsStatusList(jobMasterList, jobStatusList)).toEqual(bulkConfigList)
    })
})

describe('test case for _getJobMasterIdStatusNameList', () => {
    it('should return bulk config list', () => {
        const idJobMasterMap = {
            1: {
                id: 1,
                title: 'A'
            }
        }
      expect(bulkService._getJobMasterIdStatusNameList(jobStatusList,idJobMasterMap)).toEqual(bulkConfigList)
    })
})