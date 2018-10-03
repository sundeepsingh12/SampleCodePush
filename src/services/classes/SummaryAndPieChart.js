
import {
    jobStatusService
} from './JobStatus'
import {
    TABLE_JOB_TRANSACTION,
    TABLE_RUNSHEET,
} from '../../lib/constants'

import moment from 'moment'

import * as realm from '../../repositories/realmdb'

import {
    UNSEEN,
} from '../../lib/AttributeConstants'

import { jobMasterService } from '../classes/JobMaster'
import isEmpty from 'lodash/isEmpty'

class SummaryAndPieChart {

    /**
    * function return count object for piechart of user
    */
    async getAllStatusIdsCount(jobMasterList) {
        const { allStatusMap, noNextStatusMap } = await jobStatusService.getStatusIdsForAllStatusCategory() // get all status list
        const allPendingSuccessFailIds = Object.keys(allStatusMap)
        let jobMasterIdList = (isEmpty(jobMasterList)) ? await jobMasterService.getJobMasterIdList() : jobMasterList
        const transactionList = this.getTransactionsForPieChartAndSummary(allPendingSuccessFailIds, jobMasterIdList) // get all transactions for selected jobMAster list
        const allTransactionOnTodaysDate = (transactionList.length) ? this.isTodaysDateTransactions(transactionList, noNextStatusMap) : [] // get transactions on today's date
        return this.setAllCounts(allTransactionOnTodaysDate, allStatusMap)
    }

    /**@function setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList,allPendingSuccessFailIds,noNextStatusMap)
    * function return selected jobMaster wise summary list that contain count of each status
    *
    * @param {Array} jobMasterList  
    * @param {Array} jobStatusList 
    * @param {Array} jobSummaryList 
    * @param {Array} allPendingSuccessFailIds
    * @param {Array} noNextStatusMap
    *
    *@return [{
        id: '12' // jobMasterId
        code: 'abc' // jobMaster Identifier
        title: 'ABC123' // jobMaster title
        count: 7 // all Transactions of particular jobMaster
        pending:{ count : 1, list : []}
        fail : { count : 2, list : []}
        Success : { count : 4, list : []}
    }]
    *
    */

    setAllJobMasterSummary(jobMasterList, jobStatusList, allPendingSuccessFailIds, noNextStatusMap) {
        let  jobMasterSummaryList = {}
        jobMasterList.forEach(id => {
            jobMasterSummaryList[id.id] = { id: id.id, code: id.identifier, cashCollected: 0, cashCollectedByCard: 0, cashPayment: 0, identifierColor: id.identifierColor, title: id.title, count: 0,1: { count: 0, list: [] }, 2: { count: 0, list: [] }, 3: { count: 0, list: [] } }
        }) // map of jobMasterId and jobMaster Summary details Dto
        const jobTransactions = this.getTransactionsForPieChartAndSummary(allPendingSuccessFailIds, Object.keys(jobMasterSummaryList)) // get transactions for summary
        const data = this.createJobStatusCountMap(jobTransactions, noNextStatusMap) // get jobStatus and count map
        const jobMasterSummaryLists = this.buildJobMasterSummaryList(jobStatusList, jobMasterSummaryList, data.runsheetIdJobStatusIdCountMap,data.runsheetIdJobMasterIdMoneyTransactionTypeAmountMap)
        return jobMasterSummaryLists
    }

    /**@function getTransactionsForPieChartAndSummary(allPendingSuccessFailIds,jobMasterList)
    * 
    * function return jobTransactions for selected jobMaster, jobStatus and runSheetList
    * 
    *@param {Array} jobMasterList 
    *@param {Array} allPendingSuccessFailIds 
    *
    *@return {jobTransactionList} // realm object of jobTransactions
    *
    */

    getTransactionsForPieChartAndSummary(allPendingSuccessFailIds, jobMasterIdList) {
        let runsheetQuery = 'isClosed = true'// check for closed runsheet
        const runsheetList = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery)
        let runSheetIdListQuery = runsheetList.map((runsheet) => `runsheetId != ${runsheet.id}`).join(' AND ') // query for all runsheetList    
        let statusQuery = allPendingSuccessFailIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')// query for all status
        let jobMasterQuery = jobMasterIdList.map(jobMasterId => 'jobMasterId = ' + jobMasterId).join(' OR ') // query for selected jobMaster
        statusQuery = statusQuery && statusQuery.trim() !== '' ? `deleteFlag != 1 AND (${statusQuery})` : 'deleteFlag != 1'
        statusQuery = runSheetIdListQuery && runSheetIdListQuery.trim() !== '' ? `(${statusQuery}) AND (${runSheetIdListQuery})` : statusQuery
        statusQuery = jobMasterQuery && jobMasterQuery.trim() !== '' ? `(${statusQuery}) AND (${jobMasterQuery})` : statusQuery
        const transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, statusQuery)
        return transactionList
    }

    /**@function buildJobMasterSummaryList(jobStatusList,jobMasterList,jobStatusIdCountMap)
    * 
    * function return summary List count for selected jobMaster
    * 
    *@param {Array} jobMasterList 
    *@param {Array} jobStatusList
    *@param {Object} jobStatusIdCountMap
    *
    *@return [{
        id: '12' // jobMasterId
        code: 'abc' // jobMaster Identifier
        title: 'ABC123' // jobMaster title
        count: 7 // all Transactions of particular jobMaster
        pending:{ count : 1, list : []}
        fail : { count : 2, list : []}
        Success : { count : 4, list : []}
    }]
    *
    */

    buildJobMasterSummaryList(jobStatusList, jobMasterSummaryList,runsheetIdJobStatusIdCountMap,runsheetIdJobMasterIdMoneyTransactionTypeAmountMap) {
        let runsheetIdJobSummaryList = {}
        for (let runsheetId in runsheetIdJobStatusIdCountMap) {

            let jobSummaryListClone = {}
            jobSummaryListClone = JSON.parse(JSON.stringify(jobMasterSummaryList))
           

            for (let id in jobStatusList) {
                if (jobStatusList[id].code == UNSEEN || !jobMasterSummaryList[jobStatusList[id].jobMasterId]) { // check for unseen code and selected jobMaster
                    continue
                }
                let jobStatusCount = (runsheetIdJobStatusIdCountMap[runsheetId][jobStatusList[id].id]) ? runsheetIdJobStatusIdCountMap[runsheetId][jobStatusList[id].id] : 0

                jobSummaryListClone[jobStatusList[id].jobMasterId][jobStatusList[id].statusCategory].list.push({
                    count: jobStatusCount,
                    name: jobStatusList[id].name,
                    id: jobStatusList[id].id
                });
                jobSummaryListClone[jobStatusList[id].jobMasterId][jobStatusList[id].statusCategory].count += jobStatusCount;
                jobSummaryListClone[jobStatusList[id].jobMasterId].count += jobStatusCount;

                let jobMasterIdMoneyTransactionTypeAmountMap = (runsheetIdJobMasterIdMoneyTransactionTypeAmountMap[runsheetId]) ? runsheetIdJobMasterIdMoneyTransactionTypeAmountMap[runsheetId] : {}
                let moneyTransactionTypeAmountMap = (jobMasterIdMoneyTransactionTypeAmountMap[jobStatusList[id].jobMasterId]) ? jobMasterIdMoneyTransactionTypeAmountMap[jobStatusList[id].jobMasterId] : {}
                jobSummaryListClone[jobStatusList[id].jobMasterId].cashCollected = moneyTransactionTypeAmountMap['Collection-Cash'];

                jobSummaryListClone[jobStatusList[id].jobMasterId].cashCollectedByCard = moneyTransactionTypeAmountMap['Collection-SOD'];

                jobSummaryListClone[jobStatusList[id].jobMasterId].cashPayment =  moneyTransactionTypeAmountMap['Refund']
            }
            runsheetIdJobSummaryList[runsheetId] = jobSummaryListClone
        }

        return runsheetIdJobSummaryList
    }

    /**@function createJobStatusCountMap(jobTransactions,noNextStatusMap,jobSummaryList)
    * 
    * function return a map of jobStatus and transaction count having same statusId
    * 
    *@param {Array} jobTransactions 
    *@param {Object} noNextStatusMap
    *@param {Array} jobSummaryList 
    *
    *@return {jobStatusIdCountMap}  => {
        123 : 2,
        124 : 3,
    }
    *
    */

    createJobStatusCountMap(jobTransactions, noNextStatusMap) {
        let runsheetIdJobStatusIdCountMap = {},runsheetIdJobMasterIdMoneyTransactionTypeAmountMap = {}

        const todayDate = moment().format('YYYY-MM-DD')
        jobTransactions.forEach(item => {
            if (moment(todayDate).isSame(moment(item.lastUpdatedAtServer).format('YYYY-MM-DD')) || !noNextStatusMap[item.jobStatusId]) { // check for today's date transaction and
                if (item.moneyTransactionType && item.actualAmount > 0) {
                    const jobMasterIdmoneyTransactionTypeAmountMap = (runsheetIdJobMasterIdMoneyTransactionTypeAmountMap[item.runsheetId]) ? runsheetIdJobMasterIdMoneyTransactionTypeAmountMap[item.runsheetId] : {}
                    let moneyTransactionTypeAmountMap = (jobMasterIdmoneyTransactionTypeAmountMap[item.jobMasterId]) ? jobMasterIdmoneyTransactionTypeAmountMap[item.jobMasterId] : {}
                    moneyTransactionTypeAmountMap[item.moneyTransactionType] = (moneyTransactionTypeAmountMap[item.moneyTransactionType]) ? moneyTransactionTypeAmountMap[item.moneyTransactionType] + item.actualAmount : item.actualAmount
                    jobMasterIdmoneyTransactionTypeAmountMap[item.jobMasterId] = moneyTransactionTypeAmountMap
                    runsheetIdJobMasterIdMoneyTransactionTypeAmountMap[item.runsheetId] = jobMasterIdmoneyTransactionTypeAmountMap
                }
                let jobStatusCountMap = (runsheetIdJobStatusIdCountMap[item.runsheetId]) ? runsheetIdJobStatusIdCountMap[item.runsheetId] : {}
                jobStatusCountMap[item.jobStatusId] = (jobStatusCountMap[item.jobStatusId]) ? jobStatusCountMap[item.jobStatusId] + 1 : 1
                runsheetIdJobStatusIdCountMap[item.runsheetId] = jobStatusCountMap
            }
            })

        return {runsheetIdJobStatusIdCountMap,runsheetIdJobMasterIdMoneyTransactionTypeAmountMap}
    }

    /** @function setAllCounts(allTransactions,pendingStatusIds,successStatusIds,failStatusIds)
    * function return all count object for piechart of user on all transactions
    *
    * @param {Object} allTransactions 
    * @param {Object} allPendingSuccessFailIdsMap 
    * 
    *@return {pendingCounts : a, successCounts : b, failCounts : c}
    */

    setAllCounts(allTransactions, allPendingSuccessFailIdsMap) {
        let count = [0, 0, 0]
        for (let id in allTransactions) {
            count[allPendingSuccessFailIdsMap[allTransactions[id].jobStatusId] - 1]++
        }
        return { pendingCounts: count[0], failCounts: count[1], successCounts: count[2] }
    }

    /**@function getAllRunSheetSummary()
    * function get all runSheet for user from runsheetDb and return
    * an array which contain runSheetNo,count and cash collected
    * 
    *@return {setRunsheetSummary}
    */

    getAllRunSheetSummary() {
        let setRunsheetSummary = []
        let runsheetQuery = 'isClosed = false'
        const runSheetData = realm.getRecordListOnQuery(TABLE_RUNSHEET, runsheetQuery, true, 'startDate', false, true)
        runSheetData.forEach(item => setRunsheetSummary.push([item.runsheetNumber, item.successCount, item.pendingCount, item.failCount, item.cashCollected, item.cashCollectedByCard,item.id]))
        return setRunsheetSummary;
    }

    /**@function isTodaysDateTransactions(jobTransactions,noNextStatusMap)
    
    * function check for all transactions of today's Date
    *
    *@param {Array} jobTransactions
    * 
    *@return {Array} todayJobTransactions
    */

    isTodaysDateTransactions(jobTransactions, noNextStatusMap) {
        const todayDate = moment().format('YYYY-MM-DD')
        let todayJobTransactions = jobTransactions.filter(data => (moment(todayDate).isSame(moment(data.lastUpdatedAtServer).format('YYYY-MM-DD')) || !noNextStatusMap[data.jobStatusId]))
        return todayJobTransactions
    }
}


export let summaryAndPieChartService = new SummaryAndPieChart()