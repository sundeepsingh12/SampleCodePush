import {
    JOB_STATUS,
    TABLE_RUNSHEET
  } from '../../lib/constants'
  
  import {
    keyValueDBService
  } from './KeyValueDBService'
  
  import _ from 'underscore'
  import * as realm from '../../repositories/realmdb'
  
  class RunSheet {
  
    /**
     * 
     * @param {*} jobSummaries 
     */
    async updateRunSheetSummary(unseenTransactions,transactionIdDtos) {
        const setRunsheetSummary = [] , propertyList = {}
        let count = {}
        const status = ['pendingCount','failCount','successCount']        
        const jobStatusArray = await keyValueDBService.getValueFromStore(JOB_STATUS)  
        let   idCategoryMap = this.idDtoMap(jobStatusArray.value, 'statusCategory') 
        const unseenCategoryMap = {} 
        transactionIdDtos.forEach(id => unseenCategoryMap[id.unSeenStatusId] = idCategoryMap[id.pendingStatusId]) 
        for (item in unseenTransactions){
            setRunsheetSummary.push(unseenTransactions[item].runsheetId)
            propertyList[unseenTransactions[item].runsheetId] = status[unseenCategoryMap[unseenTransactions[item].jobStatusId]-1];
            (count[unseenTransactions[item].runsheetId] != undefined) ? count[unseenTransactions[item].runsheetId] += 1 : count[unseenTransactions[item].runsheetId] = 1;
        }
        realm.updateRecordOnMultipleProperty(TABLE_RUNSHEET,setRunsheetSummary,propertyList,count)    
    }

    idDtoMap(dtoList,property){
        const listMap = dtoList.reduce(function ( total, current ) {
            total[ current.id ] =  current[property]
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
  