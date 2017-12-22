import {
    JOB_STATUS,
    TABLE_RUNSHEET,
    TABLE_JOB_TRANSACTION
  } from '../../lib/constants'
  
  import {
    keyValueDBService
  } from './KeyValueDBService'
  
  import * as realm from '../../repositories/realmdb'
  import {jobStatusService} from './JobStatus'
  import _ from 'lodash'
  
  class RunSheet {
  
    /**
     * 
     * @param {*} jobSummaries 
     */
    async updateRunSheetSummary() {
        let query = "deleteFlag != 1"
        const jobTransactionArray = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
        const allStatusIds = await jobStatusService.getStatusIdsForAllStatusCategory()
        const pendingStatusMap = this.idDtoMap(allStatusIds.pendingStatusIds)
        const runsheetArray = realm.getAll(TABLE_RUNSHEET)
        let runsheetList = {}

       runsheetArray.forEach(runsheetObject=>{
         const runsheetCLone = {...runsheetObject}
         runsheetCLone.pendingCount = 0
         runsheetList[runsheetObject.id]= {...runsheetCLone}
       })
        for (let index in jobTransactionArray) {
            if(pendingStatusMap[jobTransactionArray[index].jobStatusId] == 1 && (runsheetList[jobTransactionArray[index].runsheetId])){
            
             runsheetList[jobTransactionArray[index].runsheetId].pendingCount +=1
            }
        }
        const runsheets = {
            tableName: TABLE_RUNSHEET,
            value: Object.values(runsheetList)
          }

        realm.performBatchSave(runsheets)
         
    }

    idDtoMap(dtoList){
        const listMap = dtoList.reduce(function ( total, current ) {
            total[ current ] =  1
            return total;
        }, {});
        return listMap
      
    }
    /**A generic method for getting jobSummary from store given a particular jobStatusId and jobMasterId
     * 
     * @param {*} jobMasterId 
     * @param {*} statusId 
     * 
     * Sample Return Type
     * 
     * {
      * id: 2260120,
      * userId: 4957,
      * cityId: 744,
      * companyId: 295,
      * jobStatusId:4814,
      * count:1,
        date:'2017-06-26 00:00:00'
     * }
     */
  
  }
  
  export let runSheetService = new RunSheet()
  