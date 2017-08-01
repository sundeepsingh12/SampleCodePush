/**
 * Created by udbhav on 12/4/17.
 */

import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'

import { keyValueDBService } from './KeyValueDBService'

import moment from 'moment'

const {
  JOB_MASTER,
  JOB_ATTRIBUTE,
  JOB_ATTRIBUTE_VALUE,
  FIELD_ATTRIBUTE,
  FIELD_ATTRIBUTE_VALUE,
  JOB_STATUS,
  TAB,
  CUSTOMER_CARE,
  SMS_TEMPLATE,
  USER_SUMMARY,
  JOB_SUMMARY,
  SMS_JOB_STATUS,
  JOB_MASTER_MONEY_TRANSACTION_MODE,
  FIELD_ATTRIBUTE_STATUS,
  FIELD_ATTRIBUTE_VALIDATION,
  FIELD_ATTRIBUTE_VALIDATION_CONDITION,
  JOB_LIST_CUSTOMIZATION,
  CUSTOMIZATION_APP_MODULE,
  USER,
  CUSTOMIZATION_LIST_MAP,
  TABIDMAP,
  JOB_ATTRIBUTE_STATUS,
} = require('../../lib/constants').default


class JobMaster {
  /**
   *## This will Download Job Master from server
   * Post data in JSON format
   *
   * {
      deviceIMEI: {},
      deviceSIM: {},
      currentJobMasterVersion: 19,
      deviceCompanyId: 27
  }
   *
   * @param deviceIMEI
   * @param deviceSIM
   * @param currentJobMasterVersion
   * @param deviceCompanyId
   *
   *
   * * @return
   * Expected Json Object
   * {
   *  serverTime:null,
   *  hubLatLng:null,
   *  lastSeenTimeForMessageBox:null,
   *  jobMaster:{},
   *  jobAttributeMaster:[],
   *  jobAttributeValueMaster:[],
   *  fieldAttributeMaster:[],
   *  fieldAttributeValueMaster:[],
   *  jobStatus:[],
   *  modulesCustomization:[],
   *  jobListCustomization:[],
   *  appJobStatusTabs:[],
   *  jobMasterMoneyTransactionModes:[],
   *  customerCareList:[],
   *  smsTemplatesList:[],
   *  fieldAttributeMasterStatuses:[],
   *  fieldAttributeMasterValidations:[],
   *  fieldAttributeMasterValidationConditions:[],
   *  smsJobStatuses:[],
   *  companyMDM:{},
   *  attributeTypeList:[],
   *  userSummary:{},
   *  jobSummary:[],
   *
   * }
   *
   */

  downloadJobMaster(deviceIMEI, deviceSIM, userObject, token) {
    if (!token) {
      throw new Error('Token Missing')
    }
    let postData = "",
      currentJobMasterVersion = 0,
      deviceCompanyId = 0;
    if (userObject) {
      if ((!deviceIMEI || !deviceSIM)) {
        deviceIMEI = {}
        deviceSIM = {}
        currentJobMasterVersion = userObject.value.company.currentJobMasterVersion
        deviceCompanyId = userObject.value.company.id
        postData = JSON.stringify({
          deviceIMEI,
          deviceSIM,
          currentJobMasterVersion,
          deviceCompanyId
        })
      } else {
        currentJobMasterVersion = userObject.value.company.currentJobMasterVersion
        deviceCompanyId = userObject.value.company.id
        postData = JSON.stringify({
          deviceIMEI: deviceIMEI.value,
          deviceSIM: deviceSIM.value,
          currentJobMasterVersion,
          deviceCompanyId
        })
      }
    }
    let jobMasterResponse = RestAPIFactory(token.value).serviceCall(postData, CONFIG.API.JOB_MASTER_API, 'POST')
    return jobMasterResponse
  }

  /**Saves entire job master response in store
   *
   * @param json
   */
  async saveJobMaster(json) {
    await keyValueDBService.validateAndSaveData(JOB_MASTER, json.jobMaster);
    await keyValueDBService.validateAndSaveData(USER, json.user)
    await keyValueDBService.validateAndSaveData(JOB_ATTRIBUTE, json.jobAttributeMaster)
    await keyValueDBService.validateAndSaveData(JOB_ATTRIBUTE_VALUE, json.jobAttributeValueMaster)
    await keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE, json.fieldAttributeMaster)
    await keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_VALUE, json.fieldAttributeValueMaster)
    await keyValueDBService.validateAndSaveData(JOB_STATUS, json.jobStatus)
    await keyValueDBService.validateAndSaveData(CUSTOMIZATION_APP_MODULE, json.modulesCustomization)
    let jobMasterIdCustomizationMap = await this.prepareCustomizationListMap(json.jobListCustomization)
    await keyValueDBService.validateAndSaveData(CUSTOMIZATION_LIST_MAP, jobMasterIdCustomizationMap)
    await keyValueDBService.validateAndSaveData(JOB_ATTRIBUTE_STATUS, json.jobAttributeMasterStatuses)
    let tabs = await this.validateAndSortTabList(json.appJobStatusTabs)
    await keyValueDBService.validateAndSaveData(TAB, tabs)
    await keyValueDBService.validateAndSaveData(JOB_MASTER_MONEY_TRANSACTION_MODE, json.jobMasterMoneyTransactionModes)
    await keyValueDBService.validateAndSaveData(CUSTOMER_CARE, json.customerCareList)
    await keyValueDBService.validateAndSaveData(SMS_TEMPLATE, json.smsTemplatesList)
    await keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_STATUS, json.fieldAttributeMasterStatuses)
    await keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_VALIDATION, json.fieldAttributeMasterValidations)
    await keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_VALIDATION_CONDITION, json.fieldAttributeMasterValidationConditions)
    await keyValueDBService.validateAndSaveData(SMS_JOB_STATUS, json.smsJobStatuses)
    await keyValueDBService.validateAndSaveData(USER_SUMMARY, json.userSummary)
    await keyValueDBService.validateAndSaveData(JOB_SUMMARY, json.jobSummary)
  }

  /**
   * 
   * @param {*} jobListCustomization 
   * prepares HashMap<JobMasterId,HashMap<AppListMasterId,CustomizationListDTO>
     CustomizationListDTO - {
      appJobListMasterId
      delimiterType
      endTime
      fieldAttr: [
        {
          jobAttributeMasterId
          fieldAttributeMasterId
        }
      ]
      jobAttr: [
        {
          jobAttributeMasterId
          fieldAttributeMasterId
        }
      ]
      jobMasterId
      noOfAttempts
      referenceNo
      runsheetNo
      separator
      slot
      startTime      
      trackKm
      trackHalt
      trackCallCount
      trackCallDuration
      trackSmsCount
      trackTransactionTimeSpent
     }
   */
  prepareCustomizationListMap(jobListCustomization) {
    if (!jobListCustomization) {
      return {}
    }
    let jobMasterIdCustomizationMap = {}
    jobListCustomization.forEach(jobListCustomizationObject => {
      if(!jobMasterIdCustomizationMap[jobListCustomizationObject.jobMasterId]) {
        jobMasterIdCustomizationMap[jobListCustomizationObject.jobMasterId] = {}
      }
      jobMasterIdCustomizationMap[jobListCustomizationObject.jobMasterId][jobListCustomizationObject.appJobListMasterId] = jobListCustomizationObject
    })
    return jobMasterIdCustomizationMap
  }

  /**
   * 
   * @param {*} jobStatus 
   * Map<TabId,[StatusIds]>
   */
  prepareTabStatusIdMap(jobStatus) {
    if (!jobStatus) {
      return {}
    }
    let tabIdStatusIdsMap = {}
    jobStatus.forEach(jobStatusObject => {
      if (!tabIdStatusIdsMap[jobStatusObject.tabId]) {
        tabIdStatusIdsMap[jobStatusObject.tabId] = []
      }
      tabIdStatusIdsMap[jobStatusObject.tabId].push(jobStatusObject.id)
    })
    return tabIdStatusIdsMap
  }

  /**
   * 
   * @param {*} tabs 
   * validates ,sort and save tabs list 
   * sort on basis of isDefault
   */
  validateAndSortTabList(tabs) {
    if (!tabs) {
      return []
    }
    tabs = tabs.filter(tab => tab.name.toLocaleLowerCase() !== 'hidden')
      .sort((x, y) => x.isDefault === y.isDefault ? 0 : x.isDefault ? -1 : 1);
    return tabs
  }


  /**Matches device time with server time (format 2017-07-05 16:30:02),
   * throw error if server time format is invalid 
   * or if difference >=15 minutes
   * 
   * @param {*} serverTime 
   */
  matchServerTimeWithMobileTime(serverTime) {
    const serverTimeInMillis = moment(serverTime, 'YYYY-MM-DD HH:mm:ss')
    if (!serverTimeInMillis.isValid()) {
      throw new Error("Server time format incorrect")
    }
    const currentTimeInMillis = moment()
    if (Math.abs(currentTimeInMillis - serverTimeInMillis) > 15 * 60 * 1000) {
      throw new Error("Time mismatch. Please correct time on Device")
    }
    return true
  }
}

export let jobMasterService = new JobMaster()
