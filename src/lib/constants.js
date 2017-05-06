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
    LOGIN_CAMERA_SCANNER: null,
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

    PRELOADER_SUCCESS:null,
    PRELOADER_RETRY:null,
    INVALID_IMEI_HUB:null,
    SHOW_MOBILE_NUMBER:null,
    SHOW_OTP_SCREEN:null,
    SHOW_MOBILE_NUMBER_SCREEN:null,

    //Long running service's possible status
    SERVICE_PENDING: null,
    SERVICE_RUNNING: null,
    SERVICE_SUCCESS: null,
    SERVICE_FAILED: null,


    //Schema (Store keys)

    JOB_MASTER:null,
    JOB_ATTRIBUTE:null,
    JOB_ATTRIBUTE_VALUE:null,
    FIELD_ATTRIBUTE:null,
    FIELD_ATTRIBUTE_VALUE:null,
    JOB_STATUS:null,
    TAB:null,
    CUSTOMER_CARE:null,
    SMS_TEMPLATE:null,
    USER_SUMMARY:null,
    JOB_SUMMARY:null,
    SMS_JOB_STATUS:null,
    JOB_MASTER_MONEY_TRANSACTION_MODE:null,
    FIELD_ATTRIBUTE_STATUS:null,
    FIELD_ATTRIBUTE_VALIDATION:null,
    FIELD_ATTRIBUTE_VALIDATION_CONDITION:null,
    JOB_LIST_CUSTOMIZATION:null,
    CUSTOMIZATION_APP_MODULE:null,
    DEVICE_IMEI:null,
    DEVICE_SIM:null,
    USER:null,
IS_PRELOADER_COMPLETE:null
})


