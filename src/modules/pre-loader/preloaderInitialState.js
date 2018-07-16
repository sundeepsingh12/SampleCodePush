'use strict'

const { Record } = require('immutable')

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
  error: '',
  errorMessage_403_400_Logout: '',
  showMobileOtpNumberScreen: false,
  mobileNumber: '',
  otpNumber: '',
  mobileOtpDisplayMessage: true, //message which will be displayed in mobile no screen
  downloadLatestAppMessage: null,
  downloadUrl: null,
  isAppUpdatedThroughCodePush: false,
  codePushUpdateStatus: '',
  iosDownloadScreen: null,
  longCodeSMSData: null
})

export default InitialState
