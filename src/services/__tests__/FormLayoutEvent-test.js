'use strict'

import {
    ON_BLUR,
    TABLE_FIELD_DATA,
    TABLE_RUNSHEET
} from '../../lib/constants'

import {
    formLayoutEventsInterface
} from '../classes/formLayout/FormLayoutEventInterface'

import {jobStatusService} from '../classes/JobStatus'

import sha256 from 'sha256';

import {
  restAPI
} from '../../lib/RestAPI'

import moment from 'moment'

import {
    keyValueDBService
  } from '../classes/KeyValueDBService'

  import * as realm from '../../repositories/realmdb'
  
let formLayoutMap = new Map()
formLayoutMap.set(1, {
    label: "rr",
    subLabel: "d",
    helpText: "d",
    key: "d",
    required: true,
    hidden: false,
    attributeTypeId: 1,
    fieldAttributeMasterId: 1,
    positionId: 0,
    parentId: 0,
    showHelpText: false,
    editable: false,
    focus: true,
    validation: []
    
}).set(2, {
    label: "ds",
    subLabel: "d",
    helpText: "w",
    key: "dd",
    required: false,
    hidden: true,
    attributeTypeId: 1,
    fieldAttributeMasterId: 1,
    positionId: 0,
    parentId: 0,
    showHelpText: true,
    editable: false,
    focus: false,
    validation: []
});
let nextEditable = {
    1: ['required$$2']
}

describe('save events implementation', () => {
    it('should disable save if required with save disabled', () => {
        formLayoutEventsInterface.updateFieldInfo = jest.fn();
        expect(formLayoutEventsInterface.disableSaveIfRequired(1, true, formLayoutMap, "dd")).toEqual(true);
    })

    it('should disable save if required without save disabled', () => {
        formLayoutEventsInterface.updateFieldInfo = jest.fn();
        expect(formLayoutEventsInterface.disableSaveIfRequired(1, false, formLayoutMap, "dd")).toEqual(true);
    })

    it('should disable save if required without save disabled and not required element', () => {
        formLayoutEventsInterface.updateFieldInfo = jest.fn();
        expect(formLayoutEventsInterface.disableSaveIfRequired(2, false, formLayoutMap, "dd")).toEqual(false);
    })

    it('should disable save if required with save disabled and not required element', () => {
        formLayoutEventsInterface.updateFieldInfo = jest.fn();
        expect(formLayoutEventsInterface.disableSaveIfRequired(2, true, formLayoutMap, "dd")).toEqual(true);
    })

    it('not enable save with required element with no value', () => {
        formLayoutMap.get(Number(1)).value = undefined;
        expect(formLayoutEventsInterface._enableSave(formLayoutMap, nextEditable)).toEqual(false);
    })

    it('should enable save with required element with no value', () => {
        formLayoutMap.get(Number(1)).value = 'dd';
        expect(formLayoutEventsInterface._enableSave(formLayoutMap, nextEditable)).toEqual(true);

    })

    it('should not enable save with both required but 1 element with no value', () => {
        formLayoutMap.get(Number(2)).required = true;
        nextEditable = {
            1: ['required$$2'],
            2: []
        }
        expect(formLayoutEventsInterface._enableSave(formLayoutMap, nextEditable)).toEqual(false);
    })

    it('should enable save with both required with values', () => {
        formLayoutMap.get(Number(2)).value = 's';
        expect(formLayoutEventsInterface._enableSave(formLayoutMap, nextEditable)).toEqual(true);
    })

})

describe('update field info', () => {
    //TODO these all expect should be in a it function of jest
    expect(formLayoutEventsInterface.updateFieldData(1, "1", formLayoutMap, ON_BLUR).get(1).showCheckMark).toEqual(true);
    formLayoutMap.get(1).showCheckMark = false;
    expect(formLayoutEventsInterface.updateFieldData(1, "1", formLayoutMap, 'dd').get(1).showCheckMark).toEqual(false);
    expect(formLayoutEventsInterface.updateFieldData(1, "1", formLayoutMap, 'dd').get(1).value).toEqual("1");
    expect(formLayoutEventsInterface.updateFieldData(1, sha256("1"), formLayoutMap, 'dd').get(1).value).toEqual(sha256("1"));
})

describe('get sequence field data', () => {
    it('should not get data from server if id is null and throw error', () => {
    const message = 'masterId unavailable'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue('test')
      const sequenceId = null;
      formLayoutEventsInterface.getSequenceAttrData(sequenceId)
    } catch (error) {
      expect(error.message).toEqual(message)
    }
    })
    it('should not get data from server if id is undefined and throw error', () => {
    const message = 'masterId unavailable'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue('test')
      const sequenceId = undefined;
      formLayoutEventsInterface.getSequenceAttrData(sequenceId)
    } catch (error) {
      expect(error.message).toEqual(message)
    }
    })
      it('should not get data from server if token value is null and throw token error', () => {
    const message = 'Token Missing'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue(null)
      formLayoutEventsInterface.getSequenceAttrData()
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })
    
   it('should not get data from server if token value is undefined and throw token error', () => {
    const message = 'Token Missing'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue(undefined)
      formLayoutEventsInterface.getSequenceAttrData()
    } catch (error) {
      expect(error.message).toEqual(message)
    }
  })
it('should not get data from server and throw error', () => {
    const message = 'masterId unavailable'
    try {
      keyValueDBService.getValueFromStore = jest.fn()
      keyValueDBService.getValueFromStore.mockReturnValue('test')
      const sequenceId = null;
      formLayoutEventsInterface.getSequenceAttrData(sequenceId)
    } catch (error) {
      expect(error.message).toEqual(message)
    }
    })
it('should get sequence  data without error', () => {

        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
        value: 'testtoken'
        })
        restAPI.initialize = jest.fn()
        restAPI.serviceCall = jest.fn((data) => {
        return "Success"
        })
        const sequenceId = '4';
        return formLayoutEventsInterface.getSequenceAttrData(sequenceId).then(data => {
        expect(data).toEqual(null)
        expect(restAPI.initialize).toHaveBeenCalledTimes(1)
        expect(restAPI.serviceCall).toHaveBeenCalledTimes(1)
        })
    })
})

describe('toogle help text', () => {
    it('should toogle help text to true when undefined', () => {
        formLayoutMap.get(1).showHelpText = undefined;
        expect(formLayoutEventsInterface.toogleHelpTextView(1, formLayoutMap).get(1).showHelpText).toEqual(true); // initially it is false, so its toogle is true
    })
    it('should toogle help text to true when false', () => {
        formLayoutMap.get(1).showHelpText = false;
        expect(formLayoutEventsInterface.toogleHelpTextView(1, formLayoutMap).get(1).showHelpText).toEqual(true);
    })
    it('should toogle help text to false when true', () => {
        formLayoutMap.get(1).showHelpText = true;
        expect(formLayoutEventsInterface.toogleHelpTextView(1, formLayoutMap).get(1).showHelpText).toEqual(false);
    })
})

describe('add transaction to sync list',()=>{
    it('should create pending sync list',()=>{
        let transactionIdsToSync = [1];
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(null);
        keyValueDBService.validateAndSaveData = jest.fn();
        formLayoutEventsInterface.addTransactionsToSyncList(1).then((idList)=>{
            expect(idList).toEqual(transactionIdsToSync);
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1);
        })
        
    })

    it('should add to pending sync list',()=>{
        let transactionIdsToSync = [1,2];
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue([1]);
        keyValueDBService.validateAndSaveData = jest.fn();
        formLayoutEventsInterface.addTransactionsToSyncList(2).then((idList)=>{
            expect(idList).toEqual(transactionIdsToSync);
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(keyValueDBService.validateAndSaveData).toHaveBeenCalledTimes(1);
        })
        
    })
})

describe('update jobSummary data ',()=>{
    const jobSummary = { value:[
           {
            id: 2260120,
            userId: 4957,
            hubId: 2759,
            cityId: 744,
            companyId: 295,
            jobStatusId:4814,
            count:1,
           },
           {
            id: 2260121,
            userId: 4957,
            hubId: 2759,
            cityId: 744,
            companyId: 295,
            jobStatusId:4815,
            count:2,
           }
    ]}

    let jobTransaction = {
        id:1,
        jobId:2,
        jobMasterId:3,
        jobStatusId:4814,
        referenceNumber:"abc123",
        runsheetNo:"aks",
        runsheetId:1234,
        seqSelected:2,
       }
       let nextStatusId = 4815;

    let newJobSummary  = { value:[
        {
         id: 2260120,
         userId: 4957,
         hubId: 2759,
         cityId: 744,
         companyId: 295,
         jobStatusId:4814,
         count:0,
        },
        {
         id: 2260121,
         userId: 4957,
         hubId: 2759,
         cityId: 744,
         companyId: 295,
         jobStatusId:4815,
         count:3,
        }
 ]}

    it('should update job summary',()=>{
        keyValueDBService.getValueFromStore = jest.fn();
        keyValueDBService.getValueFromStore.mockReturnValue(jobSummary);
        keyValueDBService.validateAndUpdateData = jest.fn();
        formLayoutEventsInterface._updateJobSummary(jobTransaction,nextStatusId,null).then((idList)=>{
            expect(idList).toEqual(newJobSummary);
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1);
            expect(keyValueDBService.validateAndUpdateData).toHaveBeenCalledTimes(1);
        })
        
    })
})

describe('update Runsheet Summary data ',()=>{
    const runsheetSummary =[
           {
            id: 2260,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "1",
            pendingCount:0,
            successCount: 2,
            failCount: 0
           },
           {
            id: 2261,
            userId: 4957,
            hubId: 2759,
            runsheetNumber: "2",
            pendingCount:1,
            successCount: 0,
            failCount: 0
           },
    ]

    let jobTransaction = {
        id:1,
        jobId:2,
        jobMasterId:3,
        jobStatusId:4814,
        referenceNumber:"abc123",
        runsheetNo:"2",
        runsheetId:2261,
        seqSelected:2,
       }
    let nextStatusCategory = 3, prevStatusCategory = 1;

    const newRunsheetList =[
        {
         id: 2260,
         userId: 4957,
         hubId: 2759,
         runsheetNumber: "1",
         pendingCount:0,
         successCount: 2,
         failCount: 0
        },
        {
         id: 2261,
         userId: 4957,
         hubId: 2759,
         runsheetNumber: "2",
         pendingCount:0,
         successCount: 1,
         failCount: 0
        },
 ]

 let data = {
     tableName: TABLE_RUNSHEET,
     value: newRunsheetList
     }

    it('should update runsheet summary',()=>{
        jobStatusService.getStatusCategoryOnStatusId = jest.fn();
        jobStatusService.getStatusCategoryOnStatusId.mockReturnValue(prevStatusCategory);
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(runsheetSummary);
        keyValueDBService.validateAndUpdateData = jest.fn();
        formLayoutEventsInterface._updateRunsheetSummary(jobTransaction,nextStatusCategory,null).then((idList)=>{
            expect(idList).toEqual(data);
            expect(jobStatusService.getStatusCategoryOnStatusId).toHaveBeenCalledTimes(1);
            expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1);
        })
        
    })
})



describe('save data to db',()=>{
    it('should save field data',()=>{
        let childDataList = [
            {
              value: 3,
              jobTransactionId: 5,
              positionId: 3,
              parentId: 0,
              fieldAttributeMasterId: 1,
              childDataList: [
                {
                  value: 4,
                  jobTransactionId: 5,
                  positionId: 4,
                  parentId: 0,
                  fieldAttributeMasterId: 1
                },
                {
                  value: 5,
                  jobTransactionId: 5,
                  positionId: 5,
                  parentId: 0,
                  fieldAttributeMasterId: 1,
                  childDataList: [
                    {
                      value: 6,
                      jobTransactionId: 5,
                      positionId: 6,
                      parentId: 0,
                      fieldAttributeMasterId: 1
                    },
                    {
                      value: 7,
                      jobTransactionId: 5,
                      positionId: 7,
                      parentId: 0,
                      fieldAttributeMasterId: 1,
                      childDataList : []
                    }
                  ]
                }
              ]
            },
            {
              value: 8,
              jobTransactionId: 5,
              positionId: 8,
              parentId: 0,
              fieldAttributeMasterId: 1
            }
          ]

          let fieldDataArray = [
            {
                id : 2, 
                value : 'dd',
                jobTransactionId : 5,
                positionId : 0,
                parentId : 0,
                fieldAttributeMasterId : 1
            }  
            ,{
                id : 3, 
                value : 3,
                jobTransactionId : 5,
                positionId : 3,
                parentId : 0,
                fieldAttributeMasterId : 1
            },
            {
                id : 4, 
                value : 4,
                jobTransactionId : 5,
                positionId : 4,
                parentId : 0,
                fieldAttributeMasterId : 1
            },
            {
                id : 5, 
                value : 5,
                jobTransactionId : 5,
                positionId : 5,
                parentId : 0,
                fieldAttributeMasterId : 1
            },
            {
                id :6, 
                value : 6,
                jobTransactionId : 5,
                positionId : 6,
                parentId : 0,
                fieldAttributeMasterId : 1
            },
            {
                id : 7, 
                value : 7,
                jobTransactionId : 5,
                positionId : 7,
                parentId : 0,
                fieldAttributeMasterId : 1
            },
            {
                id : 8, 
                value : 8,
                jobTransactionId : 5,
                positionId : 8,
                parentId : 0,
                fieldAttributeMasterId : 1
            },
            {
                id : 9, 
                value : 's',
                jobTransactionId : 5,
                positionId : 0,
                parentId : 0,
                fieldAttributeMasterId : 1
            }
            
        ];
          formLayoutMap.get(1).childDataList = childDataList;
          formLayoutMap.get(1).value = 'dd';
          formLayoutEventsInterface._saveFieldData(formLayoutMap,1);
          realm.getRecordListOnQuery = jest.fn();
          realm.getRecordListOnQuery.mockReturnValue([{}]);;
          expect(formLayoutEventsInterface._saveFieldData(formLayoutMap,5)).toEqual({
            tableName: TABLE_FIELD_DATA,
            value: fieldDataArray
        })
    })

    it('should save data in db', ()=>{
        formLayoutEventsInterface._getDbObjects = jest.fn();
        formLayoutEventsInterface._getDbObjects.mockReturnValue({
            jobTransaction : {
                jobId : 1
            },
            user : {
                employeeCode : 1234
            },
            hub : {
                code : 1
            },
            imei : {
                imeiNumber : 12345
            },
            jobMaster : [
                {
                    code : 'jobMaster'
                }
            ],
            status : [
                {
                    id : 1,
                    code : 'success',
                    actionOnStatus : 3
                }
            ]
        })

        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue({
            job : {

            }
        })
        realm.performBatchSave = jest.fn();
        formLayoutEventsInterface.saveDataInDb(formLayoutMap,5,1);
    })
})

describe('find next focusable and editable elements',()=>{
    it('when both elements are required and current element is last element',()=>{
        let formLayoutObject = new Map(formLayoutMap);
        formLayoutObject.get(2).value = 'a';
        let isSaveDisabled = false;
        expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(2,formLayoutObject,nextEditable,true,'a')).toEqual({
            formLayoutObject,
            nextEditable,
            isSaveDisabled
        });
    })

    it('when both elements are required and current element is not last element',()=>{
        let formLayoutObject = new Map(formLayoutMap);
        formLayoutObject.get(2).value = null;
        formLayoutObject.get(2).focus = true;
        formLayoutObject.get(2).editable = true;
        let isSaveDisabled = true;
        const expectedObject = {formLayoutObject,nextEditable,isSaveDisabled}
        expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(1,formLayoutObject,nextEditable,true,'a')).toEqual(expectedObject);
    })

    it('when both elements are required and other required does not contain value',()=>{
        let formLayoutObject = new Map(formLayoutMap);
        formLayoutObject.get(2).value = 'a';
        formLayoutObject.get(1).value = null;
        let isSaveDisabled = true;
        expect(formLayoutEventsInterface.findNextFocusableAndEditableElement(2,formLayoutObject,nextEditable,true,'a')).toEqual({
            formLayoutObject,
            nextEditable,
            isSaveDisabled
        });
    })
})