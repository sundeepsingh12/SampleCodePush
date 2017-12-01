import keyMirror from 'keymirror'

//keyMirror is a simple utility for creating an object with values equal to its keys.

module.exports = keyMirror({
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
    HOME_LOADING: null,
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
    IS_MISMATCHING_LOCATION: null,
    //Payment Actions
    CLEAR_PAYMENT_STATE: null,
    SET_PAYMENT_CHANGED_PARAMETERS: null,
    SET_PAYMENT_INITIAL_PARAMETERS: null,

    //UPI PaymentActions
    SET_UPI_APPROVAL: null,
    SET_UPI_PAYMENT_CUSTOMER_CONTACT: null,
    SET_UPI_PAYMENT_CUSTOMER_NAME: null,
    SET_UPI_PAYMENT_PARAMETERS: null,
    SET_UPI_PAYMENT_PAYER_VPA: null,

    //Pay By Link Payment Actions
    SET_PAY_BY_LINK_PARAMETERS: null,

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
    HUB: null,

    //Realm Tables
    TABLE_JOB_TRANSACTION: null,
    TABLE_JOB: null,
    TABLE_JOB_DATA: null,
    TABLE_RUNSHEET: null,
    TABLE_FIELD_DATA: null,
    TABLE_JOB_TRANSACTION_CUSTOMIZATION: null,
    TABLE_TRACK_LOGS: null,
    TABLE_SERVER_SMS_LOG: null,

    //Home Actions
    IS_LAST_PAGE: null,


    //Status Codes
    UNSEEN: null,
    PENDING: null,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA: null,

    //Form Layout
    GET_SORTED_ROOT_FIELD_ATTRIBUTES: null,
    DISABLE_SAVE: null,
    UPDATE_FIELD_DATA: null,
    STATUS_NAME: null,
    BASIC_INFO: null,
    ON_BLUR: null,
    TOOGLE_HELP_TEXT: null,
    IS_LOADING: null,
    PENDING_SYNC_TRANSACTION_IDS: null,
    RESET_STATE: null,
    ERROR_MESSAGE: null,
    UPDATE_FIELD_DATA_WITH_CHILD_DATA: null,
    UPDATE_PAYMENT_AT_END: null,
    UPDATE_FIELD_DATA_VALIDATION: null,
    UPDATE_NEXT_EDITABLE: null,
    //Route names (Used in React Navigation)
    ApplicationScreen: null,
    FormLayout: null,
    HardwareBackPress: null,
    HomeScreen: null,
    HomeTabNavigatorScreen: null,
    JobDetails: null,
    LoginScreen: null,
    MenuScreen: null,
    PreloaderScreen: null,
    Sequence: null,
    TabScreen: null,
    TimePicker: null,
    SkuListing: null,
    BulkConfiguration: null,
    BulkListing: null,
    Sorting: null,
    ProfileView: null,
    Statistics: null,
    LiveJobs: null,


    //Skulisting Actions
    SKU_LIST_FETCHING_STOP: null,
    SKU_LIST_FETCHING_START: null,
    SHOW_SEARCH_BAR: null,
    SKU_CODE_CHANGE: null,
    UPDATE_SKU_ACTUAL_QUANTITY: null,

    //CheckBox 
    SET_VALUE_IN_SELECT_FROM_LIST_ATTRIBUTE: null,
    SET_FILTERED_DATA_SELECTFROMLIST: null,
    INPUT_TEXT_VALUE: null,
    SELECTFROMLIST_ITEMS_LENGTH: null,

    //FixedSKU Actions
    IS_LOADER_RUNNING: null,
    CHANGE_QUANTITY: null,
    SET_FIXED_SKU: null,

    //Signature Actions
    SET_FIELD_DATA_LIST: null,
    SET_REMARKS_VALIDATION: null,
    SAVE_SIGNATURE: null,

    //array actions
    SET_ARRAY_CHILD_LIST: null,
    SET_NEW_ARRAY_ROW: null,
    SET_ARRAY_ELEMENTS: null,
    SET_ERROR_MSG: null,
    CLEAR_ARRAY_STATE: null,
    //CashTendering
    CHANGE_AMOUNT: null,
    IS_CASH_TENDERING_LOADER_RUNNING: null,
    SET_CASH_TENDERING: null,
    IS_RECEIVE_TOGGLE: null,
    FETCH_CASH_TENDERING_LIST_RETURN: null,
    CHANGE_AMOUNT_RETURN: null,
    //Data Store
    SET_VALIDATIONS: null,
    SET_DATA_STORE_ATTR_MAP: null,
    SHOW_LOADER: null,
    SHOW_ERROR_MESSAGE: null,
    SET_SEARCH_TEXT: null,
    SHOW_DETAILS: null,
    REMARKS: null,
    SPECIAL: null,
    MINMAX: null,
    _id: null,
    SET_INITIAL_STATE: null,
    SAVE_SUCCESSFUL: null,

    //Sequence Module Actions
    SEQUENCE_LIST_FETCHING_START: null,
    SEQUENCE_LIST_FETCHING_STOP: null,
    TOGGLE_RESEQUENCE_BUTTON: null,
    PREPARE_UPDATE_LIST: null,

    //New Job
    NEW_JOB_MASTER: null,
    NEW_JOB_STATUS: null,

    //Bulk Module
    START_FETCHING_BULK_CONFIG: null,
    STOP_FETCHING_BULK_CONFIG: null,
    START_FETCHING_BULK_TRANSACTIONS: null,
    STOP_FETCHING_BULK_TRANSACTIONS: null,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM: null,
    TOGGLE_ALL_JOB_TRANSACTIONS: null,

    //statisticsModule
    SET_DATA_IN_STATISTICS_LIST: null,

    //profileModule
    FETCH_USER_DETAILS: null,
    CHECK_CURRENT_PASSWORD: null,
    SET_NEW_PASSWORD: null,
    SET_CONFIRM_NEW_PASSWORD: null,
    CLEAR_PASSWORD_TEXTINPUT: null,
    TOGGLE_SAVE_RESET_BUTTON: null,

    //Sorting And Printing
    SORTING_SEARCH_VALUE: null,
    SORTING_ITEM_DETAILS: null,

    //Live Job actions
    SET_LIVE_JOB_LIST: null,
    END_LIVEJOB_DETAILD_FETCHING: null,
    TOGGLE_LIVE_JOB_LIST_ITEM: null,
    START_FETCHING_LIVE_JOB: null,
})


