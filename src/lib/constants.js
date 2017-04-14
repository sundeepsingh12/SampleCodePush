import keyMirror from 'keymirror'

//keyMirror is a simple utility for creating an object with values equal to its keys.

export default keyMirror({
    //Global Actions
    SET_STORE: null,
    SET_SESSION_TOKEN: null,

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

    SESSION_TOKEN_REQUEST: null,
    SESSION_TOKEN_SUCCESS: null,
    SESSION_TOKEN_FAILURE: null,

    DELETE_TOKEN_REQUEST: null,
    DELETE_TOKEN_SUCCESS: null,

    ON_AUTH_FORM_FIELD_CHANGE: null,


    //Database tables
    TABLE_USER_SUMMARY: null,
    TABLE_JOB_MASTER: null,


    //Store
    SERVER_TIME: null,
    HUB: null,
    SERVER_APK_VERSION: null,
    LAST_SEEN_TIME_FOR_MESSAGE_BOX: null,
    HUB_LAT_LONG: null,
    USER: null,
    COMPANY: null,
    JOB_MASTER: null,
    JOB_ATTRIBUTE_MASTER: null,
    JOB_ATTRIBUTE_VALUE_MASTER: null,
    FIELD_ATTRIBUTE_MASTER: null,
    FIELD_ATTRIBUTE_VALUE_MASTER: null,
    JOB_STATUS: null,
    CUSTOMIZATION_APP_MODULES: null,
    CUSTOMIZATION_JOB_LIST: null,
    TABS: null,
    JOB_MONEY_TRANSACTION_MODE: null,
    CUSTOMER_CARE: null,
    SMS_TEMPLATE: null,
    FIELD_ATTRIBUTE_STATUS: null,
    FIELD_VALIDATIONS: null,
    FIELD_VALIDATION_CONDITIONS: null,
    SMS_JOB_STATUSES: null,
    MDM_POLICIES: null,
    USER_SUMMARY: null,
    JOB_SUMMARY: null,
    DEVICE_IMEI: null,
    DEVICE_SIM: null,
})
