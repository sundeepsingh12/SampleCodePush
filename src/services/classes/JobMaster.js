/**
 * Created by udbhav on 12/4/17.
 */

import {keyValueDB} from '../../repositories/keyValueDb'

import BackendFactory from '../../lib/BackendFactory'
import CONFIG from '../../lib/config'

const {
    jobMaster,
    user,
    jobAttribute,
    jobAttributeValue,
    fieldAttribute,
    fieldAttributeValue,
    jobStatus,
    tab,
    customerCare,
    smsTemplate,
    userSummary,
    jobSummary,
    smsJobStatus,
    jobMasterMoneyTransactionMode,
    fieldAttributeStatus,
    fieldAttributeValidation,
    fieldAttributeValidationCondition,
    jobListCustomization,
    customizationAppModule

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

    downloadJobMaster(deviceIMEI, deviceSIM, currentJobMasterVersion, deviceCompanyId) {
        if(!deviceIMEI) {
            deviceIMEI = {}
        }
        if(!currentJobMasterVersion) {
            currentJobMasterVersion=0
        }

        if(!deviceSIM) {
            deviceSIM = {}
        }

        if(!deviceCompanyId) {
            deviceCompanyId = 0
        }

        const postData = JSON.stringify({
            deviceIMEI,
            deviceSIM,
            currentJobMasterVersion,
            deviceCompanyId
        })

        try {
            let jobMasterResponse = BackendFactory().serviceCall(postData,CONFIG.API.JOB_MASTER_API,'POST')
            jobMasterResponse = BackendFactory()._pruneEmpty(jobMasterResponse)
            return jobMasterResponse
        } catch (error) {
            throw(error)
        }
    }

    /**
     *
     * @param json
     */
    saveJobMaster(json) {
        this.validateAndSaveData(jobMaster,json.jobMaster);
        this.validateAndSaveData(user,json.user)
        this.validateAndSaveData(jobAttribute,json.jobAttributeMaster)
        this.validateAndSaveData(jobAttributeValue,json.jobAttributeValueMaster)
        this.validateAndSaveData(fieldAttribute,json.fieldAttributeMaster)
        this.validateAndSaveData(fieldAttributeValue,json.fieldAttributeValueMaster)
        this.validateAndSaveData(jobStatus,json.jobStatus)
        this.validateAndSaveData(customizationAppModule,json.modulesCustomization)
        this.validateAndSaveData(jobListCustomization,json.jobListCustomization)
        this.validateAndSaveData(tab,json.appJobStatusTabs)
        this.validateAndSaveData(jobMasterMoneyTransactionMode,json.jobMasterMoneyTransactionModes)
        this.validateAndSaveData(customerCare,json.customerCareList)
        this.validateAndSaveData(smsTemplate,json.smsTemplatesList)
        this.validateAndSaveData(fieldAttributeStatus,json.fieldAttributeMasterStatuses)
        this.validateAndSaveData(fieldAttributeValidation,json.fieldAttributeMasterValidations)
        this.validateAndSaveData(fieldAttributeValidationCondition,json.fieldAttributeMasterValidationConditions)
        this.validateAndSaveData(smsJobStatus,json.smsJobStatuses)
        this.validateAndSaveData(userSummary,json.userSummary)
        this.validateAndSaveData(jobSummary,json.jobSummary)
    }

    /**This matches device's time with server time,returns fail if difference is more than 15 minutes
     *
     * @param serverTime
     * @return {boolean}
     */
    matchServerTimeWithMobileTime(serverTime) {
        const serverTimeInMillis = new Date(serverTime).getTime()
        const currentTimeInMillis = new Date().getTime();
        if(currentTimeInMillis - serverTimeInMillis > 15*60*1000){
            return false
        }
        return true
    }

    validateAndSaveData(schemaName,data){
        const storeValue = keyValueDB.validateAndSaveData(schemaName,data);
        return storeValue
    }

    getValueFromStore(schemaName){
        const storeValue = keyValueDB.getValueFromStore(schemaName);
        return storeValue;
    }
}

export let jobMasterService = new JobMaster()
