
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
    UNSEEN,
    TABLE_JOB_TRANSACTION_CUSTOMIZATION
  } from '../../lib/constants'
   
  import moment from 'moment'
  import {
    PENDING,
    ADDRESS_LINE_1,
    ADDRESS_LINE_2,
    PINCODE,
    LANDMARK
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
         const pendingCounts =  (pendingStatusIds) ? this.isTodaysDateCount(jobTransactionService.getJobTransactionsForStatusIds(pendingStatusIds)) : 0
         const successCounts =  (successStatusIds) ? this.isTodaysDateCount(jobTransactionService.getJobTransactionsForStatusIds(successStatusIds)) : 0
         const failCounts =     (failStatusIds) ? this.isTodaysDateCount(jobTransactionService.getJobTransactionsForStatusIds(failStatusIds)) : 0
         let obj = pendingCounts || successCounts || failCounts ? { pendingCounts, successCounts, failCounts } : null
         return obj
     }

     isTodaysDateCount(jobTransactions){
        const todayDate =  moment(new Date()).format('YYYY-MM-DD')
        let count = 0;
        jobTransactions.forEach(data => (moment(data.getLastUpdatedAtServer).format('YYYY-MM-DD') == todayDate) ? count++ : count)
        return count 
    }
}


export let summaryAndPieChartService = new SummaryAndPieChart()