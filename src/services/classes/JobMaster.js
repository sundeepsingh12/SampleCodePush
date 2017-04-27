/**
 * Created by udbhav on 12/4/17.
 */

import JobMasterInterface  from '../interfaces/JobMasterInterface'
import {storeConfig} from '../../lib/StoreConfig'

import BackendFactory from '../../lib/BackendFactory'
import CONFIG from '../../lib/config'

class JobMaster{
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

    /**This saves lastSeenTimeForMessageBox in store
     *
     * @param lastSeenTimeForMessageBox
     *
     * @return
     * boolean
     */
    saveLastSeenTimeForMessageBox(lastSeenTimeForMessageBox){
        if(lastSeenTimeForMessageBox !== null && lastSeenTimeForMessageBox !== undefined)
            storeConfig.saveLastSeenTimeForMessageBox(lastSeenTimeForMessageBox)
    }

    /**
     * @return
     * lastSeenTimeForMessageBox
     */
    getlastSeenTimeForMessageBox(lastSeenTimeForMessageBox){
        return storeConfig.getlastSeenTimeForMessageBox(lastSeenTimeForMessageBox)
    }

    /**
     * Checks whether difference between server time and current mobile time is greater than 15 minutes
     *
     * @param serverTime
     *
     *
     * @return
     * isTimeValid: false
     */
    matchServerTimeWithMobileTime(serverTime){
        const serverTimeInMillis = new Date(serverTime).getTime()
        const currentTimeInMillis = new Date().getTime();
        if(currentTimeInMillis - serverTimeInMillis > 15*60*1000){
            return false
        }
        return true
    }

    /**This saves hubLatLng in store
     *
     * @param hubLatLng
     *
     * @return
     * isSaveSuccess: true
     */
    saveHubLatLong(hubLatLng){
        if(hubLatLng !== null && hubLatLng !== undefined)
            storeConfig.saveHubLatLong(hubLatLng)
    }

    /**
     * @return
     * hubLatLng
     */
    getHubLatLong(hubLatLng) {
        return storeConfig.getHubLatLong(hubLatLng)
    }


    /**This saves entire UserObject in store
     *
     * @param user
     *
     * @return
     * isSaveSuccess: true
     */
    saveUser(userObject){
        if(userObject !== null && userObject !== undefined)
            storeConfig.saveUser(userObject)
    }

    /**This gets userObject from store
     * @return
     * userObject
     */
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

    /**
     *This saves entire jobAttributesMaster array in store
     * @param jobAttributesMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveJobAttributeMaster(jobAttributeMaster) {
        if(jobAttributeMaster !== null && jobAttributeMaster !== undefined)
            storeConfig.saveJobAttributeMaster(jobAttributeMaster)
    }

    getJobAttributeMaster() {
        return storeConfig.getJobAttributeMaster()
    }

    /**
     *This saves entire jobAttributesValueMaster array in store
     * @param jobAttributesValueMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        if(jobAttributeValueMaster !== null && jobAttributeValueMaster !== undefined)
            storeConfig.saveJobAttributeValueMaster(jobAttributeValueMaster)
    }

    /**
     *
     * @return
     * jobAttributeValueMaster
     */
    getJobAttributeValueMaster() {
        return storeConfig.getJobAttributeValueMaster()
    }


    /**
     *This saves entire fieldAttributeMaster array in store
     * @param fieldAttributeMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveFieldAttributeMaster(fieldAttributeMaster) {
        if(fieldAttributeMaster !== null && fieldAttributeMaster !== undefined)
            storeConfig.saveFieldAttributeMaster(fieldAttributeMaster)
    }

    getFieldAttributeMaster() {
        return storeConfig.getFieldAttributeMaster()
    }

    /**
     *This saves entire fieldAttributesValueMaster array in store
     * @param fieldAttributesValueMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveFieldAttributeValueMaster(fieldAttributeValueMaster) {
        if(fieldAttributeValueMaster !== null && fieldAttributeValueMaster !== undefined)
            storeConfig.saveFieldAttributeValueMaster(fieldAttributeValueMaster)
    }

    getFieldAttributeValueMaster() {
        return storeConfig.getFieldAttributeValueMaster()
    }

    /**
     *This saves entire jobStatus array in store
     * @param jobStatus
     *
     * @return
     * isSaveSuccess: true
     */
    saveJobStatus(jobStatus) {
        if(jobStatus !== null && jobStatus !== undefined)
            storeConfig.saveJobStatus(jobStatus)
    }

    getJobStatus() {
        return storeConfig.getJobStatus()
    }

    /**This saves entire customizationAppModules array in store
     *
     * @param customizationAppModules
     *
     * @return
     * isSaveSuccess: true
     */
    saveCustomizationAppModules(customizationAppModules) {
        if(customizationAppModules !== null && customizationAppModules !== undefined)
            storeConfig.saveCustomizationAppModules(customizationAppModules)
    }

    getCustomizationAppModules() {
        return storeConfig.getCustomizationAppModules()
    }

    /**This saves entire saveCustomizationJobList array in store
     *
     * @param customizationJobList
     *
     * @return
     * boolean
     */
    saveCustomizationJobList(customizationJobList) {
        if(customizationJobList !== null && customizationJobList !== undefined)
            storeConfig.saveCustomizationJobList(customizationJobList)
    }

    getCustomizationJobList() {
        return storeConfig.getCustomizationJobList()
    }

    /**This saves entire tabs array in store
     *
     * @param tabs
     *
     * @return
     * isSaveSuccess: true
     */
    saveTabs(tabs) {
        if(tabs !== null && tabs !== undefined)
            storeConfig.saveTabs(tabs)
    }

    getTabs() {
        return storeConfig.getTabs()
    }


    /**
     *This saves entire jobMoneyTransactionMode array in store
     * @param jobMoneyTransactionMode
     *
     * @return
     * boolean
     */
    saveJobMoneyTransactionMode(jobMoneyTransactionMode){
        if(jobMoneyTransactionMode !== null && jobMoneyTransactionMode !== undefined)
            storeConfig.saveJobMoneyTransactionMode(jobMoneyTransactionMode)
    }

    getJobMoneyTransactionMode() {
        return storeConfig.getJobMoneyTransactionMode()
    }

    /**
     *This saves entire cutomerCare array in store
     * @param cutomerCare
     *
     * @return
     * isSaveSuccess: true
     */
    saveCustomerCare(customerCare){
        if(customerCare!==null && customerCare!==undefined)
            storeConfig.saveCustomerCare()
    }

    /**
     *
     * @return
     * customerCare
     */
    getCustomerCare(){
        return storeConfig.getCustomerCare()
    }


    /**
     *This saves entire smsTemplate array in store
     * @param smsTemplate
     *
     * @return
     * isSaveSuccess: true
     */

    saveSmsTemplate(smsTemplate){
        if(smsTemplate !== null && smsTemplate !== undefined)
            storeConfig.saveSmsTemplate(smsTemplate)
    }

    getSmsTemplate() {
        return storeConfig.getSmsTemplate()
    }

    /**This saves entire fieldAttributeStatus array in store
     *
     * @param fieldAttributeStatus
     *
     * @return
     * isSaveSuccess: true
     */
    saveFieldAttributeStatus(fieldAttributeStatus){
        if(fieldAttributeStatus !== null && fieldAttributeStatus !== undefined)
            storeConfig.saveFieldAttributeStatus(fieldAttributeStatus)
    }

    getFieldAttributeStatus() {
        return storeConfig.getFieldAttributeStatus()
    }

    /**This saves entire fieldValidations array in store
     *
     * @param fieldValidations
     *
     * @return
     * isSaveSuccess: true
     */

    saveFieldValidations(fieldValidations){
        if(fieldValidations !== null && fieldValidations !== undefined)
            storeConfig.saveFieldValidations(fieldValidations)
    }

    getFieldValidations() {
        return storeConfig.getFieldValidations()
    }

    /**This saves entire fieldValidationsConditions array in store
     *
     * @param fieldValidationsConditions
     *
     * @return
     *  isSaveSuccess: true
     */
    saveFieldValidationsConditions(fieldValidationsConditions){
        if(fieldValidationsConditions !== null && fieldValidationsConditions !== undefined)
            storeConfig.saveFieldValidationsConditions(fieldValidationsConditions)
    }

    getFieldValidationsConditions() {
        return storeConfig.getFieldValidationsConditions()
    }

    /**
     *This saves entire smsJobStatuses array in store
     * @param smsJobStatuses
     *
     * @return
     *isSaveSuccess: true
     */
    saveSmsJobStatuses(smsJobStatuses){
        if(smsJobStatuses !== null && smsJobStatuses !== undefined)
            storeConfig.saveSmsJobStatuses(smsJobStatuses)
    }

    getSmsJobStatuses() {
        return storeConfig.getSmsJobStatuses()
    }


    /**This saves entire UserSummary object in store
     *
     * @param userSummary
     *
     * @return
     * isSaveSuccess: true
     */
    saveUserSummary(userSummary){
        if(userSummary !== null && userSummary !== undefined)
            storeConfig.saveUserSummary(userSummary)
    }

    getUserSummary() {
        return storeConfig.getUserSummary()
    }

    /**This saves entire jobSummary array in store
     *
     * @param jobSummary
     *
     * @return
     *  isSaveSuccess: true
     */
    saveJobSummary(jobSummary){
        if(jobSummary !== null && jobSummary !== undefined)
            storeConfig.saveJobSummary(jobSummary)
    }

    getJobSummary() {
        return storeConfig.getJobSummary()
    }
}

export let jobMasterService = new JobMaster()
