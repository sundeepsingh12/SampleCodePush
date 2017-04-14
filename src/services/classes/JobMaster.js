/**
 * Created by udbhav on 12/4/17.
 */

import JobMasterInterface  from '../interfaces/JobMasterInterface'
import {appAuthToken} from '../../lib/StoreConfig'

export default class JobMaster extends JobMasterInterface{
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
            return BackendFactory().serviceCall(postData,apiUrl)
        } catch (error) {
            throw(error)
        }
    }

    savelastSeenTimeForMessageBox(lastSeenTimeForMessageBox){
        appAuthToken.savelastSeenTimeForMessageBox(lastSeenTimeForMessageBox)
    }

    matchServerTimeWithMobileTime(serverTime){
        var serverTime = new Date(appAuthToken.getServerTime()).getTime()
        var currentTimeInMillis = new Date().getTime();
        if(currentTimeInMillis - serverTime > 15*60*1000){
            return false
        }
        return true
    }

    savehubLatLng(hubLatLng){
        appAuthToken.savehubLatLng(hubLatLng)
    }

    saveUser(userObject){
        appAuthToken.saveUser(userObject)
    }

    saveJobMaster(jobMaster){
        appAuthToken.saveJobMaster(jobMaster)
    }

    saveJobAttributeMaster(jobAttributeMaster) {
        appAuthToken.saveJobAttributeMaster(jobAttributeMaster)
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        appAuthToken.saveJobAttributeValueMaster(jobAttributeValueMaster)
    }

    saveFieldAttributeMaster(fieldAttributeMaster) {
        appAuthToken.saveFieldAttributeMaster(fieldAttributeMaster)
    }

    saveFieldAttributeValueMaster(fieldAttributeValueMaster) {
        appAuthToken.saveFieldAttributeValueMaster(fieldAttributeValueMaster)
    }

    saveJobStatus(jobStatus) {
        appAuthToken.saveJobStatus(jobStatus)
    }

    saveCustomizationAppModules(customizationAppModules) {
        appAuthToken.saveCustomizationAppModules(customizationAppModules)
    }

    saveCustomizationJobList(customizationJobList) {
        appAuthToken.saveCustomizationJobList(customizationJobList)
    }

    saveTabs(tabs) {
        appAuthToken.saveTabs(tabs)
    }

    saveJobMoneyTransactionMode(jobMoneyTransactionMode){
        appAuthToken.saveJobMoneyTransactionMode(jobMoneyTransactionMode)
    }

    saveSmsTemplate(smsTemplate){
        appAuthToken.saveSmsTemplate(smsTemplate)
    }

    saveFieldAttributeStatus(fieldAttributeStatus){
        appAuthToken.saveFieldAttributeStatus(fieldAttributeStatus)
    }

    saveFieldValidations(fieldValidations){
        appAuthToken.saveFieldValidations(fieldValidations)
    }

    saveFieldValidationsConditions(fieldValidationsConditions){
        appAuthToken.saveFieldValidationsConditions(fieldValidationsConditions)
    }

    saveSmsJobStatuses(smsJobStatuses){
        appAuthToken.saveSmsJobStatuses(smsJobStatuses)
    }

    saveUserSummary(userSummary){
        appAuthToken.saveUserSummary(userSummary)
    }

    saveJobSummary(jobSummary){
        appAuthToken.saveJobSummary(jobSummary)
    }

    checkIfJobMasterIsNull(jobMaster){
        if(appAuthToken.getJobMaster()==null){
            return true
        }
        return false
    }

}
