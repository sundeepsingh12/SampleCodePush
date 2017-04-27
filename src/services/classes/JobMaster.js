/**
 * Created by udbhav on 12/4/17.
 */

import {storeConfig} from '../../lib/StoreConfig'

import BackendFactory from '../../lib/BackendFactory'
import CONFIG from '../../lib/config'
import RestAPIInterface from '../../lib/RestAPIInterface'

class JobMaster {
    downloadJobMaster(deviceIMEI, deviceSIM, currentJobMasterVersion, deviceCompanyId) {
        if(deviceIMEI===null) {
            deviceIMEI = {}
        }
        if(currentJobMasterVersion===null) {
            currentJobMasterVersion=0
        }

        if(deviceSIM===null) {
            deviceSIM = {}
        }

        if(deviceCompanyId===null) {
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

    saveJSONResponse(json) {
        this.saveJobMaster(json.jobMaster)
        this.saveUser(json.user)
        this.saveJobAttributeMaster(json.jobAttributeMaster)
        this.saveJobAttributeValueMaster(json.jobAttributeValueMaster)
        this.saveFieldAttributeMaster(json.fieldAttributeMaster)
        this.saveFieldAttributeValueMaster(json.fieldAttributeValueMaster)
        this.saveJobStatus(json.jobStatus)
        this.saveCustomizationAppModules(json.modulesCustomization)
        this.saveCustomizationJobList(json.jobListCustomization)
        this.saveTabs(json.appJobStatusTabs)
        this.saveJobMoneyTransactionMode(json.jobMasterMoneyTransactionModes)
        this.saveCustomerCare(json.customerCareList)
        this.saveSmsTemplate(json.smsTemplatesList)
        this.saveFieldAttributeStatus(json.fieldAttributeMasterStatuses)
        this.saveFieldValidations(json.fieldAttributeMasterValidations)
        this.saveFieldValidationsConditions(json.fieldAttributeMasterValidationConditions)
        this.saveSmsJobStatuses(json.smsJobStatuses)
        this.saveUserSummary(json.userSummary)
        this.saveJobSummary(json.jobSummary)
    }

    matchServerTimeWithMobileTime(serverTime) {
        const serverTimeInMillis = new Date(serverTime).getTime()
        const currentTimeInMillis = new Date().getTime();
        if(currentTimeInMillis - serverTimeInMillis > 15*60*1000){
            return false
        }
        return true
    }

    saveLastSeenTimeForMessageBox(lastSeenTimeForMessageBox) {
        if(lastSeenTimeForMessageBox !== null && lastSeenTimeForMessageBox !== undefined) {
            const data = storeConfig.saveLastSeenTimeForMessageBox(lastSeenTimeForMessageBox)
            return data
        }
    }

    saveLastSeenTimeForMessageBox() {
        const lastSeenTimeForMessageBox = storeConfig.getLastSeenTimeForMessageBox()
        return lastSeenTimeForMessageBox
    }

    saveHubLatLong(hubLatLng) {
        if(hubLatLng !== null && hubLatLng !== undefined) {
            const data = storeConfig.saveHubLatLong(hubLatLng)
            return data
        }
    }

    getHubLatLong() {
        const hubLatLng = storeConfig.getHubLatLong()
        return hubLatLong
    }

    saveUser(userObject) {
        if(userObject !== null && userObject !== undefined) {
            const data = storeConfig.saveUser(userObject)
            return data
        }
    }

    getUser() {
        const user = storeConfig.getUser();
        return user
    }

    saveJobMaster(jobMaster) {
        if(jobMaster !== null && jobMaster !== undefined) {
            const data = storeConfig.saveJobMaster(jobMaster)
            return data
        }
    }

    getJobMaster() {
        const jobMaster = storeConfig.getJobMaster()
        return jobMaster
    }

    saveJobAttributeMaster(jobAttributeMaster) {
        if(jobAttributeMaster !== null && jobAttributeMaster !== undefined) {
            const data = storeConfig.saveJobAttributeMaster(jobAttributeMaster)
            return data
        }
    }

    getJobAttributeMaster() {
        const jobAttributeMaster = storeConfig.getJobAttributeMaster()
        return jobAttributeMaster
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        if(jobAttributeValueMaster !== null && jobAttributeValueMaster !== undefined) { 
            const data = storeConfig.saveJobAttributeValueMaster(jobAttributeValueMaster)
            return data
        }
    }

    getJobAttributeValueMaster() {
        const jobAttributeValueMaster = storeConfig.getJobAttributeValueMaster()
        return jobAttributeValueMaster
    }

    saveFieldAttributeMaster(fieldAttributeMaster) {
        if(fieldAttributeMaster !== null && fieldAttributeMaster !== undefined) {
            const data = storeConfig.saveFieldAttributeMaster(fieldAttributeMaster)
            return data
        }
    }

    getFieldAttributeMaster() {
        const fieldAttributeMaster = storeConfig.getFieldAttributeMaster()
        return fieldAttributeMaster
    }

    saveFieldAttributeValueMaster(fieldAttributeValueMaster) {
        if(fieldAttributeValueMaster !== null && fieldAttributeValueMaster !== undefined) {
            const data = storeConfig.saveFieldAttributeValueMaster(fieldAttributeValueMaster)
            return data
        }
    }

    getFieldAttributeValueMaster() {
        const fieldAttributeValueMaster = storeConfig.getFieldAttributeValueMaster()
        return fieldAttributeValueMaster
    }

    saveJobStatus(jobStatus) {
        if(jobStatus !== null && jobStatus !== undefined) {
            const data = storeConfig.saveJobStatus(jobStatus)
            return data
        }
    }

    getJobStatus() {
        const jobStatus = storeConfig.getJobStatus()
    }

    saveCustomizationAppModules(customizationAppModules) {
        if(customizationAppModules !== null && customizationAppModules !== undefined) {
            const data = storeConfig.saveCustomizationAppModules(customizationAppModules)
            return data
        }
    }

    getCustomizationAppModules() {
        const customizationAppModules = storeConfig.getCustomizationAppModules()
        return customizationAppModules
    }

    saveCustomizationJobList(customizationJobList) {
        if(customizationJobList !== null && customizationJobList !== undefined) {
            const data = storeConfig.saveCustomizationJobList(customizationJobList)
            return data
        }
    }

    getCustomizationJobList() {
        const customizationJobList = storeConfig.getCustomizationJobList()
        return customizationJobList
    }

    saveTabs(tabs) {
        if(tabs !== null && tabs !== undefined) {
            const data = storeConfig.saveTabs(tabs)
            return data
        }
    }

    getTabs() {
        const tabs = storeConfig.getTabs()
        return tabs
    }

    saveJobMoneyTransactionMode(jobMoneyTransactionMode) {
        if(jobMoneyTransactionMode !== null && jobMoneyTransactionMode !== undefined) {
            const data = storeConfig.saveJobMoneyTransactionMode(jobMoneyTransactionMode)
            return data
        }
    }

    getJobMoneyTransactionMode() {
        const jobMoneyTransactionMode = storeConfig.getJobMoneyTransactionMode()
        return jobMoneyTransactionMode
    }

    saveCustomerCare(customerCare) {
        if(customerCare!==null && customerCare!==undefined) {
            const data = storeConfig.saveCustomerCare()
            return data
        }
    }

    getCustomerCare() {
        const customerCare = storeConfig.getCustomerCare()
        return customerCare
    }

    saveSmsTemplate(smsTemplate) {
        if(smsTemplate !== null && smsTemplate !== undefined) {
            const data = storeConfig.saveSmsTemplate(smsTemplate)
            return data
        }
    }

    getSmsTemplate() {
        const smsTemplate = storeConfig.getSmsTemplate()
        return smsTemplate
    }

    saveFieldAttributeStatus(fieldAttributeStatus) {
        if(fieldAttributeStatus !== null && fieldAttributeStatus !== undefined) {
            const data = storeConfig.saveFieldAttributeStatus(fieldAttributeStatus)
            return data
        }
    }

    getFieldAttributeStatus() {
        const fieldAttributeStatus = storeConfig.getFieldAttributeStatus()
        return fieldAttributeStatus
    }

    saveFieldValidations(fieldValidations) {
        if(fieldValidations !== null && fieldValidations !== undefined) {
            const data = storeConfig.saveFieldValidations(fieldValidations)
            return data
        }
    }

    getFieldValidations() {
        const fieldValidations = storeConfig.getFieldValidations()
        return fieldValidations
    }

    saveFieldValidationsConditions(fieldValidationsConditions) {
        if(fieldValidationsConditions !== null && fieldValidationsConditions !== undefined) {
            const data = storeConfig.saveFieldValidationsConditions(fieldValidationsConditions)
            return data
        }
    }

    getFieldValidationsConditions() {
        const fieldValidationsConditions = storeConfig.getFieldValidationsConditions()
        return fieldValidationsConditions
    }

    saveSmsJobStatuses(smsJobStatuses) {
        if(smsJobStatuses !== null && smsJobStatuses !== undefined) {
            const data = storeConfig.saveSmsJobStatuses(smsJobStatuses)
            return data
        }
    }

    getSmsJobStatuses() {
        const smsJobStatuses = storeConfig.getSmsJobStatuses()
        return smsJobStatuses
    }

    saveUserSummary(userSummary) {
        if(userSummary !== null && userSummary !== undefined) {
            const data = storeConfig.saveUserSummary(userSummary)
            return data
        }
    }

    getUserSummary() {
        const userSummary = storeConfig.getUserSummary()
        return userSummary
    }

    saveJobSummary(jobSummary) {
        if(jobSummary !== null && jobSummary !== undefined) {
            const data = storeConfig.saveJobSummary(jobSummary)
            return data
        }
    }

    getJobSummary() {
        const jobSummary = storeConfig.getJobSummary()
        return jobSummary
    }
}

export let jobMasterService = new JobMaster()
