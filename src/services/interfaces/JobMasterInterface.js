/**
 * Created by udbhav on 12/4/17.
 */

export default class JobMasterInterface{
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

    }

    /**This saves APK version in store
     *
     * @param serverAPKVerson
     *
     * @return
     * isSaveSuccess: true
     */
    saveServerApkVersion(serverAPKVersion){}

    /**This saves lastSeenTimeForMessageBox in store
     *
     * @param lastSeenTimeForMessageBox
     *
     * @return
     * isSaveSuccess: true
     */
    savelastSeenTimeForMessageBox(lastSeenTimeForMessageBox){}

    /**
     * @return
     * serverApkVersion
     */
    getServerApkversion(){}

    /**
     * @return
     * lastSeenTimeForMessageBox
     */
    getlastSeenTimeForMessageBox(){}

    /**This saves hubLatLng in store
     *
     * @param hubLatLng
     *
     * @return
     * isSaveSuccess: true
     */
    savehubLatLng(hubLatLng){}

    /**
     * @return
     * hubLatLng
     */

    gethubLatLng(){}

    /**This saves entire UserObject in store
     *
     * @param user
     *
     * @return
     * isSaveSuccess: true
     */
    saveUser(user){}

    /**
     * @return
     * userObject
     */

    getUser(){}

    /**This saves entire companyObject in store
     *
     * @param companyObject
     * @return
     * isSaveSuccess: true
     */
    saveCompanyObject(companyObject){}

    /**
     *
     * @return
     * companyObject
     */

    getCompanyObject(){}

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
    }

    /**
     * This saves entire jobMaster array in store and returns true if saving was successful
     * @param jobMaster
     *
     * @return
     * isSaveSuccess : false
     */
    saveJobMaster(jobMaster){

    }

    /**
     * @return
     * jobMaster
     */
    getJobMaster(){}

    /**
     *This saves entire fieldAttributeMaster array in store
     * @param fieldAttributeMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveFieldAttributeMaster(fieldAttributeMaster){

    }

    /**
     *
     * @return
     * fieldAttributeMaster
     */
    getFieldAttributeMaster(){}
    /**
     *This saves entire jobAttributesMaster array in store
     * @param jobAttributesMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveJobAttributesMaster(jobAttributesMaster){}

    getJobAttributesMaster(){}

    /**
     *This saves entire jobAttributesValueMaster array in store
     * @param jobAttributesValueMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveJobAttributesValueMaster(jobAttributesValueMaster){}

    /**
     *
     * @return
     * jobAttributeValueMaster
     */

    getJobAttributesValueMaster(){}

    /**
     *This saves entire fieldAttributesValueMaster array in store
     * @param fieldAttributesValueMaster
     *
     * @return
     * isSaveSuccess: true
     */
    saveFieldAttributesValueMaster(fieldAttributesValueMaster){}

    getFieldAttributesValueMaster(){}

    /**
     *This saves entire jobStatus array in store
     * @param jobStatus
     *
     * @return
     * isSaveSuccess: true
     */
    saveJobStatus(jobStatus){}

    getJobStatus(){}

    /**This saves entire customizationAppModules array in store
     *
     * @param customizationAppModules
     *
     * @return
     * isSaveSuccess: true
     */
    saveCustomizationAppModules(customizationAppModules){

    }

    getCustomizationAppModules(){}

    /**This saves entire saveCustomizationJobList array in store
     *
     * @param customizationJobList
     *
     * @return
     * isSaveSuccess: true
     */
    saveCustomizationJobList(customizationJobList){

    }

    getCustomizationJobList(){}

    /**This saves entire tabs array in store
     *
     * @param tabs
     *
     * @return
     * isSaveSuccess: true
     */
    saveTabs(tabs){}

    getTabs(){}

    /**
     *This saves entire jobMoneyTransactionMode array in store
     * @param jobMoneyTransactionMode
     *
     * @return
     * isSaveSuccess: true
     */
    saveJobMoneyTransactionMode(jobMoneyTransactionMode){}

    getJobMoneyTransactionMode(){}

    /**
     *This saves entire cutomerCare array in store
     * @param cutomerCare
     *
     * @return
     * isSaveSuccess: true
     */
    saveCutomerCare(cutomerCare){}

    /**
     *
     * @return
     * customerCare
     */
    getCutomerCare(){}

    /**
     *This saves entire smsTemplate array in store
     * @param smsTemplate
     *
     * @return
     * isSaveSuccess: true
     */
    saveSmsTemplate(smsTemplate){}

    getSmsTemplate(){}

    /**This saves entire fieldAttributeStatus array in store
     *
     * @param fieldAttributeStatus
     *
     * @return
     * isSaveSuccess: true
     */
    saveFieldAttributeStatus(fieldAttributeStatus){}

    getFieldAttributeStatus(){}

    /**This saves entire fieldValidations array in store
     *
     * @param fieldValidations
     *
     * @return
     * isSaveSuccess: true
     */
    saveFieldValidations(fieldValidations){}

    getFieldValidations(){}

    /**This saves entire fieldValidationsConditions array in store
     *
     * @param fieldValidationsConditions
     *
     * @return
     *  isSaveSuccess: true
     */
    saveFieldValidationsConditions(fieldValidationsConditions){}

    getFieldValidationsConditions(){}

    /**
     *This saves entire smsJobStatuses array in store
     * @param smsJobStatuses
     *
     * @return
     *isSaveSuccess: true
     */
    saveSmsJobStatuses(smsJobStatuses){}

    getSmsJobStatuses(){}

    /**
     *This saves entire mdmPolicies array in store
     * @param mdmPolicies
     *
     * @return
     * isSaveSuccess: true
     */
    saveMDMPolicies(mdmPolicies){}

    getMDMPolicies(){}

    /**This saves entire UserSummary object in store
     *
     * @param userSummary
     *
     * @return
     * isSaveSuccess: true
     */
    saveUserSummary(userSummary){}

    getUserSummary(){}

    /**This saves entire jobSummary array in store
     *
     * @param jobSummary
     *
     * @return
     *  isSaveSuccess: true
     */
    saveJobSummary(jobSummary){}

    getJobSummary(){}

    /**
     *
     * @param jobMaster
     *
     * @return
     * saveJobMasterResponse : false
     */
    checkIfJobMasterIsNull(jobMaster){

    }


}

