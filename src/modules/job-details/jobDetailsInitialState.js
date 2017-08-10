'use strict'

import { Record } from 'immutable'

var InitialState = Record({
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