'use strict'

import { Record } from 'immutable'

var InitialState = Record({
    jobDetailsLoading: false,
    jobDataList: [],
    fieldDataList: [],
    messageList: [],
    nextStatusList: [],
    contactList: [],
    addressList: [],
    customerCareList: [],
    smsTemplateList: [],
})

export default InitialState