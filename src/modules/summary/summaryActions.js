
'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { summaryAndPieChartService } from '../../services/classes/SummaryAndPieChart'
import { jobStatusService } from '../../services/classes/JobStatus'
import { setState } from '../global/globalActions'
import {
    SET_SUMMARY_FOR_JOBMASTER,
    SET_SUMMARY_FOR_RUNSHEET, 
    JOB_MASTER,
    JOB_STATUS,
    JOB_SUMMARY,
} from '../../lib/constants'

/**This action is fire when statistics module is tap,
 * 
 * @param {*} userSummaryList // it return the user_summary which contains all user information 
 * return data for view of statistics list 
 */
export function getDataForJobMasterSummaryAndRunSheetSummary() {
    return async function (dispatch) {
        try {
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobStatusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY) 
            const { pendingStatusIds, noNextStatusIds } = await jobStatusService.getStatusIdsForAllStatusCategory()        
            if (!jobMasterList || !jobStatusList || !jobSummaryList) {
                throw new Error('store not available')
            }
            const jobMasterSummaryList =  summaryAndPieChartService.setAllJobMasterSummary(jobMasterList.value,jobStatusList.value,jobSummaryList.value,pendingStatusIds,noNextStatusIds)
            const runsheetSummaryList =   summaryAndPieChartService.getAllRunSheetSummary()
            dispatch(setState(SET_SUMMARY_FOR_JOBMASTER, jobMasterSummaryList))
            dispatch(setState(SET_SUMMARY_FOR_RUNSHEET,runsheetSummaryList))
        } catch (error) {
            console.log("ErrorMessage",error)
        }
    }
}