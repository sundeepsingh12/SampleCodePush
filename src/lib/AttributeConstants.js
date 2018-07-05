import RNFS from 'react-native-fs'
import CONFIG from '../lib/config'
module.exports = {

    APP_VERSION_NUMBER: '0.3.1',
    /**
     * TODO : Change money collect details object keys to attribute type id
     */
    // Job or Field Attribute Constants
    ACTUAL_AMOUNT: 26,
    ADDRESS_LINE_1: 28,
    ADDRESS_LINE_2: 29,
    ADVANCE_DROPDOWN: 46,
    AMOUNT: 'amount',
    ARRAY: 12,
    CAMERA: 20,
    CAMERA_HIGH: 42,
    CAMERA_MEDIUM: 43,
    CASH_TENDERING: 38,
    CHECKBOX: 8,
    CONTACT_NUMBER: 27,
    COUNT_DOWN_TIMER: 34,
    DATE: 3,
    DATA_STORE: 44,
    DATA_STORE_FILTER: 64,
    DECIMAL: 13,
    DROPDOWN: 10,
    EXTERNAL_DATA_STORE: 63,
    FIXED_SKU: 50,
    FIXED_SKU_QUANTITY: 6,
    FIXED_SKU_UNIT_PRICE: 13,
    FIXED_SKU_CODE: 1,
    IMAGE_URL: 24,
    JOB_EXPIRY_TIME: 69,
    LANDMARK: 30,
    MODE: 'mode_type',
    MONEY_COLLECT: 18,
    MONEY_PAY: 19,
    MULTIPLE_SCANNER: 48,
    NPS_FEEDBACK: 23,
    NUMBER: 6,
    OBJECT: 11,
    OPTION_CHECKBOX: 8,
    OPTION_RADIO_FOR_MASTER: 39,
    OPTION_RADIO_KEY: 40,
    OPTION_RADIO_VALUE: 41,
    ORIGINAL_AMOUNT: 25,
    PASSWORD: 61,
    PINCODE: 31,
    QR_SCAN: 22,
    RADIOBUTTON: 9,
    RECEIPT: 'receipt',
    REMARKS: 'remarks',
    RE_ATTEMPT_DATE: 33,
    SCAN_OR_TEXT: 54,
    SEQUENCE: 62,
    SIGNATURE: 21,
    SIGNATURE_AND_FEEDBACK: 58,
    SKU_ACTUAL_AMOUNT: 32,
    SKU_ACTUAL_QUANTITY: 16,
    SKU_ARRAY: 17,
    SKU_CODE: 51,
    SKU_ORIGINAL_QUANTITY: 15,
    SKU_PHOTO: 55,
    SKU_REASON: 56,
    SKU_UNIT_PRICE: 14,
    STRING: 1,
    TEXT: 2,
    TIME: 5,
    TOTAL_ORIGINAL_QUANTITY: 35,
    TOTAL_ACTUAL_QUANTITY: 36,
    TOTAL_AMOUNT: 'TotalAmount',
    TRANSACTION_NUMBER: 'transaction_number',

    // Money Collect Mode Type Constants
    CASH: {
        displayName: 'Cash',
        id: 1,
        modeType: 'CS'
    },
    CHEQUE: {
        displayName: 'Cheque',
        id: 4,
        modeType: 'Cheque',
    },
    DEMAND_DRAFT: {
        displayName: 'Demand-Draft',
        id: 11,
        modeType: 'Demand Draft'
    },
    DISCOUNT: {
        displayName: 'Discount',
        id: 9,
        modeType: 'Discount'
    },
    EZE_TAP: {
        displayName: 'Eze-Tap',
        id: 2,
        modeType: 'EzeTap',
        appModuleId: 10,
        enabled: false,
    },
    MOSAMBEE: {
        displayName: 'Mosambee',
        id: 12,
        modeType: 'CC',
        appModuleId: 18
    },
    MOSAMBEE_WALLET: {
        displayName: 'Mosambee Wallet',
        id: 14,
        modeType: 'WL',
        appModuleId: 19
    },
    MPAY: {
        displayName: 'MPAY',
        id: 20,
        modeType: 'MPAY',
        appModuleId: 29
    },
    M_SWIPE: {
        displayName: 'M-Swipe',
        id: 3,
        modeType: 'MSwipe',
        appModuleId: 9,
        enabled: false,
    },
    NET_BANKING: {
        displayName: 'Net Banking',
        id: 16,
        modeType: 'NB',
        appModuleId: 22
    },
    NET_BANKING_LINK: {
        displayName: 'Net Banking Link',
        id: 98,
        modeType: 'NB'
    },
    NET_BANKING_CARD_LINK: {
        displayName: 'Card Link',
        id: 97,
        modeType: 'NC',
    },
    NET_BANKING_UPI_LINK: {
        displayName: 'UPI Link',
        id: 99,
        modeType: 'UP'
    },
    NOT_PAID: {
        displayName: 'Not Paid',
        id: 8,
        modeType: 'No Money Paid'
    },
    PAYNEAR: {
        displayName: 'PayNear',
        id: 10,
        modeType: 'PayNear',
        appModuleId: 11
    },
    PAYO: {
        displayName: 'PAYO',
        id: 18,
        modeType: 'PAYO',
        appModuleId: 24
    },
    PAYTM: {
        displayName: 'PAYTM',
        id: 19,
        modeType: 'Paytm',
        appModuleId: 28
    },
    POS: {
        displayName: 'POS Device Payment',
        id: 13,
        modeType: 'POS'
    },
    RAZOR_PAY: {
        displayName: 'Razor Pay',
        id: 17,
        modeType: 'Razor pay',
        appModuleId: 23
    },
    SODEXO: {
        displayName: 'Sodexo',
        id: 5,
        modeType: 'Sodexo'
    },
    SPLIT: {
        displayName: 'Split',
        id: 7,
        modeType: 'Split Payment'
    },
    TICKET_RESTAURANT: {
        displayName: 'Ticket Restaurant',
        id: 6,
        modeType: 'Ticket Restaurant'
    },
    UPI: {
        displayName: 'UPI',
        id: 15,
        modeType: 'UP',
        appModuleId: 21
    },
    // Field Data Value Constants
    ARRAY_SAROJ_FAREYE: 'ArraySarojFareye',
    OBJECT_SAROJ_FAREYE: 'ObjectSarojFareye',

    //Validation Condition Constants
    EQUAL_TO: '==',
    CONTAINS: 'contains',
    GREATER_THAN: '>',
    GREATER_THAN_OR_EQUAL_TO: '>=',
    LESS_THAN: '<',
    LESS_THAN_OR_EQUAL_TO: '<=',
    NOT_EQUAL_TO: '!=',
    REGEX: 'regex',

    //Validation Action Constants
    AFTER: 'After',
    ALERT_MESSAGE: 'alertMessage',
    ASSIGN: 'assign',
    ASSIGN_BY_MATHEMATICAL_FORMULA: 'assignByMathematicalFormula',
    ASSIGN_DATE_TIME: 'assignDateTime',
    AVERAGE: 'average',
    BEFORE: 'Before',
    CONCATENATE: 'concatenate',
    DATE_COMPARATOR: 'dateComparator',
    ELSE: 'else',
    MAX: 'max',
    MIN: 'min',
    REQUIRED_FALSE: 'requiredFalse',
    REQUIRED_TRUE: 'requiredTrue',
    RETURN: 'return',
    SUM: 'sum',
    THEN: 'then',
    TIME_COMPARATOR: 'timeComparator',
    SKUVALIDATION: 'SKUValidation',

    //REST API 
    SEARCH_VALUE: '?searchValue=',
    DATA_STORE_MASTER_ID: '&dataStoreMasterId=',
    DATA_STORE_ATTR_MASTER_ID: '&dataStoreMasterAttributeId=',
    GET: 'GET',
    EXTERNAL_DATA_STORE_URL: "&externalDataStoreUrl=",
    DATA_STORE_ATTR_KEY: "&dataStoreAttributeKey=",

    //Location where zip contents are temporarily added and then removed
    PATH_COMPANY_LOGO_DIR: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/LOGO',
    PATH_COMPANY_LOGO_IMAGE: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/LOGO/companyLogo.jpg',
    PATH_TEMP: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP',
    PATH_CUSTOMER_IMAGES: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/CustomerImages/',
    PATH: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER,
    PATH_BACKUP: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUP',
    PATH_BACKUP_TEMP: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/BACKUPTEMP',
    SIGN: 'sign_',
    IMAGE_EXTENSION: '.jpg',

    //SaveActivated & Transient Strings
    EMAIL: 'E-mail',
    Return_To_Home: 'Return To Home',
    View_SignOff_Summary: 'View SignOff Summary',
    View_Parcel_Summary: 'View Parcel Summary',
    Sign_Off_Summary: 'Sign Off Summary',
    Parcel_Summary: 'Parcel Summary',
    NO:'No',
    Yes_Checkout: 'Checkout',
    Total: 'Total :',
    Select_Next_Status: 'Select Next Status',
    REGEX_TO_CHECK_PHONE_NUMBER: /^[0-9]{10,25}$/,

    TOKEN_MISSING: 'Token Missing',
    LOGIN: '?login=',
    POST: 'POST',

    //Exceptions and Error
    //Profile Service
    REGEX_TO_VALIDATE_PASSWORD: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}/,

    // App Modules Constants
    BACKUP_ID: 17,
    BLUETOOTH_ID: 16,
    BULK_ID: 1,
    LIVE_ID: 13,
    OFFLINEDATASTORE_ID: 15,
    PIECHART_ID: 5,
    PROFILE_ID: 14,
    STATISTIC_ID: 7,
    SEQUENCEMODULE_ID: 2,
    START_ID: 4,
    SUMMARY_ID: 8,
    SORTING_ID: 26,
    CUSTOMAPP_ID: 12,
    NEWJOB_ID: 3,
    EZE_TAP_ID: 10,
    M_SWIPE_ID: 9,
    JOB_ASSIGNMENT_ID: 20,
    MOSAMBEE_WALLET_ID: 19,
    PAGE_NEW_JOB: 2,
    Piechart: {
        enabled: false,
        params: []
    },
    Start: {
        landingTab: false
    },
    //JobStatusConstants
    UNSEEN: 'UNSEEN',

    //Status Category
    PENDING: 1,
    FAIL: 2,
    SUCCESS: 3,

    //Sorting module constants
    REFERENCE_NO: 'referenceNo=',
    NA: 'N.A',

    //Sequence Attribute
    SEQUENCE_ID: 'sequenceMasterId=',
    SEQUENCE_COUNT: '&count=',
    SEQUENCE_ID_UNAVAILABLE: 'MasterId Unavailable !',

    //Sequence Container
    ROUTE_OPTIMIZATION: 'Route optimisation',

    //enableSequence
    SEQ_SELECTED: 'seqSelected',

    //NonExpandableDetailsView
    VIEW_TEXT_LABEL: 'View',

    //Error Messages
    USER_NOT_FOUND: 'User Not Found',
    SERVICE_ALREADY_SCHEDULED: 'Service Already Scheduled',
    UNKNOWN_PAGE_TYPE: 'Unknown page type. Contact support',


    //Custom App
    WEBVIEW_REF: 'webview',
    URL: 'URL',
    CHOOSE_WEB_URL: "Choose Web URL",
    ENTER_URL_HERE: "Enter Url Here",
    HTTP: 'http://',

    //SelectFromList
    SEARCH: 'Search',

    //Notification 
    FAREYE_UPDATES: 'FarEye Updates',

    //Add Server Sms 
    BIKER_NAME: 'BIKER_NAME',
    BIKER_MOBILE: 'BIKER_MOBILE',
    REF_NO: 'REF_NO',
    ATTEMPT_NO: 'ATTEMPT_NO',
    RUNSHEET_NO: 'RUNSHEET_NO',
    CREATION_DATE: 'CREATION_DATE',
    TRANSACTION_DATE: 'TRANSACTION_DATE',
    JOB_ETA: 'JOB_ETA',
    TRANSACTION_COMPLETED_DATE: 'TRANSACTION_COMPLETED_DATE',

    //ModuleCustomization
    NEW_JOB: 'New Task',

    //Events Log
    LOGIN_SUCCESSFUL: 1,
    LOGOUT_SUCCESSFUL: 2,
    SERVER_UNREACHABLE: 3,
    SERVER_REACHABLE: 4,

    //Offline DS Actiions
    LAST_SYNCED: 'Last synced   ',
    NEVER_SYNCED: 'Never Synced',

    //PAGES Constants
    PAGE_TABS: 1,
    PAGE_NEW_JOB: 2,
    PAGE_BULK_UPDATE: 3,
    PAGE_INLINE_UPDATE: 4,
    PAGE_LIVE_JOB: 5,
    PAGE_JOB_ASSIGNMENT: 6,
    PAGE_OUTSCAN: 7,
    PAGE_SEQUENCING: 8,
    PAGE_CUSTOM_WEB_PAGE: 9,
    PAGE_SORTING_PRINTING: 10,
    PAGE_PICKUP: 11,
    PAGE_STATISTICS: 12,
    PAGE_PROFILE: 13,
    PAGE_OFFLINE_DATASTORE: 14,
    PAGE_BACKUP: 15,
    PAGE_BLUETOOTH_PAIRING: 16,
    PAGE_MSWIPE_INITIALIZE: 17,
    PAGE_EZETAP_INITIALIZE: 18,
    PAGE_PAYNEAR_INITIALIZE: 19,
    PAGE_MOSAMBEE_INITIALIZE: 20,

    //PAGE UTILITY Constants
    PAGE_SUMMARY_PIECHART: 1,
    PAGE_MESSAGING: 2,

    //App Upgrade & Code Push Constants
    LATEST_APK_PATH: '/fareye_latest1.apk',
    MAJOR_VERSION_OUTDATED: '1',
    MINOR_PATCH_OUTDATED: '2'
}