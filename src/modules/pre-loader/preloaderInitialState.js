'use strict'
/**
 * ## Import
 */
const {Record} = require('immutable')

const {
  SERVICE_PENDING,
  SERVICE_RUNNING,
  SERVICE_SUCCESS,
  SERVICE_FAILED
} = require('../../lib/constants').default


var InitialState = Record({
  configDownloadService: SERVICE_PENDING, //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  configSaveService: SERVICE_PENDING, //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  deviceVerificationService: SERVICE_PENDING, //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  isError: false,
  error: '',
  isComplete: false,
  showMobileNumberScreen:false,
  showOtpScreen:false,
  mobileNumber:'',
  disableButton:false
})

export default InitialState
