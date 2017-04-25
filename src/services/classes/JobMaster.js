/**
 * Created by udbhav on 12/4/17.
 */

import JobMasterInterface  from '../interfaces/JobMasterInterface'
import {storeConfig} from '../../lib/StoreConfig'

import BackendFactory from '../../lib/BackendFactory'
import CONFIG from '../../lib/config'

class JobMaster{
    downloadJobMaster(deviceIMEI, deviceSIM, currentJobMasterVersion, deviceCompanyId) {
        if(deviceIMEI===null){
            deviceIMEI = {}
        }
        if(currentJobMasterVersion===null){
            currentJobMasterVersion=0
        }

        if(deviceSIM===null){
            deviceSIM = {}
        }

        if(deviceCompanyId===null){
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

    savelastSeenTimeForMessageBox(lastSeenTimeForMessageBox){
        if(lastSeenTimeForMessageBox !== null && lastSeenTimeForMessageBox !== undefined)
            storeConfig.savelastSeenTimeForMessageBox(lastSeenTimeForMessageBox)
    }

    matchServerTimeWithMobileTime(serverTime){
        const serverTimeInMillis = new Date(serverTime).getTime()
        const currentTimeInMillis = new Date().getTime();
        if(currentTimeInMillis - serverTimeInMillis > 15*60*1000){
            return false
        }
        return true
    }

    saveHubLatLng(hubLatLng){
        if(hubLatLng !== null && hubLatLng !== undefined)
            storeConfig.saveHubLatLng(hubLatLng)
    }

    getHubLatLng(hubLatLng) {
        return storeConfig.getHubLatLng(hubLatLng)
    }

    saveUser(userObject){
        if(userObject !== null && userObject !== undefined)
            storeConfig.saveUser(userObject)
    }

    getUser() {
        const user = storeConfig.getUser();
        return user;
    }

    saveJobMaster(jobMaster){
        if(jobMaster !== null && jobMaster !== undefined)
            storeConfig.saveJobMaster(jobMaster)
    }

    getJobMaster() {
        return storeConfig.getJobMaster()
    }

    saveJobAttributeMaster(jobAttributeMaster) {
        if(jobAttributeMaster !== null && jobAttributeMaster !== undefined)
            storeConfig.saveJobAttributeMaster(jobAttributeMaster)
    }

    getJobAttributeMaster() {
        return storeConfig.getJobAttributeMaster()
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        if(jobAttributeValueMaster !== null && jobAttributeValueMaster !== undefined)
            storeConfig.saveJobAttributeValueMaster(jobAttributeValueMaster)
    }

    getJobAttributeValueMaster() {
        return storeConfig.getJobAttributeValueMaster()
    }

    saveFieldAttributeMaster(fieldAttributeMaster) {
        if(fieldAttributeMaster !== null && fieldAttributeMaster !== undefined)
            storeConfig.saveFieldAttributeMaster(fieldAttributeMaster)
    }

    getFieldAttributeMaster() {
        return storeConfig.getFieldAttributeMaster()
    }

    saveFieldAttributeValueMaster(fieldAttributeValueMaster) {
        if(fieldAttributeValueMaster !== null && fieldAttributeValueMaster !== undefined)
            storeConfig.saveFieldAttributeValueMaster(fieldAttributeValueMaster)
    }

    getFieldAttributeValueMaster() {
        return storeConfig.getFieldAttributeValueMaster()
    }

    saveJobStatus(jobStatus) {
        if(jobStatus !== null && jobStatus !== undefined)
            storeConfig.saveJobStatus(jobStatus)
    }

    getJobStatus() {
        return storeConfig.getJobStatus()
    }

    saveCustomizationAppModules(customizationAppModules) {
        if(customizationAppModules !== null && customizationAppModules !== undefined)
            storeConfig.saveCustomizationAppModules(customizationAppModules)
    }

    getCustomizationAppModules() {
        return storeConfig.getCustomizationAppModules()
    }

    saveCustomizationJobList(customizationJobList) {
        if(customizationJobList !== null && customizationJobList !== undefined)
            storeConfig.saveCustomizationJobList(customizationJobList)
    }

    getCustomizationJobList() {
        return storeConfig.getCustomizationJobList()
    }

    saveTabs(tabs) {
        if(tabs !== null && tabs !== undefined)
            storeConfig.saveTabs(tabs)
    }

    getTabs() {
        return storeConfig.getTabs()
    }

    saveJobMoneyTransactionMode(jobMoneyTransactionMode){
        if(jobMoneyTransactionMode !== null && jobMoneyTransactionMode !== undefined)
            storeConfig.saveJobMoneyTransactionMode(jobMoneyTransactionMode)
    }

    getJobMoneyTransactionMode() {
        return storeConfig.getJobMoneyTransactionMode()
    }

    saveCustomerCare(customerCare){
        if(customerCare!==null && customerCare!==undefined)
            storeConfig.saveCustomerCare()
    }

    getCustomerCare(){
        return storeConfig.getCustomerCare()
    }

    saveSmsTemplate(smsTemplate){
        if(smsTemplate !== null && smsTemplate !== undefined)
            storeConfig.saveSmsTemplate(smsTemplate)
    }

    getSmsTemplate() {
        return storeConfig.getSmsTemplate()
    }

    saveFieldAttributeStatus(fieldAttributeStatus){
        if(fieldAttributeStatus !== null && fieldAttributeStatus !== undefined)
            storeConfig.saveFieldAttributeStatus(fieldAttributeStatus)
    }

    getFieldAttributeStatus() {
        return storeConfig.getFieldAttributeStatus()
    }

    saveFieldValidations(fieldValidations){
        if(fieldValidations !== null && fieldValidations !== undefined)
            storeConfig.saveFieldValidations(fieldValidations)
    }

    getFieldValidations() {
        return storeConfig.getFieldValidations()
    }

    saveFieldValidationsConditions(fieldValidationsConditions){
        if(fieldValidationsConditions !== null && fieldValidationsConditions !== undefined)
            storeConfig.saveFieldValidationsConditions(fieldValidationsConditions)
    }

    getFieldValidationsConditions() {
        return storeConfig.getFieldValidationsConditions()
    }

    saveSmsJobStatuses(smsJobStatuses){
        if(smsJobStatuses !== null && smsJobStatuses !== undefined)
            storeConfig.saveSmsJobStatuses(smsJobStatuses)
    }

    getSmsJobStatuses() {
        return storeConfig.getSmsJobStatuses()
    }

    saveUserSummary(userSummary){
        if(userSummary !== null && userSummary !== undefined)
            storeConfig.saveUserSummary(userSummary)
    }

    getUserSummary() {
        return storeConfig.getUserSummary()
    }

    saveJobSummary(jobSummary){
        if(jobSummary !== null && jobSummary !== undefined)
            storeConfig.saveJobSummary(jobSummary)
    }

    getJobSummary() {
        return storeConfig.getJobSummary()
    }
}

export let jobMasterService = new JobMaster()
