'use strict'

class SMSTemplate {

    /**
     * 
     * @param {*} smsTemplateList 
     * @returns
     * SmsTemplateMap : {
     *                      JobMasterId : [SMSTemplate]
     *                   }
     */
    getSMSTemplateMap(smsTemplateList) {
        let smsTemplateMap = {}
        smsTemplateList = smsTemplateList ? smsTemplateList : []
        smsTemplateList.forEach(smsTemplate => {
            smsTemplateMap[smsTemplate.jobMasterId] = smsTemplateMap[smsTemplate.jobMasterId] ? smsTemplateMap[smsTemplate.jobMasterId] : []
            smsTemplateMap[smsTemplate.jobMasterId].push(smsTemplate)
        })

        return smsTemplateMap
    }
}

export let smsTemplateService = new SMSTemplate()