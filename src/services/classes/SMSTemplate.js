'use strict'

class SMSTemplate {

    /**
     * 
     * @param {*} smsTemplateList 
     * @returns
     * Map <JobMasterId,[SMSTemplate]>
     */
    getSMSTemplateMap(smsTemplateList) {
        let smsTemplateMap = {}
        if (!smsTemplateList) {
            smsTemplateList = {}
        }
        smsTemplateList.forEach(smsTemplate => {
            if (!smsTemplateMap[smsTemplate.jobMasterId]) {
                smsTemplateMap[smsTemplate.jobMasterId] = []
            }
            smsTemplateMap[smsTemplate.jobMasterId].push(smsTemplate)
        })

        return smsTemplateMap
    }
}

export let smsTemplateService = new SMSTemplate()