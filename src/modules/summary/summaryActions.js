
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
import _ from 'lodash'

import  { Piechart } from '../../lib/AttributeConstants'

/**@function getDataForJobMasterSummaryAndRunSheetSummary()
    * 
    * this action is for set all jobMaster Summary and runSheet Summary, action is called on pieChart press
    *  
    *@description => set summary for jobMaster and summary for runSheet
    *
    */

export function getDataForJobMasterSummaryAndRunSheetSummary() {
    return async function (dispatch) {
        try {
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobStatusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY) 
            const {allStatusMap, noNextStatusMap } = await jobStatusService.getStatusIdsForAllStatusCategory() // get all status map and noNextStatusList map        
            if (!jobMasterList || !jobStatusList || !jobSummaryList) {
                throw new Error('store not available')
            }
            const allPendingSuccessFailIds = Object.keys(allStatusMap)
            const jobMasterListValue = (_.size(Piechart.params)) ? jobMasterList.value.filter((jobMaster) => _.includes(Piechart.params, jobMaster.id)) : jobMasterList.value
            const jobMasterSummaryList =  summaryAndPieChartService.setAllJobMasterSummary(jobMasterListValue,jobStatusList.value,jobSummaryList.value,allPendingSuccessFailIds,noNextStatusMap) // set all jobMasterSummary list
            const runsheetSummaryList =   summaryAndPieChartService.getAllRunSheetSummary() // set all runSheetList summary
            dispatch(setState(SET_SUMMARY_FOR_JOBMASTER, jobMasterSummaryList))
            dispatch(setState(SET_SUMMARY_FOR_RUNSHEET,runsheetSummaryList))
        } catch (error) {
            console.log("ErrorMessage",error)
        }
    }
}