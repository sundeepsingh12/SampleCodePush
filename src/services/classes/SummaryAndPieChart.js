
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
       // const pendingStatusIds = await jobStatusService.getAllIdsForCode(PENDING)
        const pendingCounts =  (pendingStatusIds) ? (jobTransactionService.getJobTransactionsForStatusIds(pendingStatusIds)).length : 0
        const successCounts =  (successStatusIds) ? (jobTransactionService.getJobTransactionsForStatusIds(successStatusIds)).length : 0
        const failCounts =     (failStatusIds) ? (jobTransactionService.getJobTransactionsForStatusIds(failStatusIds)).length : 0
        let obj = pendingCounts || successCounts || failCounts ? { pendingCounts, successCounts, failCounts } : null
        return obj
    }
}


export let summaryAndPieChartService = new SummaryAndPieChart()