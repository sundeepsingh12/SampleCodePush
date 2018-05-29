'use strict'

import RestAPIFactory from '../../lib/RestAPIFactory';
import { liveJobService } from '../classes/LiveJobService';
import moment from 'moment'


describe('test cases for checkJobExpiry', () => {

    it('should return empty list for undefined ', () => {
        expect(liveJobService.checkJobExpiry(undefined)).toEqual({})
    })

    it('should return empty list for empty map', () => {
        expect(liveJobService.checkJobExpiry({})).toEqual({})
    })

    // it('should return live job map for no expired jobs', () => {

    //     let jobEndTime = moment().format('hh:mm')
    //     let liveJobMap = {
    //         0: {
    //             id: 0,
    //             jobEndTime
    //         },
    //         1: {
    //             id: 1,
    //             jobEndTime
    //         }
    //     }
    //     expect(liveJobService.checkJobExpiry(liveJobMap)).toEqual(liveJobMap)
    // })

    // it('should return 1 job for livejob map', () => {

    //     let liveJobMap = {
    //         0: {
    //             id: 0,
    //             jobEndTime: '01:00:00'
    //         },
    //         1: {
    //             id: 1,
    //             jobEndTime: '12:30:00'
    //         }
    //     }
    //     liveJobService.deleteJob = jest.fn()
    //     liveJobService.deleteJob.mockReturnValue({})

    //     expect(liveJobService.checkJobExpiry(liveJobMap)).toEqual({})
    // })
})
describe('test cases for requestServerForApproval', () => {

    it('should accept live job', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 200,
            _bodyText: 'success'
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApproval(1, 'test', job, liveJobMap).then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
    it('should accept live job and fail', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 200,
            _bodyText: 'failed'
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApproval(1, 'test', job, liveJobMap).then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
    it('should reject live job and fail', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 200,
            _bodyText: 'failed'
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApproval(2, 'test', job, liveJobMap).then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
    it('should reject live job', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 200,
            _bodyText: 'success'
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApproval(2, 'test', job, liveJobMap).then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
    it('api response should be status 400', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 400,
            _bodyText: 'failed'
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApproval(2, 'test', job, liveJobMap).then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
})

describe('test cases for getSelectedJobIds', () => {

    it('should return empty job Ids list', () => {
        let jobs = [
            {
                id: 0,
                isChecked: false

            }
        ]
        expect(liveJobService.getSelectedJobIds(jobs)).toEqual([])
    })
    it('should return job Ids list', () => {
        let jobs = [
            {
                id: 0,
                isChecked: true
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
        expect(liveJobService.deleteJob(jobIdList, liveJobMap)).toEqual({});

    })
})

describe('test cases for requestServerForApprovalForMultiple', () => {

    it('should accept live job', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 200,
            _bodyText: 'success',
            json: {
                successCount: 1
            }
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApprovalForMultiple(1, [0], liveJobMap, 'test').then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
    it('should reject live job', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 200,
            _bodyText: 'success',
            json: {
                failCount: 1
            }
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApprovalForMultiple(2, [0], liveJobMap, 'test').then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
    it('should reject live job and get status other than 200', () => {
        let liveJobMap = {
            0: {
                id: 0,
                jobEndTime: '01:00:00'
            }
        }
        let serviceAlertResponse = {
            status: 400,
            _bodyText: 'success',
            json: {
                failCount: 1
            }
        }
        let job = {
            id: 1,
            jobStartTime: 'x'
        }
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(serviceAlertResponse);
        return liveJobService.requestServerForApprovalForMultiple(2, [0], liveJobMap, 'test').then((data) => {
            expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
        })
    })
})