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
    CONTACT_NUMBER: 27,
    DECIMAL: 13,
    FIXED_SKU: 50,
    LANDMARK: 30,
    MODE: 'mode_type',
    MONEY_COLLECT: 18,
    MONEY_PAY: 19,
    OBJECT: 11,
    ORIGINAL_AMOUNT: 25,
    PINCODE: 31,
    RECEIPT: 'receipt',
    REMARKS: 'remarks',
    SKU_ACTUAL_AMOUNT: 32,
    SKU_ARRAY: 17,
    SKU_ORIGINAL_QUANTITY:15,
    SKU_CODE:51,
    SKU_ACTUAL_QUANTITY:16,
    TOTAL_ORIGINAL_QUANTITY:35,
    TOTAL_ACTUAL_QUANTITY:36,
    SKU_UNIT_PRICE:14,
    TRANSACTION_NUMBER: 'transaction_number',
    NPS_FEEDBACK: 23,
    RE_ATTEMPT_DATE: 33,
    DATE: 3,
    TIME: 5,

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
    ARRAYSAROJFAREYE: 'ArraySarojFareye',
    OBJECTSAROJFAREYE: 'ObjectSarojFareye',
    FIXED_SKU_QUANTITY: 6,
    FIXED_SKU_UNIT_PRICE: 13,
    FIXED_SKU_CODE: 1,
    OBJECT_ATTR_ID: 11,
    OBJECT_SAROJ_FAREYE: 'ObjectSarojFareye',
    TOTAL_AMOUNT: 'TotalAmount',
    ARRAY_SAROJ_FAREYE: 'ArraySarojFareye',
    CAMERA_HIGH: 42,
    CAMERA_MEDIUM: 43,
    CAMERA: 20,
    SIGNATURE: 21,
    SIGNATURE_AND_FEEDBACK: 58,
    CASH_TENDERING: 38,
    OPTION_CHECKBOX: 8,
    OPTION_RADIO_FOR_MASTER: 39,
    MULTIPLE_SCANNER: 48,
    TOTAL_ORIGINAL_QUANTITY: 35,
    TOTAL_ACTUAL_QUANTITY: 36,
    STRING: 1,
    TEXT: 2,
    NUMBER: 6,
    DECIMAL: 13,
    DATA_STORE: 44
}