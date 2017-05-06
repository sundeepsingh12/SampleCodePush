/**
 * Created by udbhav on 12/4/17.
 */

import { keyValueDB } from '../../repositories/keyValueDb'

import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'

import RestAPIInterface from '../../lib/RestAPIInterface'
import {keyValueDBService} from './KeyValueDBService'

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

    downloadJobMaster(deviceIMEI, deviceSIM,userObject) {
        let postData = "",currentJobMasterVersion=0,deviceCompanyId=0;
        if((!deviceIMEI || !deviceSIM) && userObject){
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
        }
        else if(deviceIMEI){
            currentJobMasterVersion = userObject.value.currentJobMasterVersion
            deviceCompanyId = userObject.value.company.id
            postData = JSON.stringify({
                deviceIMEI,
                deviceSIM,
                currentJobMasterVersion,
                deviceCompanyId
            })
        }
        let jobMasterResponse = RestAPIFactory().serviceCall(postData, CONFIG.API.JOB_MASTER_API, 'POST')
        jobMasterResponse = RestAPIFactory()._pruneEmpty(jobMasterResponse)
        return jobMasterResponse
    }

    /**
     *
     * @param json
     */
    saveJobMaster(json) {
        keyValueDBService.validateAndSaveData(JOB_MASTER, json.jobMaster);
        keyValueDBService.validateAndSaveData(USER, json.user)
        keyValueDBService.validateAndSaveData(JOB_ATTRIBUTE, json.jobAttributeMaster)
        keyValueDBService.validateAndSaveData(JOB_ATTRIBUTE_VALUE, json.jobAttributeValueMaster)
        keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE, json.fieldAttributeMaster)
        keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_VALUE, json.fieldAttributeValueMaster)
        keyValueDBService.validateAndSaveData(JOB_STATUS, json.jobStatus)
        keyValueDBService.validateAndSaveData(CUSTOMIZATION_APP_MODULE, json.modulesCustomization)
        keyValueDBService.validateAndSaveData(JOB_LIST_CUSTOMIZATION, json.jobListCustomization)
        keyValueDBService.validateAndSaveData(TAB, json.appJobStatusTabs)
        keyValueDBService.validateAndSaveData(JOB_MASTER_MONEY_TRANSACTION_MODE, json.jobMasterMoneyTransactionModes)
        keyValueDBService.validateAndSaveData(CUSTOMER_CARE, json.customerCareList)
        keyValueDBService.validateAndSaveData(SMS_TEMPLATE, json.smsTemplatesList)
        keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_STATUS, json.fieldAttributeMasterStatuses)
        keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_VALIDATION, json.fieldAttributeMasterValidations)
        keyValueDBService.validateAndSaveData(FIELD_ATTRIBUTE_VALIDATION_CONDITION, json.fieldAttributeMasterValidationConditions)
        keyValueDBService.validateAndSaveData(SMS_JOB_STATUS, json.smsJobStatuses)
        keyValueDBService.validateAndSaveData(USER_SUMMARY, json.userSummary)
        keyValueDBService.validateAndSaveData(JOB_SUMMARY, json.jobSummary)
    }

    /**This matches device's time with server time,returns fail if difference is more than 15 minutes
     *
     * @param serverTime
     * @return {boolean}
     */
    matchServerTimeWithMobileTime(serverTime) {
        console.log("matchServerTimeWithMobileTime start")
        const serverTimeInMillis = new Date(serverTime).getTime()
        console.log(serverTimeInMillis)
        const currentTimeInMillis = new Date().getTime();
        if (serverTimeInMillis) {
            console.log("no error")
            if (currentTimeInMillis - serverTimeInMillis > 15 * 60 * 1000) {
                return false
            }
            return true
        } else {
            console.log("parse error")
            throw ("Server Time format incorrect")
        }
    }

    /**Possible values of message returned from server -
     * 1. Access is denied
     * 2. Verified IMEI not valid for that HUB
     * 3. IMEI Not Verified. Please verify it from server.
     *
     * @param message
     */
    checkIfHubAndImeiIsValid(message){
        if(message==='Access is denied' || message==='Verified IMEI not valid for that HUB!!!' || message==='IMEI Not Verified. Please verify it from server.'){
           throw message
        }
        else{
            return true
        }
    }
}

export let jobMasterService = new JobMaster()
