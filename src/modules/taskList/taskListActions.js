'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { transactionCustomizationService } from '../../services/classes/TransactionCustomization'
import { setState } from '../global/globalActions'
import { JOB_LISTING_START, JOB_LISTING_END, JOB_STATUS, SET_TABS_LIST, CUSTOM_NAMING, TAB, UPDATE_JOBMASTERID_JOBID_MAP, TABS_LOADING, JOB_ATTRIBUTE, USER, FIELD_ATTRIBUTE, TABLE_FIELD_DATA } from '../../lib/constants'
import _ from 'lodash'
import { jobStatusService } from '../../services/classes/JobStatus';
import { fieldDataService } from '../../services/classes/FieldData'
import { addServerSmsService } from '../../services/classes/AddServerSms'
import { jobDataService } from '../../services/classes/JobData'
import * as realm from '../../repositories/realmdb'

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
export function fetchJobs(jobIdMap, jobTransactionCustomizationList) {
  return async function (dispatch) {
    try {
      dispatch(setState(JOB_LISTING_START));
      jobTransactionCustomizationList = await transactionCustomizationService.fetchUpdatedTransactionList(jobIdMap, jobTransactionCustomizationList);
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList }));
    } catch (error) {
      //TODO handle UI
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }));
    }
  }
}


export function setSmsTemplateList(contact, smsTemplatedata, item) {
  return async function (dispatch) {
    try {
      const user = await keyValueDBService.getValueFromStore(USER);
      let fieldDataQuery =  'jobTransactionId = ' + item.id
      let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, fieldDataQuery, null, null)
      const fieldDataMap = fieldDataService.getFieldDataMap(fieldDataList, false)
      const jobDataMap =  jobDataService.getJobData([item])
      await addServerSmsService.sendFieldMessage(contact, smsTemplatedata, item, user, fieldDataMap[item.id], jobDataMap[item.jobId])
    } catch (error) {
      dispatch(setState(JOB_LISTING_END, { jobTransactionCustomizationList: [] }))
    }
  }
}