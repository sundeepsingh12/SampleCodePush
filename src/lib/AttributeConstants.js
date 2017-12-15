import RNFS from 'react-native-fs'
import CONFIG from '../lib/config'
import BulkIcon from '../../src/svg_components/icons/BulkIcon'
import LiveIcon from '../../src/svg_components/icons/LiveIcon'
import SequenceIcon from '../../src/svg_components/icons/SequenceIcon'
import TaskIcon from '../../src/svg_components/icons/TaskIcon'
import React, { Component } from 'react'
module.exports = {

    /**
     * TODO : Change money collect details object keys to attribute type id
     */
    // Job or Field Attribute Constants
    ACTUAL_AMOUNT: 26,
    ADDRESS_LINE_1: 28,
    ADDRESS_LINE_2: 29,
    AMOUNT: 'amount',
    ARRAY: 12,
    CAMERA: 20,
    CAMERA_HIGH: 42,
    CAMERA_MEDIUM: 43,
    CASH_TENDERING: 38,
    CHECKBOX: 8,
    CONTACT_NUMBER: 27,
    DATE: 3,
    DATA_STORE: 44,
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
    RADIOBUTTON: 9,
    RECEIPT: 'receipt',
    REMARKS: 'remarks',
    RE_ATTEMPT_DATE: 33,
    SEQUENCE: 62,
    SIGNATURE: 21,
    SIGNATURE_AND_FEEDBACK: 58,
    SKU_ACTUAL_AMOUNT: 32,
    SKU_ACTUAL_QUANTITY: 16,
    SKU_ARRAY: 17,
    SKU_CODE: 51,
    SKU_ORIGINAL_QUANTITY: 15,
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

    //REST API 
    SEARCH_VALUE: '?searchValue=',
    DATA_STORE_MASTER_ID: '&dataStoreMasterId=',
    DATA_STORE_ATTR_MASTER_ID: '&dataStoreMasterAttributeId=',
    GET: 'GET',
    EXTERNAL_DATA_STORE_URL: "&externalDataStoreUrl=",
    DATA_STORE_ATTR_KEY: "&dataStoreAttributeKey=",
    PATH_TEMP: RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER + '/TEMP/',
    SIGN: 'sign_',
    IMAGE_EXTENSION: '.jpg',
    TOKEN_MISSING: 'Token Missing',
    LOGIN: '?login=',
    POST: 'POST',

    //Exceptions and Error
    //Profile Service
    REGEX_TO_VALIDATE_PASSWORD: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}/,
    CHECK_IF_PASSWORD_ENTERED: "Please Enter Password",
    CHECK_CURRENT_PASSWORD: "Current Password is wrong Please try again",
    MATCH_NEW_AND_CONFIRM_PASSWORD: "Confirm new password does not match with new password.",
    CURRENT_AND_NEW_PASSWORD_CHECK: "New password cannot be same as current password.",
    VALIDATE_PASSWORD: "Password should be minimum 8 characters long and should contain at least one number, one special character, one uppercase and one lowercase alphabet.",
    //Profile Actions
    UNSAVED_PASSWORD: 'Password not saved before',
    PASSWORD_RESET_SUCCESSFULLY: " Password reset successful. Use the new password next time you log-in..",
    TRY_AGAIN: "Please try again...",
    //ProfileReset Container
    CONFIRM_CURRENT_PASSWORD: 'Confirm Current Password',
    NEW_PASSWORD: 'New Password',
    CONFIRM_NEW_PASSWORD: 'Confirm New Password',

    //App Modules Constants
    BACKUP: {
        appModuleId: 17,
        displayName: 'Backup',
        enabled: false,
    },
    BLUETOOTH: {
        appModuleId: 16,
        displayName: 'Pair Bluetooth Device',
        enabled: false,
    },
    BULK: {
        appModuleId: 1,
        displayName: 'Bulk Update',
        enabled: false,
        icon: <BulkIcon />,
    },
    LIVE: {
        appModuleId: 13,
        displayName: 'Live',
        enabled: false,
        icon: <LiveIcon />,
    },
    OFFLINEDATASTORE: {
        appModuleId: 15,
        displayName: 'Sync Datastore',
        enabled: false,
    },
    PIECHART: {
        appModuleId: 5,
        displayName: 'Pie Chart',
        enabled: false,
    },
    PROFILE: {
        appModuleId: 14,
        displayName: 'Profile',
        enabled: false,
        icon: 'md-person',
    },
    STATISTIC: {
        appModuleId: 7,
        displayName: 'My Stats',
        enabled: false,
        icon: 'md-trending-up',
    },
    SEQUENCEMODULE: {
        appModuleId: 2,
        displayName: 'Sequence',
        enabled: false,
        icon: <SequenceIcon />,
    },
    START: {
        appModuleId: 4,
        displayName: 'All Tasks',
        enabled: false,
        icon: <TaskIcon />
    },
    SUMMARY: {
        appModuleId: 8,
        displayName: '',
        enabled: false,
    },
    SORTING: {
        appModuleId: 26,
        displayName: 'Sort Parcels',
        enabled: false,
        icon: <SequenceIcon />,
    },
    CUSTOMAPP:{
        appModuleId:12,
        displayName: 'Web URL',
        enabled: false,
        remark: null,
        icon: <SequenceIcon />
    },

    JOB_ASSIGNMENT : 20,


    //JobStatusConstants
    UNSEEN: 'UNSEEN',

    //Status Category
    PENDING: 1,
    FAIL: 2,
    SUCCESS: 3,

    //Sorting module constants
    REFERENCE_NO: 'referenceNo=',
    REF_UNAVAILABLE: 'ReferenceNumber Unavailable',
    FAILURE_SORTING: 'Searching failed, Please try again !',
    NA: 'N.A',
    SEARCH_INFO: 'Search/Scan QR code in the top bar to Start',
    SORTING_PLACEHOLDER: 'Enter Reference Number To Scan Package',

    //SkuListing Service
    TOTAL_ORG_QTY_NOT_EQUAL_TOTAL_ACTUAL_QTY: 'Quantity should be less than max quantity.Cannot proceed.',
    QTY_NOT_ZERO: `Quantity can't be 0.Cannot proceed.`,
    TOTAL_ORG_QTY_EQUAL_TOTAL_ACTUAL_QTY: 'Quantity should be equal to max quantity.Cannot proceed.',
    QTY_ZERO: 'Quantity should be 0.Cannot proceed.',

    //Sequence Container
    ROUTE_OPTIMIZATION: 'Route optimisation',

    //Bulk Listing Container
    NEXT_POSSIBLE_STATUS: 'Next possible status',

    // Array attribute constants
    ADD_TOAST: 'Please fill required fields first',
    INVALID_CONFIG_ERROR: 'Invalid Configuration,please contact manager',

    //job details constants
    SELECT_NUMBER: 'Select number for message',
    CANCEL: 'Cancel',
    SELECT_TEMPLATE: 'Select template for message',
    SELECT_NUMBER_FOR_CALL: 'Select number for call',
    CONFIRMATION: 'Confirmation: ',
    OK: 'Ok',
    CALL_CONFIRM: 'Do you want to proceed with the call?',

    //enableSequence
    SEQ_SELECTED: 'seqSelected',

    //Start Search PlaceHolder
    SEARCH_PLACEHOLDER: 'Filter Reference Numbers',

    //NonExpandableDetailsView
    VIEW_TEXT_LABEL: 'View',

    //Error Messages
    USER_NOT_FOUND: 'User Not Found',
    SERVICE_ALREADY_SCHEDULED: 'Service Already Scheduled',
    //Error Message for NonExpandableDetailsView
    IMAGE_LOADING_ERROR: 'An error occurred while loading image',
   
    //Custom App
    WEBVIEW_REF : 'webview',
    URL : 'URL',
    CHOOSE_WEB_URL : "Choose Web URL",
    ENTER_URL_HERE : "Enter Url Here",
    HTTP : 'http://',

    //SelectFromList
    SEARCH: 'Search',
    OK: 'Ok',

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
}