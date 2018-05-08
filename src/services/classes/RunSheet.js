import {
  TABLE_RUNSHEET,
  TABLE_JOB_TRANSACTION,
  USER_SUMMARY,
  JOB_MASTER
} from '../../lib/constants'

import * as realm from '../../repositories/realmdb'
import {
  jobStatusService
} from './JobStatus'
import {
  RUNSHEET_MISSING
} from '../../lib/ContainerConstants'
import { keyValueDBService } from './KeyValueDBService'
import { userSummaryService } from './UserSummary';
import { jobSummaryService } from './JobSummary'
import _ from 'lodash'
class RunSheet {

  /**@function updateRunSheetAndUserSummary()
    * 
    * function update RunSheet and UserSummary db count
    * 
    *@description => first calculate jobTransactionList on selected jobMaster and runsheetList
    *                create map of all status List
    *                then, calculate for runsheet count on jobTransaction and status map
    *                finally save the updated runSheetData in Db
    */

  async updateRunSheetUserAndJobSummary() {
    let jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
    let runsheetQuery = 'isClosed = true'// check for closed runsheet
    const runsheetList = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery)
    let runSheetIdListQuery = runsheetList.map((runsheet) => `runsheetId != ${runsheet.id}`).join(' AND ') // runSheet query for closed runsheet
    let jobMasterQuery = (jobMasterList && jobMasterList.value) ? jobMasterList.value.map(jobMasterId => 'jobMasterId = ' + jobMasterId.id).join(' OR ') : '' // query for selected jobMaster
    jobMasterQuery = jobMasterQuery && jobMasterQuery.trim() !== '' ? `deleteFlag != 1 AND (${jobMasterQuery})` : "deleteFlag != 1"
    jobMasterQuery = runSheetIdListQuery && runSheetIdListQuery.trim() !== '' ? `(${jobMasterQuery}) AND (${runSheetIdListQuery})` : jobMasterQuery
    const jobTransactionArray = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, jobMasterQuery) // all jobTransaction List
    const { allStatusMap } = await jobStatusService.getStatusIdsForAllStatusCategory() //all status (pending, fail, success) map
    const runsheetListData = await this.buildRunSheetListAndUpdateJobAndUserSummary(jobTransactionArray, allStatusMap) // runSheet List Data for insertion in Db   
    const runsheets = {
      tableName: TABLE_RUNSHEET,
      value: runsheetListData
    }
    realm.performBatchSave(runsheets)
  }

  /**@function buildRunSheetListAndUpdateUserSummary(jobTransactionArray,allStatusMap)
    * 
    * function return updated runSheetList count and update userSummary count
    * 
    *@param {Array} jobTransactionArray // all jobTransactions
    *@param {Object} allStatusMap // map of all status id and status category
    *
    *@return {runsheetList} // array of runSheet List 
    *
    */

  async buildRunSheetListAndUpdateJobAndUserSummary(jobTransactionArray, allStatusMap) {
    let runsheetList = {}, allCount = [0, 0, 0], statusCountMap = {}
    const runsheetArray = realm.getRecordListOnQuery(TABLE_RUNSHEET) // all runSheet List 
    const status = ['pendingCount', 'failCount', 'successCount']
    runsheetArray.forEach(runsheetObject => {
      const runsheetCLone = { ...runsheetObject }
      runsheetCLone.pendingCount = runsheetCLone.failCount = runsheetCLone.successCount = 0
      runsheetList[runsheetObject.id] = { ...runsheetCLone }
    }) // map of runSheetId and runSheet 
    for (let index in jobTransactionArray) {
      allCount[allStatusMap[jobTransactionArray[index].jobStatusId] - 1] += 1  //  array of pending fail and success count
      if ((runsheetList[jobTransactionArray[index].runsheetId] && allStatusMap[jobTransactionArray[index].jobStatusId])) { // check for runSheetId in runSheetList and jobStatus in allStatusMapList
        runsheetList[jobTransactionArray[index].runsheetId][status[allStatusMap[jobTransactionArray[index].jobStatusId] - 1]] += 1
      }
      if (statusCountMap[jobTransactionArray[index].jobStatusId]) { // check stausId count map for jobSummary
        statusCountMap[jobTransactionArray[index].jobStatusId] += 1
      } else {
        statusCountMap[jobTransactionArray[index].jobStatusId] = 1
      }
    }
    await jobSummaryService.updateJobSummary(statusCountMap) // update jobSummary count 
    await userSummaryService.updateUserSummaryCount(allCount) // update userSummary count for pending,fail and success
    return Object.values(runsheetList)
  }

  /**
   * get All runsheets if no runsheet present then throw runsheet missing error
   */
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

  /**
   * get all runsheet which are open i.e. isClosed should be false
   */
  getOpenRunsheets() {
    let runSheetQuery = `isClosed = false`
    const runsheetArray = realm.getRecordListOnQuery(TABLE_RUNSHEET, runSheetQuery)
    let runsheetNumberList = []
    runsheetArray.forEach(runsheetObject => {
      runsheetNumberList.push({ ...runsheetObject })
    })
    return runsheetNumberList
  }

  /**
   * This function prepares runsheet map and job transaction query according to runsheet
   * @param {*} isFutureDateRunsheetEnabled 
   * @returns 
   * {
   *    runsheetMap : {
   *                      runsheetId : { startDate }
   *                  }
   *    jobTransactionQuery : string
   * }
   */
  prepareJobTransactionQueryOnBasisOfRunsheet(isFutureDateRunsheetEnabled) {
    let runsheetMap = {}, jobTransactionQuery = '';
    /* If future date runsheet enabled then check for that runsheets opened else check for runsheets closed.
       This is done as new job/assign order to hub doesn't have any runsheet id.
       So new job/assign order to hub will not work with future date runsheet.
    */
    let runsheetQuery = isFutureDateRunsheetEnabled ? 'isClosed = false' : 'isClosed = true';
    const runsheetList = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery);
    for (let index in runsheetList) {
      let id = runsheetList[index].id;
      let startDate = runsheetList[index].startDate;
      runsheetMap[id] = { startDate }
      jobTransactionQuery += isFutureDateRunsheetEnabled ? index == 0 ? `runsheetId = ${runsheetList[index].id}` : ` OR runsheetId = ${runsheetList[index].id}` : index == 0 ? `runsheetId != ${runsheetList[index].id}` : ` AND runsheetId != ${runsheetList[index].id}`;
    }
    return { runsheetMap, jobTransactionQuery };
  }

}

export let runSheetService = new RunSheet()