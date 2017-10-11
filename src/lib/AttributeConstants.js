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
    OBJECT: 11,
    ORIGINAL_AMOUNT: 25,
    PINCODE: 31,
    RECEIPT: 'receipt',
    REMARKS: 'remarks',
    SKU_ACTUAL_AMOUNT: 32,
    SKU_ARRAY: 17,
    TRANSACTION_NUMBER: 'transaction_number',

    // Money Collect Mode Type Constants
    CASH: {
        id: 1,
        modeType: 'CS'
    },
    CHEQUE: {
        id: 4,
        modeType: 'Cheque',
    },
    DEMAND_DRAFT: {
        id: 11,
        modeType: 'Demand Draft'
    },
    DISCOUNT: {
        id: 9,
        modeType: 'Discount'
    },
    EZE_TAP: {
        id: 2,
        modeType: 'EzeTap'
    },
    MOSAMBEE: {
        id: 12,
        modeType: 'CC'
    },
    MOSAMBEE_WALLET: {
        id: 14,
        modeType: 'WL'
    },
    MPAY: {
        id: 20,
        modeType: 'MPAY'
    },
    M_SWIPE: {
        id: 3,
        modeType: 'MSwipe'
    },
    NET_BANKING: {
        id: 16,
        modeType: 'NB'
    },
    NOT_PAID: {
        id: 8,
        modeType: 'No Money Paid'
    },
    PAYNEAR: {
        id: 10,
        modeType: 'PayNear'
    },
    PAYO: {
        id: 18,
        modeType: 'PAYO'
    },
    PAYTM: {
        id: 19,
        modeType: 'Paytm'
    },
    POS: {
        id: 13,
        modeType: 'POS'
    },
    RAZOR_PAY: {
        id: 17,
        modeType: 'Razor pay'
    },
    SODEXO: {
        id: 5,
        modeType: 'Sodexo'
    },
    SPLIT: {
        id: 7,
        modeType: 'Split Payment'
    },
    TICKET_RESTAURANT: {
        id: 6,
        modeType: 'Ticket Restaurant'
    },
    UPI: {
        id: 15,
        modeType: 'UP'
    },


    // Field Data Value Constants
    ARRAYSAROJFAREYE: 'arraysarojfareye',
    OBJECTSAROJFAREYE: 'objectsarojfareye',

    //App Module Customization Constants
    UPIMODULE: 21,
    PAYBYLINKMODULE: 22,

}