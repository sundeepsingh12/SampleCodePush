'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobMasterService } from '../../services/classes/JobMaster'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'
import { setState } from '../global/globalActions'
import {
  CUSTOMER_CARE,
  CUSTOMIZATION_LIST_MAP,
  JOB_ATTRIBUTE,
  JOB_ATTRIBUTE_STATUS,
  JOB_LISTING_START,
  JOB_LISTING_END,
  JOB_MASTER,
  JOB_STATUS,
  SET_TABS_LIST,
  SMS_TEMPLATE,
  TAB
} from '../../lib/constants'

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
      console.log(error)
    }
  }
}

export function fetchJobs() {
  return async function (dispatch) {
    try {
      dispatch(setState(JOB_LISTING_START))
      const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
      console.log('jobTransactionCustomizationListParametersDTO',jobTransactionCustomizationListParametersDTO)
      let jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO)
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList }))
    } catch (error) {
      console.log(error)
    }
  }
}