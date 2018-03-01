module.exports = {
    //Token Error
    TOKEN_MISSING: 'Token Missing',

    //common_CONSTANTS
    CANCEL: 'Cancel',
    OK: 'Ok',
    SAVE: 'Save',
    DONE: 'DONE',
    DISMISS: 'DISMISS',
    CLOSE: 'Close',

    // Sync Container 
    DOWNLOADING: 'Downloading ...',
    INTERNAL_ERROR: 'Internal Error.',
    INTERNAL_SERVER_ERROR: 'Internal Server Error.',
    NO_INTERNET: 'No Internet Connection',
    RE_SYNC: 'Re-Sync',
    RETRY: 'Retry',
    SYNC_OK_TEXT: 'All data synced perfectly to the server.',
    UNSYNCED_TASKS: 'Unsynced Tasks',
    UPLOADING: 'Uploading ...',
    AUTHENTICATING: 'Authenticating...',
    SYNC: 'Sync',
    ERP_SYNC_OK_TEXT: 'All data downloaded perfectly.',
    DAYS_AGO: ' days ago',
    HOURS_AGO: ' hours ago',
    MINUTES_AGO: ' minutes ago',
    SECONDS_AGO: ' seconds ago',
    RESYNC_IN: 'Resync in',
    ERP_SYNC: 'ERP Sync',

    //Post Assignment Container
    SHIPMENT_NOT_FOUND: 'Scanned Shipment Not Found',
    SHIPMENT_ALREADY_SCANNED: 'Shipment is already scanned',
    NOT_FOUND: 'Not Found',
    FORCE_ASSIGNED: 'Force Assigned',
    POST_SEARCH_PLACEHOLDER: 'Enter Reference Number To Scan Package',

    //Home Constants
    JOB_ASSIGNMENT_DISPLAY: 'Job Assignment',
    CUSTOM_APP_DISPLAY: 'Web URL',
    SORTING_DISPLAY: 'Sort Parcels',

    //Job Master
    JOB_MASTER_HEADER: 'Job Master List',

    //New Job
    NEW_JOB_CONFIGURATION_ERROR: 'Configuration error no job master mapped!',

    //Offline DS
    DOWNLOADING_OFFLINE_DS: 'Downloading',
    DOWNLOAD_SUCCESSFUL: 'Download Successful',
    DOWNLOAD_FAILED: 'Download Failed',

    //Form Layout Container
    UNIQUE_VALIDATION_FAILED: 'This code is already in use',
    INVALID_FORM_ALERT: 'Form is incorrectly filled please re-check the form',
    ALERT: 'Alert!',
    OPTIONAL: '(optional)',
    SELECTED: ' Selected',

    //status revert 
    REVERT_STATUS_TO: 'Revert Status to',
    REVERT_NOT_ALLOWED_INCASE_OF_SYNCING: 'Syncing with server.\nPlease try after some time.',
    CONFIRM_REVERT: 'Confirm Revert',
    PRESS_OK_TO_CONFIRM_REVERT_TO: 'Press OK to confirm revert to ',
    REVERT_NOT_ALLOWED_AFTER_COLLECTING_AMOUNT: 'Revert is not allowed after collecting amount.',

    //Payment Container
    YES: 'Yes',
    NO: 'No',
    AMOUNT_TO_BE_COLLECTED: 'Amount to be collected',
    SPLIT_PAYMENT: 'Split Payment',
    SELECT_PAYMENT_METHOD: 'Select Payment Method',
    SELECT_PAYMENT_METHOD_TO_SPLIT: 'Select Payment Methods to Split',
    ENTER_SPLIT_DETAILS: 'Enter Split Details',
    AMOUNT: 'Amount',
    PAYMENT: 'Payment',
    ADD_PAYMENT_MODE: '+ Add',
    NUMBER: 'Number',
    SPLIT_AMOUNT_ERROR: 'Total split amount should be equal to actual amount',
    INVALID_CONFIGURATION: 'Invalid Configuration',

    //Sequence
    SELECT_RUNSHEET_NUMBER: 'Select runsheet number',
    DUPLICATE_SEQUENCE_MESSAGE: 'Duplicate sequence found for this runsheet auto corrected, please save the modified sequence',
    SAVE_SUCCESSFUL: 'Save Successful',
    UPDATE_SEQUENCE: 'Update Sequence',
    SAVE: 'Save',
    WARNING_FOR_BACK: 'Sequence changes have not been save, please return and save changes',
    WARNING: 'Warning',
    JOB_NOT_PRESENT: 'No jobs present',
    CURRENT_SEQUENCE_NUMBER: 'Current sequence number : ',
    NEW_SEQUENCE_NUMBER_MESSAGE: 'Enter new sequence number to jump to',
    JUMP_SEQUENCE: 'Jump Sequence',
    UNTRACKED_JOBS_MESSAGE: ' jobs were not resequenced',

    //Exception used in sequence
    SAME_SEQUENCE_ERROR: `New seqence can't be same as previous sequence`,
    SEQUENCELIST_MISSING: `sequenceList not present`,
    BLANK_NEW_SEQUENCE: `Sequence can't be left blank`,
    CURRENT_SEQUENCE_ROW_MISSING: `currentSequenceListItemIndex missing`,
    SEQUENCE_NOT_AN_INT: `Sequence can't be `,
    RUNSHEET_MISSING: 'No runsheet found',
    RUNSHEET_NUMBER_MISSING: 'Runsheet number not present',
    TRANSACTIONS_WITH_CHANGED_SEQUENCE_MAP: 'transactionsWithChangedSeqeunceMap not present',
    SEARCH_TEXT_MISSING: 'searchText not present',
    SEQUENCE_REQUEST_DTO: 'sequenceRequestDto missing',
    TOKEN_MISSING: 'Token missing',
    INVALID_SCAN: 'Invalid Scan',
    JOB_MASTER_ID_CUSTOMIZATION_MAP_MISSING: 'jobMasterIdCustomizationMap is missing',

    //Sync service
    JOBS_DELETED: 'Jobs deleted',

    //Data Store service
    DATA_STORE_MAP_MISSING: 'dataStoreAttrValueMap is missing',
    CURRENT_ELEMENT_MISSING: 'currentElement Missing',

    //Data Store Filter
    JOBATTRIBUTES_MISSING: 'jobAttributes is missing',
    DSF_LIST_MISSING: 'DSFList is missing',
    FIELD_ATTRIBUTE_ATTR_MASTER_ID_MISSING: 'fieldAttributeMasterId is missing',
    FORM_ELEMENT_IS_MISSING: 'formElement is missing',
    //Summary
    REFUND: 'Refund',
    COLLECTION_CASH: 'Collection-Cash',
    COLLECTION_SOD: 'Collection-SOD',

    //Multiple Option Container
    NO_OPTIONS_PRESENT: 'No options Present',
    //Save Activated and CheckoutDetails
    SMS_NOT_SENT_TRY_AGAIN_LATER: 'SMS not sent ,try again later',
    EMAIL_NOT_SENT_TRY_AGAIN_LATER: 'Email not sent ,try again later',
    SMS_SENT_SUCCESSFULLY: 'Sms sent successfully',
    EMAIL_SENT_SUCCESSFULLY: 'Email sent successfully',
    PLEASE_ENTER_A_VALID_EMAIL_ID: 'Please Enter a Valid Email Id',
    MOBILE_NUMBER: 'Mobile Number',
    ENTER_EMAIL_IDS: 'Enter Email Ids',
    CONTACT_NUMBER_SHOULD_START_WITH_0_AND_CONTAINS_MINIMUM_OF_10_DIGITS: 'Contact Number should start with 0 and contains minimum of 10 digits',
    RECEPIENTS_CONTACT_NUMBER: `Recepient's Contact Number`,
    SEND: 'Send',
    RECEPIENTS_EMAIL_ADDRESS: `Recepient's Email Address`,

    //Backup Exceptions
    USER_MISSING: 'user missing',

    //Backup
    BACKUP_CREATED_SUCCESS_TOAST: 'Backup created successfully',
    BACKUP_ALREADY_EXISTS: 'Backup already exists for this data',
    FILE_MISSING: 'File Missing',
    BACKUP_ALERT_TITLE: 'Manual Backup',
    BACKUP_ALERT_MESSAGE: 'Do you want to create backup manually?',
    FILE_CREATED: 'File Created',
    EMPLOYEE_CODE: 'Employee Code',
    FILE_SIZE: 'File Size',
    NEW: 'New',
    UNSYNCED_FILES: 'Unsynced Files',
    SYNCED_FILES: 'Synced Files',
    CREATE_BACKUP_BUTTON: '+ Create Backup',

    //DataStore
    SUGGESTIONS: 'Suggestions',

    //Array
    TOTAL_COUNT: 'Total Count : ',
    ADD: 'Add',
    SAVE: 'Save',
    ADD_ROW_ERROR: 'Row could not be added',
    DELETE_ROW_ERROR: 'Row could not be deleted',
    SAVE_ARRAY_ERROR: 'Array Could not be saved',

    //Expandable Details View
    TAP_TO_HIDE: 'Tap to hide',
    TAP_TO_SHOW: 'Tap to show',
    N_A: 'N.A',

    //Job_DetailsV2
    UPDATE_GROUP: 'Update Group',

    //Save Activated
    EDIT: 'Edit'
}