import keyMirror from 'keymirror'

//keyMirror is a simple utility for creating an object with values equal to its keys.

export default keyMirror({
    //Global Actions
    SET_STORE: null,
    SET_SESSION_TOKEN: null,
    SET_CREDENTIALS: null,
    INTERNET_CONNECTION_STATUS: null,

    //Device Actions
    SET_PLATFORM: null,
    SET_VERSION: null,

    //Auth Actions
    LOGIN: null,
    LOGOUT: null,
    LOGIN_START: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,
    LOGOUT_START: null,
    LOGOUT_SUCCESS: null,
    LOGOUT_FAILURE: null,

    MASTER_DOWNLOAD_START: null,
    MASTER_DOWNLOAD_SUCCESS: null,
    MASTER_DOWNLOAD_FAILURE: null,

    MASTER_SAVING_START: null,
    MASTER_SAVING_SUCCESS: null,
    MASTER_SAVING_FAILURE: null,
    MASTER_TIME_FAILURE: null,

    CHECK_ASSET_START: null,
    CHECK_ASSET_SUCCESS: null,
    CHECK_ASSET_FAILURE: null,

    SESSION_TOKEN_REQUEST: null,
    SESSION_TOKEN_SUCCESS: null,
    SESSION_TOKEN_FAILURE: null,

    DELETE_TOKEN_REQUEST: null,
    DELETE_TOKEN_SUCCESS: null,

    ON_AUTH_FORM_FIELD_CHANGE: null,
    ON_LOGIN_USERNAME_CHANGE: null,
    ON_LOGIN_PASSWORD_CHANGE: null,

    //Long running service's possible status
    SERVICE_PENDING: null,
    SERVICE_RUNNING: null,
    SERVICE_SUCCESS: null,
    SERVICE_FAILED: null,


    //Schema (Store keys)
    jobMaster:null,
    jobAttribute:null,
    jobAttributeValue:null,
    fieldAttribute:null,
    fieldAttributeValue:null,
    jobStatus:null,
    tab:null,
    customercare:null,
    smsTemplate:null,
    userSummary:null,
    jobSummary:null,
    smsJobStatus:null,
    jobMasterMoneyTransactionMode:null,
    fieldAttributeStatus:null,
    fieldAttributeValidation:null,
    fieldAttributeValidationCondition:null,
    jobListCustomization:null,
    customizationAppModule:null,
    deviceImei:null,
    deviceSim:null,
    user:null
})


