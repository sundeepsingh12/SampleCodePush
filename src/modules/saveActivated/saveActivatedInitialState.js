'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    commonData: [],
    recurringData: {},
    isSignOffVisible: false,
    loading: false,
    headerTitle: '',
    inputTextToSendSms: '',
    errorToastMessage: '',
    inputTextEmailIds: '',
    emailIdViewArray: [],
    companyCodeDhl: false,
    showDiscardAlert: false,
    isReturnToHome: false,
    draftStatusInfo: {},
    checkTransactionSaveActivated: null
})

export default InitialState