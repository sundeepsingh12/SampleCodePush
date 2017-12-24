'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    addressList: [],
    customerCareList: [],
    fieldDataList: [],
    jobDetailsLoading: false,
    jobDataList: [],
    jobTransaction: null,
    messageList: [],
    currentStatus: null,
    smsTemplateList: [],
    errorMessage: false,
    statusList: null,
    draftStatusId: null,
})

export default InitialState