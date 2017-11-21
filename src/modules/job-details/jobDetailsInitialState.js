'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    addressList: [],
    contactList: [],
    customerCareList: [],
    fieldDataList: [],
    jobDetailsLoading: false,
    jobDataList: [],
    jobTransaction : null,
    messageList: [],
    currentStatus: null,
    smsTemplateList: [],
    statusList: null,
})

export default InitialState