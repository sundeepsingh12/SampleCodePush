
import {
    jobStatusService
  } from './JobStatus'
  
  import { jobTransactionService } from './JobTransaction'
  import {
    TABLE_JOB_TRANSACTION,
    TABLE_FIELD_DATA,
    TABLE_JOB,
    TABLE_JOB_DATA,
    TABLE_RUNSHEET,
    USER,
    TABLE_JOB_TRANSACTION_CUSTOMIZATION
  } from '../../lib/constants'
  import moment from 'moment'

  import * as realm from '../../repositories/realmdb'

  import {
    PENDING,
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    PINCODE,
    LANDMARK,
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
    * 
    * return {pendingCounts : a, successCounts : b, failCounts : c}
    */
    getAllStatusIdsCount(pendingStatusIds,successStatusIds,failStatusIds){
       // const pendingStatusIds = await jobStatusService.getAllIdsForCode(PENDING)
        const pendingCounts =  (pendingStatusIds) ? this.isTodaysDateCount(jobTransactionService.getJobTransactionsForStatusIds(pendingStatusIds)) : 0
        const successCounts =  (successStatusIds) ? this.isTodaysDateCount(jobTransactionService.getJobTransactionsForStatusIds(successStatusIds)) : 0
        const failCounts =     (failStatusIds) ? this.isTodaysDateCount(jobTransactionService.getJobTransactionsForStatusIds(failStatusIds)) : 0
        let obj = pendingCounts || successCounts || failCounts ? { pendingCounts, successCounts, failCounts } : null
        return obj
    }

    setAllJobMasterSummary(jobMasterList,jobStatusList,jobSummaryList){
        const jobMasterSummaryList = {}, jobStatusIdAndLastUpdatedAtServerMap = {}
        const todayDate =  moment(new Date()).format('YYYY-MM-DD')
        const jobTransactions = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION,null)
        jobTransactions.forEach(item =>jobStatusIdAndLastUpdatedAtServerMap[item.jobStatusId] = moment(item.getLastUpdatedAtServer).format('YYYY-MM-DD'))
        jobMasterList.forEach(id => jobMasterSummaryList[id.id] = {id : id.id ,code: id.identifier, title : id.title, count : 0, 1 : {count : 0,list : []},2 : {count : 0,list : []},3 : {count : 0,list : []}} )
        const jobStatusIdCountMap = jobSummaryList.reduce(function ( total, current ) {
            total[ current.jobStatusId ] = current.count;
            return total;
        }, {});
        for(id in jobStatusList){
            if(jobStatusList[id].code == UNSEEN && jobStatusIdAndLastUpdatedAtServerMap[jobStatusList[id].id] != todayDate )
              continue
            jobMasterSummaryList[ jobStatusList[id].jobMasterId ][jobStatusList[id].statusCategory].list.push([jobStatusIdCountMap[jobStatusList[id].id] , jobStatusList[id].name, jobStatusList[id].id]);
            jobMasterSummaryList[ jobStatusList[id].jobMasterId ][jobStatusList[id].statusCategory].count += jobStatusIdCountMap[jobStatusList[id].id];
            jobMasterSummaryList[ jobStatusList[id].jobMasterId ].count +=  jobStatusIdCountMap[jobStatusList[id].id];
        }
        return Object.values(jobMasterSummaryList)
    }


    getAllRunSheetSummary(){
        const setRunsheetSummary = []
        const runSheetData = realm.getRecordListOnQuery(TABLE_RUNSHEET,null)
        runSheetData.forEach(item => setRunsheetSummary.push([item.runsheetNumber,item.successCount,item.pendingCount,item.failCount,item.cashCollected]))
        return setRunsheetSummary;
    }
    
    isTodaysDateCount(jobTransactions){
        const todayDate =  moment(new Date()).format('YYYY-MM-DD')
        let count = 0;
        jobTransactions.forEach(data => (moment(data.getLastUpdatedAtServer).format('YYYY-MM-DD') == todayDate) ? count++ : count)
        return count 
    }
}


export let summaryAndPieChartService = new SummaryAndPieChart()