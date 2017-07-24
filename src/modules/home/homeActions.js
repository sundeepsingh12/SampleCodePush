'use strict'

const {
  JOB_FETCHING_START,
  JOB_FETCHING_END,
  SET_FETCHING_FALSE,
  SET_REFRESHING_TRUE,
  UNSEEN,
  TABLE_JOB_TRANSACTION,
  TAB,
  SET_TABS_LIST,
  TABLE_FIELD_DATA,
  TABLE_JOB,
  TABLE_JOB_DATA,
  USER,
  TABLE_RUNSHEET,
  TABLE_JOB_TRANSACTION_CUSTOMIZATION,
  CLEAR_HOME_STATE,
  SET_TABS_TRANSACTIONS,
  JOB_STATUS,
  JOB_LISTING_START,
  JOB_LISTING_END,
  CUSTOMIZATION_LIST_MAP,
  JOB_ATTRIBUTE,
  JOB_ATTRIBUTE_STATUS,
  CUSTOMER_CARE,
  SMS_TEMPLATE,

} = require('../../lib/constants').default

import CONFIG from '../../lib/config'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { sync } from '../../services/classes/Sync'
import { jobStatusService } from '../../services/classes/JobStatus'
import { jobTransactionService } from '../../services/classes/JobTransaction'
import { jobSummaryService } from '../../services/classes/JobSummary'
import { jobMasterService } from '../../services/classes/JobMaster'
import * as realm from '../../repositories/realmdb'
import _ from 'underscore'

export function jobFetchingEnd(jobTransactionCustomizationList) {
  return {
    type: JOB_LISTING_END,
    payload: {
      jobTransactionCustomizationList
    }
  }
}

export function jobFetchingStart(isRefresh) {
  return {
    type: JOB_FETCHING_START,
    payload: {
      isRefresh,
    }
  }
}

export function setTabsList(tabsList, tabIdStatusIdMap) {
  return {
    type: SET_TABS_LIST,
    payload: {
      tabsList,
      tabIdStatusIdMap
    }
  }
}

export function setFetchingFalse(tabId, message) {
  return {
    type: SET_FETCHING_FALSE,
    payload: {
      tabId,
      message
    }
  }
}

export function clearHomeState() {
  return {
    type: CLEAR_HOME_STATE
  }
}

export function fetchTabs() {
  return async function (dispatch) {
    try {
      const tabs = await keyValueDBService.getValueFromStore(TAB)
      const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
      const tabIdStatusIdMap = jobMasterService.prepareTabStatusIdMap(statusList.value)
      dispatch(setTabsList(tabs.value, tabIdStatusIdMap))
    } catch (error) {
      console.log(error)
    }
  }
}

export function setRefereshingTrue() {
  return {
    type: SET_REFRESHING_TRUE
  }
}

export function setTabIdsJobTransactions(tabIdJobs) {
  return {
    type: SET_TABS_TRANSACTIONS,
    payload: tabIdJobs
  }
}

export function fetchJobs() {
  return async function (dispatch) {
    try {
      const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
      const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
      const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
      const customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
      const smsTemplateList = await keyValueDBService.getValueFromStore(SMS_TEMPLATE)
      let jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap.value, jobAttributeMasterList.value, jobAttributeStatusList.value, customerCareList.value, smsTemplateList.value)
      dispatch(jobFetchingEnd(jobTransactionCustomizationList))
    } catch (error) {
      console.log(error)
    }
  }
}

export function onResyncPress() {
  return async function (dispatch) {
    try {
      const pageNumber = 0, pageSize = 3
      let isLastPageReached = false, json, isJobsPresent = false
      const unseenStatusIds = await jobStatusService.getAllIdsForCode(UNSEEN)
      while (!isLastPageReached) {
        const tdcResponse = await sync.downloadDataFromServer(pageNumber, pageSize)
        if (tdcResponse) {
          json = await tdcResponse.json
          isLastPageReached = json.last
          if (!_.isNull(json.content) && !_.isUndefined(json.content) && !_.isEmpty(json.content)) {
            await sync.processTdcResponse(json.content)
          } else {
            isLastPageReached = true
          }
          const successSyncIds = await sync.getSyncIdFromResponse(json.content)
          //Dont hit delete sync API if successSyncIds empty
          if (!_.isNull(successSyncIds) && !_.isUndefined(successSyncIds) && !_.isEmpty(successSyncIds)) {
            isJobsPresent = true
            const allJobTransactions = await realm.getAll(TABLE_JOB_TRANSACTION)
            const unseenTransactions = await jobTransactionService.getJobTransactionsForStatusIds(allJobTransactions, unseenStatusIds)
            const jobMasterIdJobStatusIdTransactionIdDtoMap = await jobTransactionService.getJobMasterIdJobStatusIdTransactionIdDtoMap(unseenTransactions)
            const dataList = await sync.getSummaryAndTransactionIdDTO(jobMasterIdJobStatusIdTransactionIdDtoMap)
            const messageIdDTOs = []
            await sync.deleteDataFromServer(successSyncIds, messageIdDTOs, dataList.transactionIdDtos, dataList.jobSummaries)
            await jobTransactionService.updateJobTransactionStatusId(dataList.transactionIdDtos)
            jobSummaryService.updateJobSummary(dataList.jobSummaries)
          }
        } else {
          isLastPageReached = true
        }
      }
      if (isJobsPresent) {
        const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
        const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
        const customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
        const smsTemplateList = await keyValueDBService.getValueFromStore(SMS_TEMPLATE)
        let jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobMasterIdCustomizationMap.value, jobAttributeMasterList.value, jobAttributeStatusList.value, customerCareList.value, smsTemplateList.value)
        dispatch(jobFetchingEnd(jobTransactionCustomizationList))
      }
    } catch (error) {
      console.log(error)
    }
  }
}
