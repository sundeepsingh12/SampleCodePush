
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
    * return {pendingCounts : a, successCounts : b, failCounts : 
    * c}
    */
    async getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds){
        const allPendingSuccessFailIds = pendingStatusIds.concat(successStatusIds,failStatusIds)
        let query = allPendingSuccessFailIds.map(statusId => 'jobStatusId = ' + statusId).join(' OR ')
        query = query && query.trim() !== '' ? `deleteFlag != 1 AND (${query})` : 'deleteFlag != 1'
        const transactionList = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
        const allTransactionOnTodaysDate =  (allPendingSuccessFailIds) ? this.isTodaysDateTransactions(transactionList) : 0
        const getPendingFailSuccessCounts = await this.setAllCounts(allTransactionOnTodaysDate,pendingStatusIds,successStatusIds,failStatusIds)
        const {pendingCounts,failCounts,successCounts} = getPendingFailSuccessCounts        
        return {pendingCounts,failCounts,successCounts}
    }



    setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList){
        const jobMasterSummaryList = {}, jobStatusIdAndLastUpdatedAtServerMap = {}
        const todayDate =  moment().format('YYYY-MM-DD')
        let query = "deleteFlag != 1"
        const jobTransactions = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, query)
        jobTransactions.forEach(item =>jobStatusIdAndLastUpdatedAtServerMap[item.jobStatusId] = moment(item.getLastUpdatedAtServer).format('YYYY-MM-DD'))
        jobMasterList.forEach(id => jobMasterSummaryList[id.id] = {id : id.id ,code: id.identifier, title : id.title, count : 0, 1 : {count : 0,list : []},2 : {count : 0,list : []},3 : {count : 0,list : []}} )
        const jobStatusIdCountMap = jobSummaryList.reduce(function ( total, current ) {
            total[ current.jobStatusId ] = current.count;
            return total;
        }, {});
        for(id in jobStatusList){
            if(jobStatusList[id].code == UNSEEN || (jobStatusIdAndLastUpdatedAtServerMap[jobStatusList[id].id] && !(moment(todayDate).isSame(jobStatusIdAndLastUpdatedAtServerMap[jobStatusList[id].id])))){
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
    * @param {*} allTransactions 
    * @param {*} pendingStatusIds 
    * @param {*} successStatusIds 
    * @param {*} failStatusIds 
    * setAllCounts(allTransactions,pendingStatusIds,successStatusIds,failStatusIds){
    *
    * 
    * return {pendingCounts : a, successCounts : b, failCounts : c}
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
        const userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
        userSummary.value.pendingCount,userSummary.value.failCount,userSummary.value.successCount = pendingCounts,failCounts,successCounts;
        await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary)
        return {pendingCounts,failCounts,successCounts}
    }

    /**
    * function return map for all list 
    *
    *@param {*} dtoList
    * 
    * return {listMap}
    */
    idDtoMap(dtoList){
        const listMap = dtoList.reduce(function ( total, current ) {
            total[ current ] =  1
            return total;
        }, {});
        return listMap
    }


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
    * return {jobTransactions}
    */
    
    isTodaysDateTransactions(jobTransactions){
        const todayDate =  moment(new Date()).format('YYYY-MM-DD')
        jobTransactions.filter(data => (moment(data.getLastUpdatedAtServer).format('YYYY-MM-DD') == todayDate))
        return jobTransactions 
    }
}


export let summaryAndPieChartService = new SummaryAndPieChart()