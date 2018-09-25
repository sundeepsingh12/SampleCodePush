
'use strict'

import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { summaryAndPieChartService } from '../../services/classes/SummaryAndPieChart'
import { jobStatusService } from '../../services/classes/JobStatus'
import { setState,showToastAndAddUserExceptionLog } from '../global/globalActions'
import {
    SET_JOB_MASTER_AND_RUNSHEET_DATA,
    JOB_MASTER,
    JOB_STATUS,
    JOB_SUMMARY,
    START_FETCHING_DATA,
    SET_RUNSHEET_ID
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
            dispatch(setState(START_FETCHING_DATA))
            const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
            const jobStatusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
            const jobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY) 
            const {allStatusMap, noNextStatusMap } = await jobStatusService.getStatusIdsForAllStatusCategory() // get all status map and noNextStatusList map        
            if (!jobMasterList || !jobStatusList || !jobSummaryList) {
                throw new Error('store not available')
            }
            const allPendingSuccessFailIds = Object.keys(allStatusMap)
            const jobMasterListValue = (_.size(Piechart.params)) ? jobMasterList.value.filter((jobMaster) => _.includes(Piechart.params, jobMaster.id)) : jobMasterList.value
            const jobMasterSummaryList =  summaryAndPieChartService.setAllJobMasterSummary(jobMasterListValue,jobStatusList.value,allPendingSuccessFailIds,noNextStatusMap) // set all jobMasterSummary list
            const runsheetSummaryList =   summaryAndPieChartService.getAllRunSheetSummary() // set all runSheetList summary
            const currentActiveRunsheetId = runsheetSummaryList[0][6] ;
            dispatch(setState(SET_JOB_MASTER_AND_RUNSHEET_DATA, {jobMasterSummaryList,runsheetSummaryList,currentActiveRunsheetId}))
        } catch (error) {
            showToastAndAddUserExceptionLog(9901, error.message, 'danger', 1)
        }
    }
}

export function setCurrentActiveRunsheetId(runsheetId){
    return async function(dispatch){
        try{
            dispatch(setState(SET_RUNSHEET_ID, runsheetId))
        }catch(error){

        }
    }
}