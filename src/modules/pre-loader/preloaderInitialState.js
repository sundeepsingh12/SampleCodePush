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
  isOtpVerificationButtonDisabled:true,
  isGenerateOtpButtonDisabled:true,
  otpNumber:'',
  mobileDisplayMessage:'', //message which will be displayed in mobile no screen
  otpDisplayMessage:'' //message which will be displayed in otp screen

})

export default InitialState
