'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'
import { setState } from '../global/globalActions'
import {
  JOB_LISTING_START,
  JOB_LISTING_END,
  JOB_STATUS,
  SET_TABS_LIST,
  CUSTOM_NAMING,
  FUTURE_RUNSHEET_ENABLED,
  TAB,
  SET_SELECTED_DATE,
  SHOULD_RELOAD_START
} from '../../lib/constants'
import moment from 'moment'
import _ from 'lodash'

/**
 * This function fetches tabs list and set in state
 */
export function fetchTabs() {
  return async function (dispatch) {
    try {
      const tabs = await keyValueDBService.getValueFromStore(TAB)
      const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
      const tabIdStatusIdMap = jobMasterService.prepareTabStatusIdMap(statusList.value)
      dispatch(setState(SET_TABS_LIST, {
        tabsList: tabs.value,
        tabIdStatusIdMap
      }
      ))
    } catch (error) {
      //TODO handle UI
      console.log(error)
    }
  }
}

/**
 * This function fetches jobTransaction from db and set jobTransactionCustomizationListDTO in state
 */
export function fetchJobs(date) {
  return async function (dispatch) {
    try {
      const customNaming = await keyValueDBService.getValueFromStore(CUSTOM_NAMING)
      dispatch(setState(JOB_LISTING_START))
      const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
      let jobMasterListWithMultipart = jobTransactionService.getEnableMultiPartJobMaster(jobTransactionCustomizationListParametersDTO.jobMasterList)
      let jobIdGroupIdMap = jobMasterListWithMultipart && jobMasterListWithMultipart.length > 0 ?  jobTransactionService.getJobIdGroupIdMap(jobMasterListWithMultipart) : {}
      let enableFutureDateRunsheet = customNaming && customNaming.value && customNaming.value.enableFutureDateRunsheet && _.isEmpty(jobIdGroupIdMap) ? customNaming.value.enableFutureDateRunsheet : false
      dispatch(setState(FUTURE_RUNSHEET_ENABLED, enableFutureDateRunsheet))
      if(_.isUndefined(date) && customNaming.value.enableFutureDateRunsheet) date = moment().format('YYYY-MM-DD')
      dispatch(setState(SET_SELECTED_DATE,date))
      let selectedDate = customNaming.value.enableFutureDateRunsheet && _.isEmpty(jobIdGroupIdMap) ? date : null
      let {jobTransactionCustomizationList,statusNextStatusListMap } = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO,'AllTasks',null,selectedDate,jobIdGroupIdMap)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList, statusNextStatusListMap}))
    } catch (error) {
      //TODO handle UI
      console.log(error)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList:[],statusNextStatusListMap : {}}))
    }
  }
}

/**
 * 
 * @param {*} jobTransactionCustomizationList 
 *  This action will fetch jobs if SHOULD_RELOAD_START is true in store or if jobTransactionCustomizationList is empty
 */
export function shouldFetchJobsOrNot(jobTransactionCustomizationList) {
  return async function (dispatch) {
    try {
      let shouldFetchJobs = await keyValueDBService.getValueFromStore(SHOULD_RELOAD_START)
      if ((shouldFetchJobs && shouldFetchJobs.value) || _.isEmpty(jobTransactionCustomizationList)) {
        dispatch(fetchJobs(moment().format('YYYY-MM-DD')))
      }
      await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(false))
    } catch (error) {
      //TODO handle UI
      console.log(error)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }))
    }
  }
}