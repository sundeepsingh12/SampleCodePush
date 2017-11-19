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
  TAB
} from '../../lib/constants'

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
export function fetchJobs() {
  return async function (dispatch) {
    try {
      dispatch(setState(JOB_LISTING_START))
      const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
      let jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList }))
    } catch (error) {
      //TODO handle UI
      console.log(error)
    }
  }
}