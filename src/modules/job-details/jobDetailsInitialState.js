'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    fieldDataList: [],
    jobDetailsLoading: false,
    jobDataList: [],
    jobTransaction: null,
    messageList: [],
    currentStatus: null,
    errorMessage: false,
    statusList: null,
    statusRevertList: [],
    draftStatusInfo: {},
    isEtaTimerShow: false,
    isShowDropdown: null,
    jobExpiryTime: null,
    syncLoading: false,
    checkTransactionStatus: null
})

export default InitialState