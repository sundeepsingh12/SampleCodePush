'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'
import { setState } from '../global/globalActions'
import { JOB_LISTING_START, JOB_LISTING_END, JOB_STATUS, SET_TABS_LIST, CUSTOM_NAMING, TAB, SHOULD_RELOAD_START, TABS_LOADING, JOB_ATTRIBUTE, USER, FIELD_ATTRIBUTE, FIELD_ATTRIBUTE_STATUS } from '../../lib/constants'
import moment from 'moment'
import _ from 'lodash'
import { jobStatusService } from '../../services/classes/JobStatus';
import { fieldDataService } from '../../services/classes/FieldData'
import { fieldAttributeMasterService } from '../../services/classes/FieldAttributeMaster'
import { addServerSmsService } from '../../services/classes/AddServerSms'
import { jobDataService } from '../../services/classes/JobData'

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
        dispatch(fetchJobs())
      }
      // Sets SHOULD_RELOAD_START to false so jobs are not fetched unnecessesarily 
      await keyValueDBService.validateAndSaveData(SHOULD_RELOAD_START, new Boolean(false))
    } catch (error) {
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }))
    }
  }
}

export function setSmsTemplateList(contact, smsTemplatedata, item) {
  return async function (dispatch) {
    try {
      const jobAttributesList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
      const fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
      const user = await keyValueDBService.getValueFromStore(USER);
      const fieldDataMap = fieldDataService.getFieldData(item.id)
      const jobDataMap =  jobDataService.getJobData([item])
      await addServerSmsService.sendFieldMessage(contact, smsTemplatedata, item, null, null, jobAttributesList, fieldAttributesList, user, jobDataMap[item.jobId], fieldDataMap[item.id])
    } catch (error) {
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }))
    }
  }
}