/**
 * Created by udbhav on 12/4/17.
 */

import JobMasterInterface  from '../interfaces/JobMasterInterface'
import {appAuthToken} from '../../lib/StoreConfig'

import BackendFactory from '../../lib/BackendFactory'

class JobMaster extends JobMasterInterface{
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

        const apiUrl = '/rest/device/job_master';
        try {
            var jobMasterResponse = BackendFactory().serviceCall(postData,apiUrl)
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
        this.saveCutomerCare(json.customerCareList)
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
            appAuthToken.savelastSeenTimeForMessageBox(lastSeenTimeForMessageBox)
    }

    matchServerTimeWithMobileTime(serverTime){
        var serverTime = new Date(serverTime).getTime()
        var currentTimeInMillis = new Date().getTime();
        if(currentTimeInMillis - serverTime > 15*60*1000){
            return false
        }
        return true
    }

    saveHubLatLng(hubLatLng){
        if(hubLatLng !== null && hubLatLng !== undefined)
            appAuthToken.saveHubLatLng(hubLatLng)
    }

    getHubLatLng(hubLatLng) {
        return appAuthToken.getHubLatLng(hubLatLng)
    }

    saveUser(userObject){
        if(userObject !== null && userObject !== undefined)
            appAuthToken.saveUser(userObject)
    }

    getUser() {
        const user = appAuthToken.getUser();
        return user;
    }

    saveJobMaster(jobMaster){
        if(jobMaster !== null && jobMaster !== undefined)
            appAuthToken.saveJobMaster(jobMaster)
    }

    getJobMaster() {
        return appAuthToken.getJobMaster()
    }

    saveJobAttributeMaster(jobAttributeMaster) {
        if(jobAttributeMaster !== null && jobAttributeMaster !== undefined)
            appAuthToken.saveJobAttributeMaster(jobAttributeMaster)
    }

    getJobAttributeMaster() {
        return appAuthToken.getJobAttributeMaster()
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        if(jobAttributeValueMaster !== null && jobAttributeValueMaster !== undefined)
            appAuthToken.saveJobAttributeValueMaster(jobAttributeValueMaster)
    }

    getJobAttributeValueMaster() {
        return appAuthToken.getJobAttributeValueMaster()
    }

    saveFieldAttributeMaster(fieldAttributeMaster) {
        if(fieldAttributeMaster !== null && fieldAttributeMaster !== undefined)
            appAuthToken.saveFieldAttributeMaster(fieldAttributeMaster)
    }

    getFieldAttributeMaster() {
        return appAuthToken.getFieldAttributeMaster()
    }

    saveFieldAttributeValueMaster(fieldAttributeValueMaster) {
        if(fieldAttributeValueMaster !== null && fieldAttributeValueMaster !== undefined)
            appAuthToken.saveFieldAttributeValueMaster(fieldAttributeValueMaster)
    }

    getFieldAttributeValueMaster() {
        return appAuthToken.getFieldAttributeValueMaster()
    }

    saveJobStatus(jobStatus) {
        if(jobStatus !== null && jobStatus !== undefined)
            appAuthToken.saveJobStatus(jobStatus)
    }

    getJobStatus() {
        return appAuthToken.getJobStatus()
    }

    saveCustomizationAppModules(customizationAppModules) {
        if(customizationAppModules !== null && customizationAppModules !== undefined)
            appAuthToken.saveCustomizationAppModules(customizationAppModules)
    }

    getCustomizationAppModules() {
        return appAuthToken.getCustomizationAppModules()
    }

    saveCustomizationJobList(customizationJobList) {
        if(customizationJobList !== null && customizationJobList !== undefined)
            appAuthToken.saveCustomizationJobList(customizationJobList)
    }

    getCustomizationJobList() {
        return appAuthToken.getCustomizationJobList()
    }

    saveTabs(tabs) {
        if(tabs !== null && tabs !== undefined)
            appAuthToken.saveTabs(tabs)
    }

    getTabs() {
        return appAuthToken.getTabs()
    }

    saveJobMoneyTransactionMode(jobMoneyTransactionMode){
        if(jobMoneyTransactionMode !== null && jobMoneyTransactionMode !== undefined)
            appAuthToken.saveJobMoneyTransactionMode(jobMoneyTransactionMode)
    }

    getJobMoneyTransactionMode() {
        return appAuthToken.getJobMoneyTransactionMode()
    }

    saveSmsTemplate(smsTemplate){
        if(smsTemplate !== null && smsTemplate !== undefined)
            appAuthToken.saveSmsTemplate(smsTemplate)
    }

    getSmsTemplate() {
        return appAuthToken.getSmsTemplate()
    }

    saveFieldAttributeStatus(fieldAttributeStatus){
        if(fieldAttributeStatus !== null && fieldAttributeStatus !== undefined)
            appAuthToken.saveFieldAttributeStatus(fieldAttributeStatus)
    }

    getFieldAttributeStatus() {
        return appAuthToken.getFieldAttributeStatus()
    }

    saveFieldValidations(fieldValidations){
        if(fieldValidations !== null && fieldValidations !== undefined)
            appAuthToken.saveFieldValidations(fieldValidations)
    }

    getFieldValidations() {
        return appAuthToken.getFieldValidations()
    }

    saveFieldValidationsConditions(fieldValidationsConditions){
        if(fieldValidationsConditions !== null && fieldValidationsConditions !== undefined)
            appAuthToken.saveFieldValidationsConditions(fieldValidationsConditions)
    }

    getFieldValidationsConditions() {
        return appAuthToken.getFieldValidationsConditions()
    }

    saveSmsJobStatuses(smsJobStatuses){
        if(smsJobStatuses !== null && smsJobStatuses !== undefined)
            appAuthToken.saveSmsJobStatuses(smsJobStatuses)
    }

    getSmsJobStatuses() {
        return appAuthToken.getSmsJobStatuses()
    }

    saveUserSummary(userSummary){
        if(userSummary !== null && userSummary !== undefined)
            appAuthToken.saveUserSummary(userSummary)
    }

    getUserSummary() {
        return appAuthToken.getUserSummary()
    }

    saveJobSummary(jobSummary){
        if(jobSummary !== null && jobSummary !== undefined)
            appAuthToken.saveJobSummary(jobSummary)
    }

    getJobSummary() {
        return appAuthToken.getJobSummary()
    }
}

export let jobMasterService = new JobMaster()
