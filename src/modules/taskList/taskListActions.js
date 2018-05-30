'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'
import { setState, navigateToScene } from '../global/globalActions'
import { performSyncService } from '../../modules/home/homeActions'
import { JOB_LISTING_START, JOB_LISTING_END, JOB_STATUS, SET_TABS_LIST, CUSTOM_NAMING, TAB, SHOULD_RELOAD_START, SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE, TABS_LOADING, TASKLIST_LOADER_FOR_SYNC, JobDetailsV2, BulkListing } from '../../lib/constants'
import { Toast } from 'native-base'
import { NetInfo } from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import { jobStatusService } from '../../services/classes/JobStatus';

/**
 * This function fetches tabs list and set in state
 */
export function fetchTabs() {
  return async function (dispatch) {
    try {
      dispatch(setState(TABS_LOADING, { tabsLoading: true }));
      const tabs = await keyValueDBService.getValueFromStore(TAB);
      const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS);
      const customNaming = await keyValueDBService.getValueFromStore(CUSTOM_NAMING);
      const tabIdStatusIdMap = jobStatusService.prepareTabStatusIdMap(statusList.value);
      let isFutureRunsheetEnabled = jobTransactionService.getFutureRunsheetEnabled(customNaming);
      dispatch(setState(SET_TABS_LIST, { tabsList: tabs.value, tabIdStatusIdMap, isFutureRunsheetEnabled }));
    } catch (error) {
      //TODO handle UI
      console.log(error);
    }
  }
}

/**
 * This function fetches jobTransaction from db and set jobTransactionCustomizationListDTO in state
 */
export function fetchJobs() {
  return async function (dispatch) {
    try {
      dispatch(setState(JOB_LISTING_START));
      const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters();
      // Fetch jobIdGroupIdMap in case of multi part assignment
      // let jobIdGroupIdMap = jobTransactionService.getJobIdGroupIdMap(jobTransactionCustomizationListParametersDTO.jobMasterList)
      // Fetch future enable runsheet and selected Date for calender
      // dispatch(setState(SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE, { enableFutureDateRunsheet, selectedDate }))
      let jobTransactionCustomizationList = jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO);
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList }));
    } catch (error) {
      //TODO handle UI
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }));
    }
  }
}

/**
 * 
 * @param {*} jobTransactionCustomizationList 
 *  This action will fetch jobs if SHOULD_RELOAD_START is true in store or if jobTransactionCustomizationList is empty
 */
export function shouldFetchJobsOrNot(jobTransactionCustomizationList, pageObject) {
  return async function (dispatch) {
    try {
      let shouldFetchJobs = await keyValueDBService.getValueFromStore(SHOULD_RELOAD_START)
      if ((shouldFetchJobs && shouldFetchJobs.value) || _.isEmpty(jobTransactionCustomizationList)) {
        dispatch(fetchJobs(moment().format('YYYY-MM-DD'), pageObject))
      }
      // Sets SHOULD_RELOAD_START to false so jobs are not fetched unnecessesarily 
      await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(false))
    } catch (error) {
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }))
    }
  }
}