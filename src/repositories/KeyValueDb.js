/**
 * # StoreConfig.js
 *
 * A thin wrapper over the react-native-simple-store
 *
 */
'use strict'
/**
 * ## Imports
 *
 * Redux  & the config file
 */
import store from 'react-native-simple-store'
import CONFIG from '../lib/config'
import CONSTANT from '../lib/constants'
import validate from "json-schema"

const {
    JOB_MASTER_SCHEMA,
    USER_SCHEMA,
    JOB_ATTRIBUTE_SCHEMA,
    JOB_ATTRIBUTE_VALUE_SCHEMA,
    FIELD_ATTRIBUTE_SCHEMA,
    FIELD_ATTRIBUTE_VALUE_SCHEMA,
    JOB_STATUS_SCHEMA,
    TAB_SCHEMA,
    CUSTOMER_CARE_SCHEMA,
    SMS_TEMPLATE_SCHEMA,
    USER_SUMMARY_SCHEMA,
    JOB_SUMMARY_SCHEMA,
    SMS_JOB_STATUS_SCHEMA,
    JOB_MASTER_MONEY_TRANSACTION_MODE_SCHEMA,
    FIELD_ATTRIBUTE_STATUS_SCHEMA,
    FIELD_ATTRIBUTE_VALIDATION_SCHEMA,
    FIELD_ATTRIBUTE_VALIDATION_CONDITION_SCHEMA

} = require('../lib/constants').default


export class StoreConfig {
    constructor() {
        this.SESSION_TOKEN_KEY = CONFIG.SESSION_TOKEN_KEY
        this.SERVER_TIME = CONSTANT.SERVER_TIME
        this.HUB = CONSTANT.HUB
        this.SERVER_APK_VERSION = CONSTANT.SERVER_APK_VERSION
        this.LAST_SEEN_TIME_FOR_MESSAGE_BOX = CONSTANT.LAST_SEEN_TIME_FOR_MESSAGE_BOX
        this.HUB_LAT_LONG = CONSTANT.HUB_LAT_LONG
        this.USER = CONSTANT.USER
        this.COMPANY = CONSTANT.COMPANY
        this.JOB_MASTER = CONSTANT.JOB_MASTER
        this.JOB_ATTRIBUTE_MASTER = CONSTANT.JOB_ATTRIBUTE_MASTER
        this.JOB_ATTRIBUTE_VALUE_MASTER = CONSTANT.JOB_ATTRIBUTE_VALUE_MASTER
        this.FIELD_ATTRIBUTE_MASTER = CONSTANT.FIELD_ATTRIBUTE_MASTER
        this.FIELD_ATTRIBUTE_VALUE_MASTER = CONSTANT.FIELD_ATTRIBUTE_VALUE_MASTER
        this.JOB_STATUS = CONSTANT.JOB_STATUS
        this.CUSTOMIZATION_APP_MODULES = CONSTANT.CUSTOMIZATION_APP_MODULES
        this.CUSTOMIZATION_JOB_LIST = CONSTANT.CUSTOMIZATION_JOB_LIST
        this.TABS = CONSTANT.TABS
        this.JOB_MONEY_TRANSACTION_MODE = CONSTANT.JOB_MONEY_TRANSACTION_MODE
        this.CUSTOMER_CARE = CONSTANT.CUSTOMER_CARE
        this.SMS_TEMPLATE = CONSTANT.SMS_TEMPLATE
        this.FIELD_ATTRIBUTE_STATUS = CONSTANT.FIELD_ATTRIBUTE_STATUS
        this.FIELD_VALIDATIONS = CONSTANT.FIELD_VALIDATIONS
        this.FIELD_VALIDATION_CONDITIONS = CONSTANT.FIELD_VALIDATION_CONDITIONS
        this.SMS_JOB_STATUSES = CONSTANT.SMS_JOB_STATUSES
        this.MDM_POLICIES = CONSTANT.MDM_POLICIES
        this.USER_SUMMARY = CONSTANT.USER_SUMMARY
        this.JOB_SUMMARY = CONSTANT.JOB_SUMMARY
        this.DEVICE_IMEI = CONSTANT.DEVICE_IMEI
        this.DEVICE_SIM = CONSTANT.DEVICE_SIM

    }

    validateAndSaveData(schemaName,value){
        let instance = '',storeKey = '';
        switch(schemaName){
            case JOB_MASTER_SCHEMA:
                storeKey = this.JOB_MASTER;
                instance = require ('../repositories/schema/jobMaster');
                break;
            case USER_SCHEMA:
                storeKey = this.USER;
                instance = require ('../repositories/schema/user');
                break;
            case JOB_ATTRIBUTE_SCHEMA:
                storeKey = this.JOB_ATTRIBUTE_MASTER;
                instance = require ('../repositories/schema/jobAttribute');
                break;
            case JOB_ATTRIBUTE_VALUE_SCHEMA:
                storeKey = this.JOB_ATTRIBUTE_VALUE_MASTER;
                instance = require ('../repositories/schema/jobAttributeValue');
                break;
            case FIELD_ATTRIBUTE_SCHEMA:
                storeKey = this.FIELD_ATTRIBUTE_MASTER;
                instance = require ('../repositories/schema/fieldAttribute');
                break;
            case FIELD_ATTRIBUTE_VALUE_SCHEMA:
                storeKey = this.FIELD_ATTRIBUTE_VALUE_MASTER;
                instance = require ('../repositories/schema/fieldAttributeValue');
                break;
            case JOB_STATUS_SCHEMA:
                storeKey = this.JOB_STATUS;
                instance = require ('../repositories/schema/jobStatus');
                break;
            case TAB_SCHEMA:
                storeKey = this.TABS;
                instance = require ('../repositories/schema/tab');
                break;
            case JOB_MASTER_MONEY_TRANSACTION_MODE_SCHEMA:
                storeKey = this.JOB_MONEY_TRANSACTION_MODE;
                instance = require ('../repositories/schema/jobMasterMoneyTransactionMode');
                break;
            case CUSTOMER_CARE_SCHEMA:
                storeKey = this.CUSTOMER_CARE;
                instance = require ('../repositories/schema/customerCare');
                break;
            case SMS_TEMPLATE_SCHEMA:
                storeKey = this.SMS_TEMPLATE;
                instance = require ('../repositories/schema/smsTemplate');
                break;
            case FIELD_ATTRIBUTE_STATUS_SCHEMA:
                storeKey = this.FIELD_ATTRIBUTE_STATUS;
                instance = require ('../repositories/schema/fieldAttributeStatus');
                break;
            case FIELD_ATTRIBUTE_VALIDATION_SCHEMA:
                storeKey = this.FIELD_VALIDATIONS;
                instance = require ('../repositories/schema/fieldAttributeValidation');
                break;
            case FIELD_ATTRIBUTE_VALIDATION_CONDITION_SCHEMA:
                storeKey = this.FIELD_VALIDATION_CONDITIONS;
                instance = require ('../repositories/schema/fieldAttributeValidationCondition');
                break;
            case SMS_JOB_STATUS_SCHEMA:
                storeKey = this.SMS_JOB_STATUSES;
                instance = require ('../repositories/schema/smsJobStatus');
                break;
            case USER_SUMMARY_SCHEMA:
                storeKey = this.USER_SUMMARY;
                instance = require ('../repositories/schema/userSummary');
                break;
            case JOB_SUMMARY_SCHEMA:
                storeKey = this.JOB_SUMMARY;
                instance = require ('../repositories/schema/jobSummary');
                break;
        }

        if(value && validate(instance,schemaName)){
            return store.save(storeKey, {
                value
            }).then(() => {
                return true;
            }).catch(error => {
                return error;
            })
        }

    }

    getValueFromStore(schemaName){
        const value = store.get(schemaName);
        return value;
    }
    saveServerApkVersion(serverAPKVersion) {
        return store.save(this.SERVER_APK_VERSION, {
            serverAPKVersion
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getServerApkVersion() {
        return store.get(this.SERVER_APK_VERSION)
    }

    saveServerTime(serverTime) {
        return store.save(this.SERVER_APK_VERSION, {
            serverTime
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getServerTime() {
        return store.get(this.SERVER_TIME)
    }

    saveHub(hub) {
        return store.save(this.HUB, {
            hub
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getHub() {
        return store.get(this.HUB)
    }

    saveLastSeenTimeForMessageBox(lastSeenTimeForMessageBox) {
        return store.save(this.LAST_SEEN_TIME_FOR_MESSAGE_BOX, {
            lastSeenTimeForMessageBox
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getLastSeenTimeForMessageBox() {
        return store.get(this.LAST_SEEN_TIME_FOR_MESSAGE_BOX)
    }

    saveHubLatLong(hubLatLong) {
        return store.save(this.HUB_LAT_LONG, {
            hubLatLong
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getHubLatLong() {
        return store.get(this.HUB_LAT_LONG)
    }

    saveUser(user) {
        return store.save(this.USER, {
            user
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })

    }

    getUser() {
        return store.get(this.USER)
    }

    saveJobMaster(jobMaster) {
        return store.save(this.JOB_MASTER, {
            jobMaster
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getJobMaster() {
        return store.get(this.JOB_MASTER)
    }

    saveJobAttributeMaster(jobAttributeMaster) {
        return store.save(this.JOB_ATTRIBUTE_MASTER, {
            jobAttributeMaster
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getJobAttributeMaster() {
        return store.get(this.JOB_ATTRIBUTE_MASTER)
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        return store.save(this.JOB_ATTRIBUTE_VALUE_MASTER, {
            jobAttributeValueMaster
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getJobAttributeValueMaster() {
        return store.get(this.JOB_ATTRIBUTE_VALUE_MASTER)
    }

    deleteJobAttributeValueMaster(){
        return store.delete(this.JOB_ATTRIBUTE_VALUE_MASTER)
    }

    saveFieldAttributeMaster(fieldAttributeMaster) {
        return store.save(this.FIELD_ATTRIBUTE_MASTER, {
            fieldAttributeMaster
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getFieldAttributeMaster() {
        return store.get(this.FIELD_ATTRIBUTE_MASTER)
    }

    deleteFieldAttributeMaster(){
        return store.delete(this.FIELD_ATTRIBUTE_MASTER)
    }

    saveFieldAttributeValueMaster(fieldAttributeValueMaster) {
        return store.save(this.FIELD_ATTRIBUTE_VALUE_MASTER, {
            fieldAttributeValueMaster
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getFieldAttributeValueMaster() {
        return store.get(this.FIELD_ATTRIBUTE_VALUE_MASTER)
    }

    deleteFieldAttributeValueMaster(){
        return store.delete(this.FIELD_ATTRIBUTE_VALUE_MASTER)
    }

    saveJobStatus(jobStatus) {
        return store.save(this.JOB_STATUS, {
            jobStatus
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getJobStatus() {
        return store.get(this.JOB_STATUS)
    }

    deleteJobStatus(){
        return store.delete(this.JOB_STATUS)
    }

    saveCustomizationAppModules(customizationAppModules) {
        return store.save(this.CUSTOMIZATION_APP_MODULES, {
            customizationAppModules
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getCustomizationAppModules() {
        return store.get(this.CUSTOMIZATION_APP_MODULES)
    }

    deleteCustomizationAppModules(){
        return store.delete(this.CUSTOMIZATION_APP_MODULES)
    }

    saveCustomizationJobList(customizationJobList) {
        return store.save(this.CUSTOMIZATION_JOB_LIST, {
            customizationJobList
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getCustomizationJobList() {
        return store.get(this.CUSTOMIZATION_JOB_LIST)
    }

    deleteCustomizationJobList(){
        return store.delete(this.CUSTOMIZATION_JOB_LIST)
    }

    saveTabs(tabs) {
        return store.save(this.TABS, {
            tabs
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getTabs() {
        return store.get(this.TABS)
    }

    deleteTabs(){
        return store.delete(this.TABS)
    }

    storeSessionToken(sessionToken) {
        return store.save(this.SESSION_TOKEN_KEY, {
            sessionToken
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getSessionToken() {
        return store.get(this.SESSION_TOKEN_KEY)
    }

    /**
     * ### deleteSessionToken
     * Deleted during log out
     */
    deleteSessionToken() {
        return store.delete(this.SESSION_TOKEN_KEY)
    }

    storeDeviceIMEI(deviceIMEI) {
        return store.save(this.DEVICE_IMEI, {
            deviceIMEI
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getDeviceIMEI() {
        return store.get(this.DEVICE_IMEI)
    }

    deleteDeviceIMEI() {
        return store.delete(this.DEVICE_IMEI)
    }

    storeDeviceSIM(deviceSIM) {
        return store.save(this.DEVICE_SIM, {
            deviceSIM
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getDeviceSIM() {
        return store.get(this.DEVICE_SIM)
    }

    deleteDeviceSIM() {
        return store.delete(this.DEVICE_SIM)
    }

    saveJobMoneyTransactionMode(jobMoneyTransactionMode){
        return store.save(this.JOB_MONEY_TRANSACTION_MODE,{
            jobMoneyTransactionMode
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getJobMoneyTransactionMode(jobMoneyTransactionMode){
        return store.get(this.JOB_MONEY_TRANSACTION_MODE)
    }

    deleteJobMoneyTransactionMode(){
        return store.delete(this.JOB_MONEY_TRANSACTION_MODE)
    }

    saveCustomerCare(customerCare){
        return store.save(this.CUSTOMER_CARE,{
            customerCare
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getCustomerCare(){
        return store.get(this.CUSTOMER_CARE)
    }

    saveSmsTemplate(smsTemplate){
        return store.save(this.SMS_TEMPLATE,{
            smsTemplate
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getSmsTemplate(){
        return store.get(this.SMS_TEMPLATE)
    }

    deleteSmsTemplate(){
        return store.delete(this.SMS_TEMPLATE)
    }

    saveFieldAttributeStatus(fieldAttributeStatus){
        return store.save(this.FIELD_ATTRIBUTE_STATUS,{
            fieldAttributeStatus
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getFieldAttributeStatus(){
        return store.get(this.FIELD_ATTRIBUTE_STATUS)
    }

    deleteFieldAttributeStatus(){
        return store.delete(this.FIELD_ATTRIBUTE_STATUS)
    }

    saveFieldValidations(fieldValidations){
        return store.save(this.FIELD_VALIDATIONS,{
            fieldValidations
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getFieldValidations(){
        return store.get(this.FIELD_VALIDATIONS)
    }

    deleteFieldValidations(){
        return store.delete(this.FIELD_VALIDATIONS)
    }

    saveFieldValidationsConditions(fieldValidationsConditions){
        return store.save(this.FIELD_VALIDATION_CONDITIONS,{
            fieldValidationsConditions
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getFieldValidationsConditions(){
        return store.get(this.FIELD_VALIDATION_CONDITIONS)
    }

    deleteFieldValidationsConditions(){
        return store.delete(this.FIELD_VALIDATION_CONDITIONS)
    }

    saveSmsJobStatuses(smsJobStatuses){
        return store.save(this.SMS_JOB_STATUSES,{
            smsJobStatuses
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getSmsJobStatuses(){
        return store.get(this.SMS_JOB_STATUSES)
    }

    deleteSmsJobStatuses(){
        return store.delete(this.SMS_JOB_STATUSES)
    }

    saveUserSummary(userSummary){
        return store.save(this.USER_SUMMARY,{
            userSummary
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getUserSummary(){
        return store.get(this.USER_SUMMARY)
    }

    deleteUserSummary(){
        return store.get(this.USER_SUMMARY)
    }

    saveJobSummary(jobSummary){
        return store.save(this.JOB_SUMMARY,{
            jobSummary
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getJobSummary(){
        return store.get(this.JOB_SUMMARY)
    }

    deleteJobSummary(){
        return store.delete(this.JOB_SUMMARY)
    }

    saveMDMPolicies(mdmPolicies){
        return store.save(this.MDM_POLICIES,{
            mdmPolicies
        }).then(() => {
            return true;
        }).catch(error => {
            return error;
        })
    }

    getMDMPolicies(){
        return store.get(this.MDM_POLICIES)
    }

    deleteMDMPolicies(){
        return store.delete(this.MDM_POLICIES)
    }

}
// The singleton variable
export let storeConfig = new StoreConfig()
