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

    //autoLogout Actions
    SET_LOADER_IN_AUTOLOGOUT: null,

    //Auth Actions
    LOGIN: null,
    LOGOUT: null,
    LOGIN_START: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,
    LOGIN_CAMERA_SCANNER: null,
    FORGET_PASSWORD: null,
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
    OTP_SUCCESS: null,

    //Home Actions
    HOME_LOADING: null,
    CHART_LOADING: null,
    JOB_FETCHING_START: null,
    JOB_FETCHING_END: null,
    SET_TABS_LIST: null,
    SET_FETCHING_FALSE: null,
    CLEAR_HOME_STATE: null,
    SET_REFRESHING_TRUE: null,
    JOB_DOWNLOADING_STATUS: null,
    SET_MODULES: null,
    TOGGLE_LOGOUT: null,
    SEARCH_TAP: null,

    //Home Container
    PIECHART: null,
    FUTURE_RUNSHEET_ENABLED: null,
    SET_SELECTED_DATE: null,
    IS_CALENDAR_VISIBLE: null,
    SYNC_ERROR: null,
    SYNC_STATUS: null,
    LISTING_SEARCH_VALUE: null,
    LAST_SYNC_TIME: null,

    //Listing Actions
    JOB_LISTING_START: null,
    JOB_LISTING_END: null,

    //Job Details Actions
    JOB_DETAILS_FETCHING_START: null,
    JOB_DETAILS_FETCHING_END: null,
    IS_MISMATCHING_LOCATION: null,
    RESET_STATE_FOR_JOBDETAIL: null,

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
    SAVE_ACTIVATED: null,
    LAST_SYNC_WITH_SERVER: null,
    CUSTOM_NAMING: null,
    LAST_DATASTORE_SYNC_TIME: null,
    POST_ASSIGNMENT_FORCE_ASSIGN_ORDERS: null,
    LIVE_JOB: null,
    USER_EVENT_LOG: null,
    LAST_JOB_COMPLETED_TIME: null,
    SHOULD_RELOAD_START: null,

    //Realm Tables
    TABLE_JOB_TRANSACTION: null,
    TABLE_JOB: null,
    TABLE_JOB_DATA: null,
    TABLE_RUNSHEET: null,
    TABLE_FIELD_DATA: null,
    TABLE_JOB_TRANSACTION_CUSTOMIZATION: null,
    TABLE_TRACK_LOGS: null,
    TABLE_SERVER_SMS_LOG: null,
    Datastore_Master_DB: null,
    DataStore_DB: null,
    TABLE_TRANSACTION_LOGS: null,
    TABLE_DRAFT: null,

    //Home Actions
    IS_LAST_PAGE: null,


    //Status Codes
    UNSEEN: null,
    PENDING: null,

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
    SET_FORM_LAYOUT_STATE: null,
    CLEAR_FORM_LAYOUT: null,
    SET_DRAFT: null,
    SET_UPDATE_DRAFT: null,

    UPDATE_FIELD_DATA_VALIDATION: null,
    UPDATE_NEXT_EDITABLE: null,
    NEXT_FOCUS: null,
    SET_FORM_TO_INVALID: null,

    //Route names (Used in React Navigation)
    ApplicationScreen: null,
    FormLayout: null,
    HardwareBackPress: null,
    HomeScreen: null,
    HomeTabNavigatorScreen: null,
    JobDetails: null,
    LoginScreen: null,
    AutoLogoutScreen: null,
    MenuScreen: null,
    PreloaderScreen: null,
    Sequence: null,
    TabScreen: null,
    TimePicker: null,
    SkuListing: null,
    SaveActivated: null,
    Transient: null,
    CheckoutDetails: null,
    NewJob: null,
    NewJobStatus: null,
    BulkConfiguration: null,
    BulkListing: null,
    Sorting: null,
    ProfileView: null,
    Statistics: null,
    Summary: null,
    CustomApp: null,
    PostAssignmentScanner: null,
    JobMasterListScreen: null,
    DataStoreDetails: null,
    LiveJobs: null,
    QrCodeScanner: null,
    OfflineDS: null,
    CameraAttribute: null,
    ImageDetailsView: null,
    JobDetailsV2: null,
    SequenceRunsheetList: null,

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
    SHOW_LOADER_DS: null,
    SHOW_ERROR_MESSAGE: null,
    SET_SEARCH_TEXT: null,
    SHOW_DETAILS: null,
    REMARKS: null,
    SPECIAL: null,
    MINMAX: null,
    _id: null,
    SET_INITIAL_STATE: null,
    SAVE_SUCCESSFUL: null,
    CLEAR_ATTR_MAP_AND_SET_LOADER: null,
    DISABLE_AUTO_START_SCANNER: null,

    //Sequence Module Actions
    SEQUENCE_LIST_FETCHING_START: null,
    SEQUENCE_LIST_FETCHING_STOP: null,
    PREPARE_UPDATE_LIST: null,
    CLEAR_SEQUENCE_STATE: null,
    SET_RUNSHEET_NUMBER_LIST: null,
    SET_RESPONSE_MESSAGE: null,
    CLEAR_TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP: null,
    SEQUENCE_LIST_ITEM_DRAGGED: null,
    SET_REFERENCE_NO: null,
    SET_SEQUENCE_LIST_ITEM: null,

    //New Job
    NEW_JOB_MASTER: null,
    NEW_JOB_STATUS: null,
    SET_ERROR_MSG_FOR_NEW_JOB: null,

    //Transient
    ADD_FORM_LAYOUT_STATE: null,
    SET_SHOW_JOB_DETAILS: null,
    LOADER_IS_RUNNING: null,
    SHOW_CHECKOUT_DETAILS: null,
    SET_INITIAL_STATE_TRANSIENT_STATUS: null,

    //Save Activated
    POPULATE_DATA: null,
    SAVE_ACTIVATED_INITIAL_STATE: null,
    LOADER_ACTIVE: null,
    DELETE_ITEM_SAVE_ACTIVATED: null,
    Edit: null,
    Receipt: null,
    Print: null,
    SMS: null,
    TotalAmount: null,
    Discard: null,
    Keep: null,
    Cancel: null,
    Checkout: null,

    //Bulk Module
    START_FETCHING_BULK_CONFIG: null,
    STOP_FETCHING_BULK_CONFIG: null,
    START_FETCHING_BULK_TRANSACTIONS: null,
    STOP_FETCHING_BULK_TRANSACTIONS: null,
    TOGGLE_JOB_TRANSACTION_LIST_ITEM: null,
    TOGGLE_ALL_JOB_TRANSACTIONS: null,
    CLEAR_BULK_STATE: null,
    SET_BULK_SEARCH_TEXT: null,
    SET_BULK_ERROR_MESSAGE: null,

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
    SORTING_LOADER: null,

    //Live Job actions
    SET_LIVE_JOB_LIST: null,
    END_LIVEJOB_DETAILD_FETCHING: null,
    TOGGLE_LIVE_JOB_LIST_ITEM: null,
    START_FETCHING_LIVE_JOB: null,
    SET_SEARCH: null,
    SET_MESSAGE: null,
    SET_LIVE_JOB_TOAST: null,

    //Summary
    SET_SUMMARY_FOR_JOBMASTER: null,
    SET_SUMMARY_FOR_RUNSHEET: null,
    RESET_SUMMARY_STATE: null,

    //Custom App
    START_FETCHING_URL: null,
    END_FETCHING_URL: null,
    ON_CHANGE_STATE: null,
    SCANNER_TEXT: null,

    //Job Master
    SET_JOB_MASTER_LIST: null,

    //Post Assignment
    SET_POST_ASSIGNMENT_TRANSACTION_LIST: null,
    SET_POST_ASSIGNMENT_ERROR: null,
    SET_POST_SCAN_SUCCESS: null,
    SET_POST_ASSIGNMENT_PARAMETERS: null,
    //QrCodeGenerator
    SCANNING: null,

    //Menu Container
    PROFILE: null,
    STATISTIC: null,
    EZETAP: null,
    MSWIPE: null,
    BACKUP: null,
    OFFLINEDATASTORE: null,
    BLUETOOTH: null,
    BULK: null,
    LIVE: null,
    OFFLINEDATASTORE: null,
    START: null,
    SEQUENCEMODULE: null,
    SUMMARY: null,
    SORTING: null,
    CUSTOMAPP: null,
    JOB_ASSIGNMENT: null,

    //Camera Actions
    SET_SHOW_IMAGE: null,
    SET_IMAGE_DATA: null,
    VIEW_IMAGE_DATA: null,

    //Offline Actions
    SET_DOWNLOADING_DS_FILE_AND_PROGRESS_BAR: null,
    UPDATE_PROGRESS_BAR: null,
    SET_DOWNLOADING_STATUS: null,
    SET_OFFLINEDS_INITIAL_STATE: null,
    SET_LAST_SYNC_TIME: null,

    //FormLayoutImpl
    PREVIOUSLY_TRAVELLED_DISTANCE: null,
    TRANSACTION_TIME_SPENT: null,
    TRACK_BATTERY: null,
    NPSFEEDBACK_VALUE: null,
    IS_SERVER_REACHABLE: null,
})


