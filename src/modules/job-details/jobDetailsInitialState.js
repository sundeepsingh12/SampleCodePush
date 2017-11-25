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
    isEnableOutForDelivery: true,
    statusList: null,
})

export default InitialState