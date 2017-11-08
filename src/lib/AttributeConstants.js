import RNFS from 'react-native-fs';
import CONFIG from '../lib/config'
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
    SIGNATURE_AND_NPS: 58,
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
        appModuleId: 10
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
        appModuleId: 9
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
    ARRAYSAROJFAREYE: 'ArraySarojFareye',
    OBJECTSAROJFAREYE: 'ObjectSarojFareye',

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
    ALERT_MESSAGE: 'alertMessage',
    ASSIGN: 'assign',
    ASSIGN_BY_MATHEMATICAL_FORMULA: 'assignByMathematicalFormula',
    ASSIGN_DATE_TIME: 'assignDateTime',
    DATE_COMPARATOR: 'dateComparator',
    ELSE: 'else',
    REQUIRED_FALSE: 'requiredFalse',
    REQUIRED_TRUE: 'requiredTrue',
    RETURN: 'return',
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

    //Status Category
    PENDING:1,
    FAIL:2,
    SUCCESS:3,

}