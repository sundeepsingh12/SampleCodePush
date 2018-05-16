'use strict'
/**
 * ## Import
 */
const {Record} = require('immutable')

import {
  SERVICE_PENDING,
  SERVICE_RUNNING,
  SERVICE_SUCCESS,
  SERVICE_FAILED
} from '../../lib/constants'


var InitialState = Record({
  configDownloadService: SERVICE_PENDING, //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  configSaveService: SERVICE_PENDING, //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  deviceVerificationService: SERVICE_PENDING, //Possible values => Constants.SERVICE_PENDING/ RUNNING/ SUCCESS/ FAILED
  isError: false,
  error: '',
  isErrorType_403_400_Logout: false,
  errorMessage_403_400_Logout: '',
  showMobileNumberScreen:false,
  showOtpScreen:false,
  mobileNumber:'',
  otpNumber:'',
  isPreloaderLogoutDisabled:false, //logout button which is displayed in preloader screen
  mobileOtpDisplayMessage: true, //message which will be displayed in mobile no screen
})

export default InitialState
