module.exports = {
    //Token Error
    TOKEN_MISSING: 'Token Missing',

    //CustomApp
    INVALID_URL_OR_NO_INTERNET: "Invalid Url or No Internet",

    //common_CONSTANTS
    CANCEL: 'Cancel',
    OK: 'Ok',
    DONE: 'DONE',
    DISMISS: 'DISMISS',
    CLOSE: 'Close',
    VERIFY: 'Verify',

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
    NEW_TASK: 'New Task',

    //Offline DS
    DOWNLOADING_OFFLINE_DS: 'Downloading',
    DOWNLOAD_SUCCESSFUL: 'Download Successful',
    DOWNLOAD_FAILED: 'Download Failed',

    //Form Layout Container
    UNIQUE_VALIDATION_FAILED: 'This code is already in use',
    UNIQUE_VALIDATION_FAILED_FORMLAYOUT: 'This value is already in use',
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
    REVERT_STATUS: 'Revert Status',

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
    VALID_AMOUNT_ERROR: 'Please enter valid amount',
    VALIDATION_AMOUNT_ERROR_LEFT: 'Amount should be greater than or equal to',
    VALIDATION_AMOUNT_ERROR_RIGHT: 'and less than or equal to',

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
    NOT_A_NUMBER: 'Please enter a number',
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
    CONFIRM: 'Confirm',

    //Data Store Filter
    JOBATTRIBUTES_MISSING: 'jobAttributes is missing',
    DSF_LIST_MISSING: 'DSFList is missing',
    FIELD_ATTRIBUTE_ATTR_MASTER_ID_MISSING: 'fieldAttributeMasterId is missing',
    FORM_ELEMENT_IS_MISSING: 'formElement is missing',
    INVALID_BULK_JOB_CONFIG: 'Invalid job data in bulk data store filter, cannot proceed further.',
    CONFIGURATION_ERROR_DS_MASTER_ID_MISSING: 'Configuration error data store mapping is missing',
    //Summary
    REFUND: 'Refund',
    COLLECTION_CASH: 'Collection-Cash',
    COLLECTION_SOD: 'Collection-SOD',

    //Multiple Option Container
    NO_OPTIONS_PRESENT: 'No options Present',
    MULTIPLE_SELECT_OPTIONS: 'Multiple Select Options',
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
    UPLOAD: 'Upload',
    UPLOAD_SUCCESSFUL: ' Upload Successful',
    UPLOAD_FAILED: 'Upload Failed',
    LOGGING_OUT: 'Logging out',
    LOGOUT_UNSYNCED_TRANSACTIONS_TITLE: 'Confirm Log Out',
    LOGOUT_UNSYNCED_TRANSACTIONS_MESSAGE: 'You have transactions to be synced with server. Click OK to confirm Log-out or Cancel to try-again',
    //Tracking constants
    ENTER: 'ENTER',
    EXIT: 'EXIT',
    INSIDE_BOUNDARY: 'inside boundary',
    OUTSIDE_BOUNDARY: 'out of boundary',



    //GeoFencing Service
    HUB_LAT_LONG_MISSING: 'Hub Lat Long missing',
    FENCE_LAT_LONG_MISSING: 'fenceLatLongObject not present',

    //DataStore
    SUGGESTIONS: 'Suggestions',

    //SKU
    SELECT_ANY_REASON: 'Select any Reason',
    TOTAL_ORG_QTY_NOT_EQUAL_TOTAL_ACTUAL_QTY: 'Quantity should be less than max quantity.Cannot proceed.',
    QTY_NOT_ZERO: `Quantity can't be 0.Cannot proceed.`,
    TOTAL_ORG_QTY_EQUAL_TOTAL_ACTUAL_QTY: 'Quantity should be equal to max quantity.Cannot proceed.',
    QTY_ZERO: 'Quantity should be 0.Cannot proceed.',
    REASON: 'Reason',
    OPEN_CAMERA: 'Open Camera',

    //Array
    TOTAL_COUNT: 'Total Count : ',
    ADD: 'Add',
    ADD_ROW_ERROR: 'Row could not be added',
    DELETE_ROW_ERROR: 'Row could not be deleted',
    SAVE_ARRAY_ERROR: 'Array Could not be saved',
    ADD_TOAST: 'Please fill required fields first',
    INVALID_CONFIG_ERROR: 'Invalid Configuration,please contact manager',
    REMOVE: 'Remove',

    //Expandable Details View
    TAP_TO_HIDE: 'Tap to hide',
    TAP_TO_SHOW: 'Tap to show',
    N_A: 'N.A',

    //Job_DetailsV2
    UPDATE_GROUP: 'Update Group',
    YOU_ARE_NOT_AT_LOCATION_WANT_TO_CONTINUE: 'You are not at location. Do you want to continue?',
    MORE: 'More',


    //Save Activated
    EDIT: 'Edit',
    JOB_EXPIRED: 'Job Expired!',
    DETAILS: "Details",
    UPDATE_GROUP: 'Update Group',

    //JOb List
    SELECT_NUMBER: 'Select number for message',
    SELECT_TEMPLATE: 'Select template for message',
    SELECT_NUMBER_FOR_CALL: 'Select number for call',
    CALL_CONFIRM: 'Do you want to proceed with the call?',
    CONFIRMATION: 'Confirmation: ',
    SELECT_ADDRESS_NAVIGATION: 'Select address for navigation',

    //Cash Tendering
    SKIP_CASH_TENDERING: 'Skipping Cash Tendering',
    MORE_MONEY_TO_PAY: 'More Money to Pay.',
    LESS_MONEY_TO_PAY: 'Less Money to Pay.',
    AMOUNT_TO_COLLECT: 'Amount to Collect: ',
    AMOUNT_TO_RETURN: 'Amount to Return: ',
    TOTAL_AMOUNT: 'Total Amount: ',
    TOTAL_AMOUNT_RETURNING: 'Total Amount Returning: ',
    COLLECT_CASH: 'Collect Cash',
    RETURN_CASH: 'Return Cash',
    CASHTENDERINGLIST_NOT_SAVE_PROPERLY: 'CashTenderingList not set Properly',
    FORMELEMENT_OR_CURRENTELEMENT_NOT_FOUND: 'formElements or currentElement not found',
    TOTAL_AMOUNT_NOT_SET: 'totalAmount not set Properly',
    FIELD_ATTRIBUTE_NOT_SET: 'fieldAttributeMasterId not set Properly',

    //Fixed SKU
    QUANTITY_NOT_A_NUMBER: `Quantity can't be `,
    TOTAL_QUANTITY: 'Total Quantity : ',

    //Statistics
    STATISTICS: 'STATISTICS',

    //Live job
    LIVE_TASKS: 'Live Tasks',
    NO_JOBS_PRESENT: 'No jobs present',
    FILTER_REF_NO: 'Filter Reference Numbers',
    SELECT_ALL: 'SELECT ALL',
    ACCEPT: 'ACCEPT',
    REJECT: 'REJECT',

    //Bulk Listing 
    BULK_UPDATE: 'Bulk Update',
    SELECT_STATUS_FOR_BULK: 'Select Status you would like to Bulk Update',
    NEXT_POSSIBLE_STATUS: 'Next possible status',

    //Sorting
    SORTING: 'Sorting',
    REF_UNAVAILABLE: 'ReferenceNumber Unavailable',
    FAILURE_SORTING: 'Searching failed, Please try again !',
    SEARCH_INFO: 'Search/Scan QR code in the top bar to Start',

    //Save Activated
    Do_you_want_to_checkout: 'Do you want to checkout?',
    Discard_these_jobs: 'Discard these jobs?',

    //Profile
    CHECK_IF_PASSWORD_ENTERED: "Please Enter Password",
    CHECK_CURRENT_PASSWORD: "Current Password is wrong Please try again",
    MATCH_NEW_AND_CONFIRM_PASSWORD: "Confirm new password does not match with new password.",
    VALIDATE_PASSWORD: "Password should be minimum 8 characters long and should contain at least one number, one special character, one uppercase and one lowercase alphabet.",
    CURRENT_AND_NEW_PASSWORD_CHECK: "New password cannot be same as current password.",
    PASSWORD_RESET_SUCCESSFULLY: " Password reset successful. Use the new password next time you log-in..",
    UNSAVED_PASSWORD: 'Password not saved before',
    RESET_PASSWORD: 'Reset Password',
    CONTACT_NUMBER: 'Contact Number',
    EMAIL: 'Email',
    PROFILE: 'Profile',
    MINIMUM_REQUIREMENT_FOR_PASSWORD: 'Min. 8 characters required, including capital letter, symbol and number.',
    CURRENT_PASSWORD: 'Current Password',
    NEW_PASSWORD: 'New Password',
    CONFIRM_NEW_PASSWORD: 'Confirm New Password',
    USERNAME_IS_MISSING: 'Username is missing',

    //Error Message for NonExpandableDetailsView
    IMAGE_LOADING_ERROR: 'An error occurred while loading image',

    //Signature
    IMPROPER_SIGNATURE: 'Improper signature. Please make your full signature.',

    //Login
    CONFIRM_RESET: 'Confirm Reset',
    RESET_ACCOUNT_SETTINGS: 'Click OK to reset your account settings.',
    REMEMBER_ME: 'Remember Me',

    //Preloader
    SETTING_UP: 'Setting you up...',
    DOWNLOAD_SETTINGS: 'Downloading settings',
    APPLYING_SETTINGS: 'Applying settings',
    VERIFY_HANDSET: 'Verifying handset',
    VERIFY_MOBILE: 'Verify your mobile',
    OTP_CODE_SENT: 'OTP code hasbeen sent to',
    ENTER_MOBILE: 'Enter your mobile',
    SEND_OTP: 'Send OTP',

    //Data Store
    SEARCH: 'Search',
}