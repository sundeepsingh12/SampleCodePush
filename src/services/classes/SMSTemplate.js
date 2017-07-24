'use strict'

class SMSTemplate {

    getSMSTemplateMap(smsTemplateList) {
        let smsTemplateMap = {}
        smsTemplateList.forEach(smsTemplate => {
            if(!smsTemplateMap[smsTemplate.jobMasterId]) {
                smsTemplateMap[smsTemplate.jobMasterId] = []
            }
            smsTemplateMap[smsTemplate.jobMasterId].push(smsTemplate)
        })

        return smsTemplateMap
    }
}

export let smsTemplateService = new SMSTemplate()