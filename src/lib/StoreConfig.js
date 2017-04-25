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
import CONFIG from './config'
import CONSTANT from './constants'

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

    saveServerApkVersion(serverAPKVersion) {
        return store.save(this.SERVER_APK_VERSION, {
            serverAPKVersion: serverAPKVersion
        })
    }

    getServerApkVersion() {
        return store.get(this.SERVER_APK_VERSION)
    }

    saveServerTime(serverTime) {
        return store.save(this.SERVER_APK_VERSION, {
            serverTime: serverTime
        })
    }

    getServerTime() {
        return store.get(this.SERVER_TIME)
    }

    saveHub(hub) {
        return store.save(this.HUB, {
            hub: hub
        })
    }

    getHub() {
        return store.get(this.HUB)
    }

    saveLastSeenTimeForMessageBox(lastSeenTimeForMessageBox) {
        return store.save(this.LAST_SEEN_TIME_FOR_MESSAGE_BOX, {
            lastSeenTimeForMessageBox: lastSeenTimeForMessageBox
        })
    }

    getLastSeenTimeForMessageBox() {
        return store.get(this.LAST_SEEN_TIME_FOR_MESSAGE_BOX)
    }

    saveHubLatLong(hubLatLong) {
        return store.save(this.HUB_LAT_LONG, {
            hubLatLong: hubLatLong
        })
    }

    getHubLatLong() {
        return store.get(this.HUB_LAT_LONG)
    }

    saveUser(user) {
        return store.save(this.USER, {
            user: user
        })

    }

    getUser() {
        return store.get(this.USER)
    }

    saveJobMaster(jobMaster) {
        return store.save(this.JOB_MASTER, {
            jobMaster: jobMaster
        })
    }

    getJobMaster() {
        return store.get(this.JOB_MASTER)
    }

    saveJobAttributeMaster(jobAttributeMaster) {
        return store.save(this.JOB_ATTRIBUTE_MASTER, {
            jobAttributeMaster: jobAttributeMaster
        })
    }

    getJobAttributeMaster() {
        return store.get(this.JOB_ATTRIBUTE_MASTER)
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster) {
        return store.save(this.JOB_ATTRIBUTE_VALUE_MASTER, {
            jobAttributeValueMaster: jobAttributeValueMaster
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
            fieldAttributeMaster: fieldAttributeMaster
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
            fieldAttributeValueMaster: fieldAttributeValueMaster
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
            jobStatus: jobStatus
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
            customizationAppModules: customizationAppModules
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
            customizationJobList: customizationJobList
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
            tabs: tabs
        })
    }

    getTabs() {
        return store.get(this.TABS)
    }

    deleteTabs(){
        return store.delete(this.TABS)
    }

    /**
     * ### storeSessionToken
     * Store the session key
     */
    storeSessionToken(sessionToken) {
        return store.save(this.SESSION_TOKEN_KEY, {
            sessionToken: sessionToken
        })
    }

    /**
     * ### getSessionToken
     * @param {Object} sessionToken the currentUser object
     * Remember, the store is a promise so, have to be careful.
     */
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
            deviceIMEI: deviceIMEI
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
            deviceSIM: deviceSIM
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
            jobMoneyTransactionMode: jobMoneyTransactionMode
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
            customerCare: customerCare
        })
    }

    getCustomerCare(){
        return store.get(this.CUSTOMER_CARE)
    }

    saveSmsTemplate(smsTemplate){
        return store.save(this.SMS_TEMPLATE,{
            smsTemplate: smsTemplate
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
            fieldAttributeStatus: fieldAttributeStatus
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
            fieldValidations: fieldValidations
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
            fieldValidationsConditions: fieldValidationsConditions
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
            smsJobStatuses: smsJobStatuses
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
            userSummary: userSummary
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
            jobSummary: jobSummary
        })
    }

    getJobSummary(){
        return store.get(this.JOB_SUMMARY)
    }

    deleteJobSummary(){
        return store.delete(this.JOB_SUMMARY)
    }

}
// The singleton variable
export let storeConfig = new StoreConfig()
