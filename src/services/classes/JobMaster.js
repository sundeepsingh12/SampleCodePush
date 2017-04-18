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
            // jobMasterResponse = BackendFactory()._pruneEmpty(jobMasterResponse)
            return jobMasterResponse
        } catch (error) {
            throw(error)
        }
    }

    savelastSeenTimeForMessageBox(lastSeenTimeForMessageBox){
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
        appAuthToken.saveHubLatLng(hubLatLng)
    }

    getHubLatLng(hubLatLng) {
        return appAuthToken.getHubLatLng(hubLatLng)
    }

    saveUser(userObject){
        appAuthToken.saveUser(userObject)
    }

    getUser() {
        const user = appAuthToken.getUser();
        return user;
    }

    saveJobMaster(jobMaster){
        appAuthToken.saveJobMaster(jobMaster)
    }

    getJobMaster() {
        return appAuthToken.getJobMaster()
    }

    saveJobAttributeMaster(jobAttributeMaster) {
        appAuthToken.saveJobAttributeMaster(jobAttributeMaster)
    }

    getJobAttributeMaster() {
        return appAuthToken.getJobAttributeMaster()
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        appAuthToken.saveJobAttributeValueMaster(jobAttributeValueMaster)
    }

    getJobAttributeValueMaster() {
        return appAuthToken.getJobAttributeValueMaster()
    }

    saveFieldAttributeMaster(fieldAttributeMaster) {
        appAuthToken.saveFieldAttributeMaster(fieldAttributeMaster)
    }

    getFieldAttributeMaster() {
        return appAuthToken.getFieldAttributeMaster()
    }

    saveFieldAttributeValueMaster(fieldAttributeValueMaster) {
        appAuthToken.saveFieldAttributeValueMaster(fieldAttributeValueMaster)
    }

    getFieldAttributeValueMaster() {
        return appAuthToken.getFieldAttributeValueMaster()
    }

    saveJobStatus(jobStatus) {
        appAuthToken.saveJobStatus(jobStatus)
    }

    getJobStatus() {
        return appAuthToken.getJobStatus()
    }

    saveCustomizationAppModules(customizationAppModules) {
        appAuthToken.saveCustomizationAppModules(customizationAppModules)
    }

    getCustomizationAppModules() {
        return appAuthToken.getCustomizationAppModules()
    }

    saveCustomizationJobList(customizationJobList) {
        appAuthToken.saveCustomizationJobList(customizationJobList)
    }

    getCustomizationJobList() {
        return appAuthToken.getCustomizationJobList()
    }

    saveTabs(tabs) {
        appAuthToken.saveTabs(tabs)
    }

    getTabs() {
        return appAuthToken.getTabs()
    }

    saveJobMoneyTransactionMode(jobMoneyTransactionMode){
        appAuthToken.saveJobMoneyTransactionMode(jobMoneyTransactionMode)
    }

    getJobMoneyTransactionMode() {
        return appAuthToken.getJobMoneyTransactionMode()
    }

    saveSmsTemplate(smsTemplate){
        appAuthToken.saveSmsTemplate(smsTemplate)
    }

    getSmsTemplate() {
        return appAuthToken.getSmsTemplate()
    }

    saveFieldAttributeStatus(fieldAttributeStatus){
        appAuthToken.saveFieldAttributeStatus(fieldAttributeStatus)
    }

    getFieldAttributeStatus() {
        return appAuthToken.getFieldAttributeStatus()
    }

    saveFieldValidations(fieldValidations){
        appAuthToken.saveFieldValidations(fieldValidations)
    }

    getFieldValidations() {
        return appAuthToken.getFieldValidations()
    }

    saveFieldValidationsConditions(fieldValidationsConditions){
        appAuthToken.saveFieldValidationsConditions(fieldValidationsConditions)
    }

    getFieldValidationsConditions() {
        return appAuthToken.getFieldValidationsConditions()
    }

    saveSmsJobStatuses(smsJobStatuses){
        appAuthToken.saveSmsJobStatuses(smsJobStatuses)
    }

    getSmsJobStatuses() {
        return appAuthToken.getSmsJobStatuses()
    }

    saveUserSummary(userSummary){
        appAuthToken.saveUserSummary(userSummary)
    }

    getUserSummary() {
        return appAuthToken.getUserSummary()
    }

    saveJobSummary(jobSummary){
        appAuthToken.saveJobSummary(jobSummary)
    }

    getJobSummary() {
        return appAuthToken.getJobSummary()
    }
}

export let jobMasterService = new JobMaster()
