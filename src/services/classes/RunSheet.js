import {
  TABLE_RUNSHEET,
  TABLE_JOB_TRANSACTION
} from '../../lib/constants'

import * as realm from '../../repositories/realmdb'
import {
  jobStatusService
} from './JobStatus'

class RunSheet {

  /**
   * 
   * @param {*} jobSummaries 
   */
  async updateRunSheetSummary() {
    let query = "deleteFlag != 1";
    const status = ['pendingCount','failCount','successCount']
    const jobTransactionArray = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
    const allStatusIds = await jobStatusService.getStatusIdsForAllStatusCategory()
    const pendingStatusMap = this.idDtoMap(allStatusIds.pendingStatusIds, 1)
    const failStatusMap = this.idDtoMap(allStatusIds.failStatusIds, 2)
    const successStatusMap = this.idDtoMap(allStatusIds.successStatusIds, 3)
    let allStatusMap =  { ...pendingStatusMap, ...failStatusMap, ...successStatusMap};
    const runsheetArray = realm.getAll(TABLE_RUNSHEET)
    let runsheetList = {}
    runsheetArray.forEach(runsheetObject => {
      const runsheetCLone = { ...runsheetObject } 
      runsheetCLone.pendingCount = 0 ; runsheetCLone.failCount = 0 ; runsheetCLone.successCount = 0 ;
      runsheetList[runsheetObject.id] = { ...runsheetCLone }
    })
    for (let index in jobTransactionArray) {
      if (allStatusMap[jobTransactionArray[index].jobStatusId] && (runsheetList[jobTransactionArray[index].runsheetId])) {
        runsheetList[jobTransactionArray[index].runsheetId][status[allStatusMap[jobTransactionArray[index].jobStatusId] -1 ]] += 1
      }
    }
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

}

export let runSheetService = new RunSheet()