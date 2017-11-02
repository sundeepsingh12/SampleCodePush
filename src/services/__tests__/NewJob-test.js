'use strict'

import {newJob} from '../classes/NewJob'
import {
    keyValueDBService
  } from '../classes/KeyValueDBService'

import * as realm from '../../repositories/realmdb'
  
describe('get masters for new job',()=>{
    it('should get job masters for new job  with new job available',()=>{
        let jobMasters = [{'id':1,"allowAddNew":true},{"id":2,"allowAddNew":false}]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(jobMasters);
        newJob.getMastersWithNewJob().then((jobMasterList)=>{
            expect(jobMasterList).toEqual([{'id':1,"allowAddNew":true}]);
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
        })
    })

    it('should get job masters for new job  without new job available',()=>{
        let jobMasters = [{'id':1,"allowAddNew":false},{"id":2,"allowAddNew":false}]
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(jobMasters);
        newJob.getMastersWithNewJob().then((jobMasterList)=>{
            expect(jobMasterList).toEqual([]);
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
        })
    })
})


describe('get next pending status for job master',()=>{
    it('should get next status for pending status with transient available',()=>{
        let pendingStatus = {
            id:1,
            nextStatusList:[
                {
                    id:2,
                    name : 'test',
                    transient : true,
                    nextStatusList : [{id:4,name:'test2'}]
                },
                {
                    id:3,
                    name : 'test1',
                    transient : false
                }
            ]
        }
        expect(newJob._getNextStatusForPendingStatus(pendingStatus)).toEqual([{id:4,name:'test2'},{id:3,name:'test1',transient:false}]) 
    })

    it('should get next status for pending status without transient',()=>{
        let pendingStatus = {
            id:1,
            nextStatusList:[
                {
                    id:2,
                    name : 'test'
                },
                {
                    id:3,
                    name : 'test1',
                    transient : false
                }
            ]
        }
        expect(newJob._getNextStatusForPendingStatus(pendingStatus)).toEqual([{id:2,name:'test'},{id:3,name:'test1',transient:false}]) 
    })    

    it('should not get next status',()=>{
        try{
            newJob._getNextStatusForPendingStatus()
        }catch(error){
            expect(error.message).toEqual('configuration issues with PENDING status');
        }
    })    
})

describe('get negative id',()=>{
    it('should get negative id with no existing job available',()=>{
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([]);
        expect(newJob._getNegativeId()).toEqual(-1);
    })

    it('should get negative id with job available',()=>{
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{}]);
        expect(newJob._getNegativeId()).toEqual(-2);
    })
})

describe('get next pending status for job master with id',()=>{
    it('should not get next status for pending status with negative id',()=>{
        try{
            let pendingStatusList = [{jobMasterId:1,code:'unseen'}]
            keyValueDBService.getValueFromStore = jest.fn();
            keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
            newJob.getNextPendingStatusForJobMaster(1);
        }catch(error){
            expect(error.message).toEqual('configuration issues with PENDING status');
        }
    })

    it('should not get next status for pending status with negative id',()=>{
        try{
            let pendingStatusList = [{jobMasterId:1,code:'PENDING'},{jobMasterId:2,code:'PENDING'}]
            keyValueDBService.getValueFromStore = jest.fn();
            keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
            newJob.getNextPendingStatusForJobMaster(1);
        }catch(error){
            expect(error.message).toEqual('configuration issues with PENDING status');
        }
    })

    it('should  get next status for pending status with negative id with mocks',()=>{
        let pendingStatusList = [{jobMasterId:1,code:'PENDING'},{jobMasterId:2,code:'UNSEEN'}]
        let nextPendingStatus = [{id:2,name:'test'},{id:3,name:'test1',transient:false}];
        let negativeId = -1
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
        newJob._getNextStatusForPendingStatus = jest.fn();
        newJob._getNextStatusForPendingStatus.mockReturnValue(nextPendingStatus);
        newJob._getNegativeId = jest.fn();
        newJob._getNegativeId.mockReturnValue(-1);
        newJob.getNextPendingStatusForJobMaster(1).then((res)=>{
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(res).toEqual({nextPendingStatus,negativeId});
        
        })
    })

    it('should get next status for pending status with negative id without mocks',()=>{
        let pendingStatusList = [{jobMasterId:1,code:'PENDING',nextStatusList:['ds']},{jobMasterId:2,code:'UNSEEN'}]
        let nextPendingStatus = ['ds'];
        let negativeId = -1
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(pendingStatusList);
        newJob._getNegativeId = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{}]);
        newJob.getNextPendingStatusForJobMaster(1).then((res)=>{
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(res).toEqual({nextPendingStatus,negativeId});
        
        })
    })
})