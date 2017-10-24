import keyMirror from 'keymirror'

//keyMirror is a simple utility for creating an object with values equal to its keys.

export default keyMirror({
    //Global Actions
    SET_STORE: null,
    SET_SESSION_TOKEN: null,
    SET_CREDENTIALS: null,

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

    //Preloader Actions
    MASTER_DOWNLOAD_START: null,
    MASTER_DOWNLOAD_SUCCESS: null,
    MASTER_DOWNLOAD_FAILURE: null,

    MASTER_SAVING_START: null,
    MASTER_SAVING_SUCCESS: null,
    MASTER_SAVING_FAILURE: null,

    CHECK_ASSET_START: null,
    CHECK_ASSET_FAILURE: null,

    OTP_GENERATION_START: null,
    OTP_GENERATION_SUCCESS: null,
    OTP_GENERATION_FAILURE: null,

    OTP_VALIDATION_START: null,
    OTP_VALIDATION_SUCCESS: null,
    OTP_VALIDATION_FAILURE: null,

    SESSION_TOKEN_REQUEST: null,
    SESSION_TOKEN_SUCCESS: null,
    SESSION_TOKEN_FAILURE: null,

    DELETE_TOKEN_REQUEST: null,
    DELETE_TOKEN_SUCCESS: null,

    ON_AUTH_FORM_FIELD_CHANGE: null,
    ON_LOGIN_USERNAME_CHANGE: null,
    ON_LOGIN_PASSWORD_CHANGE: null,

    PRELOADER_SUCCESS: null,
    SHOW_MOBILE_NUMBER: null,
    SHOW_OTP_SCREEN: null,
    SHOW_MOBILE_NUMBER_SCREEN: null,
    ON_MOBILE_NO_CHANGE: null,
    ON_OTP_CHANGE: null,
    ERROR_400_403_LOGOUT: null,

    PRE_LOGOUT_START: null,
    PRE_LOGOUT_SUCCESS: null,
    PRE_LOGOUT_FAILURE: null,
    TOGGLE_CHECKBOX: null,
    REMEMBER_ME_SET_TRUE: null,

    //Home Actions
    JOB_FETCHING_START: null,
    JOB_FETCHING_END: null,
    SET_TABS_LIST: null,
    SET_FETCHING_FALSE: null,
    CLEAR_HOME_STATE: null,
    SET_REFRESHING_TRUE: null,
    JOB_DOWNLOADING_STATUS: null,

    //Listing Actions
    JOB_LISTING_START: null,
    JOB_LISTING_END: null,

    //Job Details Actions
    JOB_DETAILS_FETCHING_START: null,
    JOB_DETAILS_FETCHING_END: null,

    //Long running service's possible status
    SERVICE_PENDING: null,
    SERVICE_RUNNING: null,
    SERVICE_SUCCESS: null,
    SERVICE_FAILED: null,

    //Login Credentials

    USERNAME: null,
    PASSWORD: null,
    REMEMBER_ME: null,

    //Preloader Credentials
    IS_SHOW_OTP_SCREEN: null,
    IS_SHOW_MOBILE_NUMBER_SCREEN: null,

    //Schema (Store keys)

    JOB_MASTER: null,
    JOB_ATTRIBUTE: null,
    JOB_ATTRIBUTE_VALUE: null,
    FIELD_ATTRIBUTE: null,
    FIELD_ATTRIBUTE_VALUE: null,
    JOB_STATUS: null,
    TAB: null,
    CUSTOMER_CARE: null,
    SMS_TEMPLATE: null,
    USER_SUMMARY: null,
    JOB_SUMMARY: null,
    SMS_JOB_STATUS: null,
    JOB_MASTER_MONEY_TRANSACTION_MODE: null,
    FIELD_ATTRIBUTE_STATUS: null,
    FIELD_ATTRIBUTE_VALIDATION: null,
    FIELD_ATTRIBUTE_VALIDATION_CONDITION: null,
    JOB_LIST_CUSTOMIZATION: null,
    CUSTOMIZATION_APP_MODULE: null,
    DEVICE_IMEI: null,
    DEVICE_SIM: null,
    USER: null,
    IS_PRELOADER_COMPLETE: null,
    CUSTOMIZATION_LIST_MAP: null,
    TABIDMAP: null,
    SET_TABS_TRANSACTIONS: null,
    JOB_ATTRIBUTE_STATUS: null,

    //Realm Tables
    TABLE_JOB_TRANSACTION: null,
    TABLE_JOB: null,
    TABLE_JOB_DATA: null,
    TABLE_RUNSHEET: null,
    TABLE_FIELD_DATA: null,
    TABLE_JOB_TRANSACTION_CUSTOMIZATION: null,
    TABLE_TRACK_LOGS: null,

    //Home Actions
    IS_LAST_PAGE: null,


    //Status Codes
    UNSEEN: null,
    PENDING: null,

    //Route names (Used in React Navigation)
    Application: null,
    Login: null,
    Preloader: null,
    Home: null,
    JobDetails: null,
    SkuListing:null,

    //Skulisting Actions
    SKU_LIST_FETCHING_STOP:null,
    SKU_LIST_FETCHING_START:null,
    SHOW_SEARCH_BAR:null,
    SKU_CODE_CHANGE:null,
    UPDATE_SKU_ACTUAL_QUANTITY:null

})


