/**
 * # AppAuthToken.js
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

export class AppAuthToken {
    /**
     * ## AppAuthToken
     *
     * set the key from the config
     */
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

    saveHub(hub){
        return store.save(this.HUB, {
            hub: hub
        })
    }

    getHub() {
        return store.get(this.HUB)
    }

    saveLastSeenTimeForMessageBox(lastSeenTimeForMessageBox){
        return store.save(this.LAST_SEEN_TIME_FOR_MESSAGE_BOX, {
            lastSeenTimeForMessageBox: lastSeenTimeForMessageBox
        })
    }

    getLastSeenTimeForMessageBox(){
        return store.get(this.LAST_SEEN_TIME_FOR_MESSAGE_BOX)
    }

    saveHubLatLong(hubLatLong){
        return store.save(this.HUB_LAT_LONG, {
            hubLatLong: hubLatLong
        })
    }

    getHubLatLong(){
        return store.get(this.HUB_LAT_LONG)
    }

    saveUser(user){
        return store.save(this.USER, {
            user: user
        })
    }

    getUser(){
        return store.get(this.LAST_SEEN_TIME_FOR_MESSAGE_BOX)
    }

    saveJobMaster(jobMaster){
        return store.save(this.JOB_MASTER, {
            jobMaster: jobMaster
        })
    }

    getJobMaster(){
        return store.get(this.JOB_MASTER)
    }

    saveJobAttributeMaster(jobAttributeMaster){
        return store.save(this.JOB_ATTRIBUTE_MASTER, {
            jobAttributeMaster: jobAttributeMaster
        })
    }

    getJobAttributeMaster(){
        return store.get(this.JOB_ATTRIBUTE_MASTER)
    }

    saveJobAttributeValueMaster(jobAttributeValueMaster){
        return store.save(this.JOB_ATTRIBUTE_VALUE_MASTER, {
            jobAttributeValueMaster: jobAttributeValueMaster
        })
    }

    getJobAttributeValueMaster(){
        return store.get(this.JOB_ATTRIBUTE_VALUE_MASTER)
    }

    saveFieldAttributeMaster(fieldAttributeMaster){
        return store.save(this.FIELD_ATTRIBUTE_MASTER, {
            fieldAttributeMaster: fieldAttributeMaster
        })
    }

    getFieldAttributeMaster(){
        return store.get(this.FIELD_ATTRIBUTE_MASTER)
    }

    saveFieldAttributeValueMaster(fieldAttributeValueMaster){
        return store.save(this.FIELD_ATTRIBUTE_VALUE_MASTER, {
            fieldAttributeValueMaster: fieldAttributeValueMaster
        })
    }

    getFieldAttributeValueMaster(){
        return store.get(this.FIELD_ATTRIBUTE_VALUE_MASTER)
    }

    saveJobStatus(jobStatus){
        return store.save(this.JOB_STATUS, {
            jobStatus: jobStatus
        })
    }

    getJobStatus(){
        return store.get(this.JOB_STATUS)
    }

    saveCustomizationAppModules(customizationAppModules){
        return store.save(this.CUSTOMIZATION_APP_MODULES, {
            customizationAppModules: customizationAppModules
        })
    }

    getCustomizationAppModules(){
        return store.get(this.CUSTOMIZATION_APP_MODULES)
    }

    saveCustomizationJobList(customizationJobList){
        return store.save(this.CUSTOMIZATION_JOB_LIST, {
            customizationJobList: customizationJobList
        })
    }

    getCustomizationJobList(){
        return store.get(this.CUSTOMIZATION_JOB_LIST)
    }

    saveTabs(tabs){
        return store.save(this.TABS, {
            tabs: tabs
        })
    }

    getTabs(){
        return store.get(this.TABS)
    }


}
// The singleton variable
export let appAuthToken = new AppAuthToken()
