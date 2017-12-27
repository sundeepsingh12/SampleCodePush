
import {
    jobStatusService
  } from './JobStatus'
  
  import { jobTransactionService } from './JobTransaction'
  import {
    TABLE_JOB_TRANSACTION,
    TABLE_RUNSHEET,
    USER,
    USER_SUMMARY
  } from '../../lib/constants'

  import {
    keyValueDBService
} from './KeyValueDBService'

  import moment from 'moment'

  import * as realm from '../../repositories/realmdb'

  import {
    UNSEEN
} from '../../lib/AttributeConstants'

class SummaryAndPieChart {

    /**
    * function return count object for piechart of user
    * @param {*} pendingStatusIds 
    * @param {*} successStatusIds 
    * @param {*} failStatusIds 
    * getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds)
    *
    *@return {pendingCounts : a, successCounts : b, failCounts : c}
    *
    */
    async getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds, noNextStatusIds){
        const allPendingSuccessFailIds = pendingStatusIds.concat(successStatusIds,failStatusIds)
        let query = allPendingSuccessFailIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        query = query && query.trim() !== '' ? `deleteFlag != 1 AND (${query})` : 'deleteFlag != 1'
        const transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
        const allTransactionOnTodaysDate =  (allPendingSuccessFailIds) ? this.isTodaysDateTransactions(transactionList,pendingStatusIds,noNextStatusIds) : 0
        const getPendingFailSuccessCounts = await this.setAllCounts(allTransactionOnTodaysDate,pendingStatusIds,successStatusIds,failStatusIds)
        const {pendingCounts,failCounts,successCounts} = getPendingFailSuccessCounts        
        return {pendingCounts,failCounts,successCounts}
    }

    /**
    * function return array of jobMasters. It calculates on all jobTransactions according to statusId
    *
    * @param {*} jobMasterList  
    * @param {*} jobStatusList 
    * @param {*} jobSummaryList 
    *
    * setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList)
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

    setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList,pendingStatusIds,noNextStatusIds){
        const jobMasterSummaryList = {}, jobStatusIdMap = {}
        const todayDate =  moment().format('YYYY-MM-DD')
        let query = "deleteFlag != 1"
        const noNextStatusMap = this.idDtoMap(noNextStatusIds)
        const pendingStatusMap = this.idDtoMap(pendingStatusIds)
        const jobTransactions = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
        jobTransactions.forEach(item =>{ if(moment(todayDate).isSame(moment(item.lastUpdatedAtServer).format('YYYY-MM-DD')) || !noNextStatusMap[item.jobStatusId] || pendingStatusMap[item.jobStatusId] ){
            jobStatusIdMap[item.jobStatusId] = (jobStatusIdMap[item.jobStatusId]) ? jobStatusIdMap[item.jobStatusId] + 1 : 1
        }})
        jobMasterList.forEach(id => jobMasterSummaryList[id.id] = {id : id.id ,code: id.identifier, title : id.title, count : 0, 1 : {count : 0,list : []},2 : {count : 0,list : []},3 : {count : 0,list : []}} )
        const jobStatusIdCountMap = jobSummaryList.reduce(function ( total, current ) {
            total[ current.jobStatusId ] = (jobStatusIdMap[current.jobStatusId]) ? jobStatusIdMap[current.jobStatusId] : 0;
            return total;
        }, {});

        for(id in jobStatusList){
            if(jobStatusList[id].code == UNSEEN ){
              continue
            }
            jobMasterSummaryList[ jobStatusList[id].jobMasterId ][jobStatusList[id].statusCategory].list.push([jobStatusIdCountMap[jobStatusList[id].id] , jobStatusList[id].name, jobStatusList[id].id]);
            jobMasterSummaryList[ jobStatusList[id].jobMasterId ][jobStatusList[id].statusCategory].count += jobStatusIdCountMap[jobStatusList[id].id];
            jobMasterSummaryList[ jobStatusList[id].jobMasterId ].count +=  jobStatusIdCountMap[jobStatusList[id].id];
        }
        return Object.values(jobMasterSummaryList)
    }

    /**
    * function return all count object for piechart of user on all transactions
    * It also update user summary count of pending ,fail and success 
    *
    * @param {*} allTransactions 
    * @param {*} pendingStatusIds 
    * @param {*} successStatusIds 
    * @param {*} failStatusIds 
    *
    * setAllCounts(allTransactions,pendingStatusIds,successStatusIds,failStatusIds){
    *
    * 
    *@return {pendingCounts : a, successCounts : b, failCounts : c}
    */
    
    async setAllCounts(allTransactions,pendingStatusIds,successStatusIds,failStatusIds){
        let pendingCounts = 0,successCounts = 0, failCounts = 0;
        let pendingMap  = this.idDtoMap(pendingStatusIds)
        let successMap = this.idDtoMap(successStatusIds)
        let failMap = this.idDtoMap(failStatusIds)
        for(id in allTransactions ){
            if(pendingMap[allTransactions[id].jobStatusId] == 1){
                pendingCounts++;
                continue;
            }
            if(successMap[allTransactions[id].jobStatusId] == 1){
                successCounts++;
                continue
            }
            if(failMap[allTransactions[id].jobStatusId] == 1){
                failCounts++;
            }
        }
        let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
        userSummary.value.pendingCount = pendingCounts;
        userSummary.value.failCount = failCounts;
        userSummary.value.successCount = successCounts;
        await keyValueDBService.validateAndUpdateData(USER_SUMMARY, userSummary)
        return {pendingCounts,failCounts,successCounts}
    }

    /**
    * function return map for all list 
    *
    *@param {*} dtoList
    * 
    *@return {listMap}
    */
    idDtoMap(dtoList){
        const listMap = dtoList.reduce(function ( total, current ) {
            total[ current ] =  1
            return total;
        }, {});
        return listMap
    }
 
    /**
    * function get all runSheet for user from runsheetDb and return
    * an array which contain runSheetNo,count and cash collected
    * 
    *@return {setRunsheetSummary}
    */

    getAllRunSheetSummary(){
        const setRunsheetSummary = []
        const runSheetData = realm.getRecordListOnQuery(TABLE_RUNSHEET,null)
        runSheetData.forEach(item => setRunsheetSummary.push([item.runsheetNumber,item.successCount,item.pendingCount,item.failCount,item.cashCollected]))
        return setRunsheetSummary;
    }

    /**
    * function check for all transaction according to todayDate
    *
    *@param {*} jobTransactions
    * 
    *@return {jobTransactions}
    */
    
    isTodaysDateTransactions(jobTransactions,pendingStatusIds,noNextStatusIds){
        const noNextStatusMap = this.idDtoMap(noNextStatusIds)
        const pendingStatusMap = this.idDtoMap(pendingStatusIds)
        const todayDate =  moment().format('YYYY-MM-DD')
        let todayJobTransactions = jobTransactions.filter(data => (moment(todayDate).isSame(moment(data.lastUpdatedAtServer).format('YYYY-MM-DD')) || !noNextStatusMap[data.jobStatusId] || pendingStatusMap[data.jobStatusId]))
        return todayJobTransactions 
    }
}


export let summaryAndPieChartService = new SummaryAndPieChart()