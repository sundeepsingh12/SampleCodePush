import {
  TABLE_RUNSHEET,
  TABLE_JOB_TRANSACTION,
  USER_SUMMARY
} from '../../lib/constants'

import * as realm from '../../repositories/realmdb'
import {
  jobStatusService
} from './JobStatus'
import {
  RUNSHEET_MISSING
} from '../../lib/ContainerConstants'
import {keyValueDBService} from './KeyValueDBService'

class RunSheet {

  /**
   * 
   * @param {*} jobSummaries 
   */
  async updateRunSheetAndUserSummary() {
    let query = "deleteFlag != 1";
    const status = ['pendingCount','failCount','successCount']
    const jobTransactionArray = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
    const allStatusIds = await jobStatusService.getStatusIdsForAllStatusCategory()
    const pendingStatusMap = this.idDtoMap(allStatusIds.pendingStatusIds, 1)
    const failStatusMap = this.idDtoMap(allStatusIds.failStatusIds, 2)
    const successStatusMap = this.idDtoMap(allStatusIds.successStatusIds, 3)
    let allStatusMap =  { ...pendingStatusMap, ...failStatusMap, ...successStatusMap};
    const runsheetArray = realm.getRecordListOnQuery(TABLE_RUNSHEET)
    let runsheetList = {}
    let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY) 
    runsheetArray.forEach(runsheetObject => {
      const runsheetCLone = { ...runsheetObject } 
      runsheetCLone.pendingCount = 0 ; runsheetCLone.failCount = 0 ; runsheetCLone.successCount = 0 ;
      runsheetList[runsheetObject.id] = { ...runsheetCLone }
    })
    let pendingCount = 0,failCount = 0,successCount = 0,allCount = [0,0,0]
    for (let index in jobTransactionArray) {
      allCount[allStatusMap[jobTransactionArray[index].jobStatusId]-1]  += 1
      if (allStatusMap[jobTransactionArray[index].jobStatusId] && (runsheetList[jobTransactionArray[index].runsheetId])) {
        runsheetList[jobTransactionArray[index].runsheetId][status[allStatusMap[jobTransactionArray[index].jobStatusId] -1 ]] += 1
      }
    }
    if(userSummary && userSummary.value){
        userSummary["value"][status[0]] = allCount[0], userSummary["value"][status[1]] = allCount[1], userSummary["value"][status[2]] = allCount[2]
    }
    await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)    
    const runsheets = {
      tableName: TABLE_RUNSHEET,
      value: Object.values(runsheetList)
    }
    realm.performBatchSave(runsheets)
  }

  idDtoMap(dtoList, value) {
    const listMap = dtoList.reduce(function (total, current) {
      total[current] = value
      return total;
    }, {});
    return listMap

  }

  getRunsheets() {
    const runsheetArray = realm.getRecordListOnQuery(TABLE_RUNSHEET)
    let runsheetNumberList = []
    runsheetArray.forEach(runsheetObject => {
        const runsheetClone = { ...runsheetObject }
        runsheetNumberList.push(runsheetClone.runsheetNumber)
    })
    if (_.isEmpty(runsheetNumberList)) {
        throw new Error(RUNSHEET_MISSING)
    }
    return runsheetNumberList
}
  getOpenRunsheets() {
    let runSheetQuery = `isClosed = false`
    const runsheetArray = realm.getRecordListOnQuery(TABLE_RUNSHEET, runSheetQuery)
    let runsheetNumberList = []
    runsheetArray.forEach(runsheetObject => {
      runsheetNumberList.push({ ...runsheetObject })
    })
    return runsheetNumberList
  }

}

export let runSheetService = new RunSheet()