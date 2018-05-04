'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'
import { setState, navigateToScene } from '../global/globalActions'
import { performSyncService } from '../../modules/home/homeActions'
import {
  JOB_LISTING_START,
  JOB_LISTING_END,
  JOB_STATUS,
  SET_TABS_LIST,
  CUSTOM_NAMING,
  TAB,
  SHOULD_RELOAD_START,
  SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE,
  TASKLIST_LOADER_FOR_SYNC,
  JobDetailsV2,
  BulkListing
} from '../../lib/constants'
import { Toast } from 'native-base'
import { NetInfo } from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import { draftService } from '../../services/classes/DraftService'

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
export function fetchJobs(date, pageObject) {
  return async function (dispatch) {
    try {
      dispatch(setState(JOB_LISTING_START))
      const customNaming = await keyValueDBService.getValueFromStore(CUSTOM_NAMING)
      const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
      // Fetch jobIdGroupIdMap in case of multi part assignment
      let jobIdGroupIdMap = jobTransactionService.getJobIdGroupIdMap(jobTransactionCustomizationListParametersDTO.jobMasterList)
      // Fetch future enable runsheet and selected Date for calender
      let { enableFutureDateRunsheet, selectedDate } = jobTransactionService.getFutureRunsheetEnabledAndSelectedDate(customNaming, jobIdGroupIdMap, date)
      dispatch(setState(SET_FUTURE_RUNSHEET_ENABLED_AND_SELECTED_DATE, { enableFutureDateRunsheet, selectedDate }))
      let { jobTransactionCustomizationList, statusNextStatusListMap } = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'AllTasks', pageObject, selectedDate, jobIdGroupIdMap)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList, statusNextStatusListMap }))
    } catch (error) {
      //TODO handle UI
      console.log(error)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [], statusNextStatusListMap: {} }))
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
      //TODO handle UI
      console.log(error)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }))
    }
  }
}

export function checkForDraftANdStartSyncAndNavigateToJobDetail(screenName, bulkData, syncLoader) {
  return async function (dispatch) {
    try {
      const jobMasterId = bulkData.pageObject.jobMasterIds[0]
      const jobMasterValue = await jobMasterService.getJobMasterFromJobMasterList(jobMasterId)
      if (jobMasterValue[0].enableLiveJobMaster) {
          NetInfo.isConnected.fetch().then(async isConnected => {
            if(isConnected){
            dispatch(setState(syncLoader, true))
             let message = await dispatch(performSyncService())
              if (message === true) {
                dispatch(setState(syncLoader, false))
                dispatch(navigateToScene(screenName, bulkData)) 
              }else{
                dispatch(setState(syncLoader, false))
                alert(message)
              }
            }else {
              alert('Please enable internet connection to update this job!!!')
              }
          }).catch(function (err) {
              dispatch(setState(syncLoader, false))
              Toast.show({ text: err.message, position: "bottom" | "center", buttonText: 'OKAY', type: 'danger', duration: 5000 })
          })
      } else  {
          dispatch(navigateToScene(screenName, bulkData))
      }
    } catch (error) {
      dispatch(setState(TASKLIST_LOADER_FOR_SYNC, false))
      Toast.show({ text: error.message, position: "bottom" | "center", buttonText: 'OKAY', type: 'danger', duration: 5000 })
    }
  }
}