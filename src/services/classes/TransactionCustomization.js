'use strict'

import { keyValueDBService } from './KeyValueDBService'
import {
    CUSTOMER_CARE,
    CUSTOMIZATION_LIST_MAP,
    JOB_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    JOB_MASTER,
    JOB_STATUS,
    SMS_TEMPLATE,
} from '../../lib/constants'

class TransactionCustomization {

    /** This function fetch different values from store
     * @returns 
     * {
     *      customerCareList
     *      jobAttributeMasterList
     *      jobAttributeStatusList
     *      jobMasterList
     *      jobMasterIdCustomizationMap
     *      smsTemplateList
     *      statusList
     * }
     */
    async getJobListingParameters() {
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
        const jobMasterIdCustomizationMap = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
        const jobAttributeMasterList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
        const customerCareList = await keyValueDBService.getValueFromStore(CUSTOMER_CARE)
        const smsTemplateList = await keyValueDBService.getValueFromStore(SMS_TEMPLATE)
        const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER)
        return {
            customerCareList: customerCareList.value,
            jobAttributeMasterList: jobAttributeMasterList.value,
            jobAttributeStatusList: jobAttributeStatusList.value,
            jobMasterList: jobMasterList.value,
            jobMasterIdCustomizationMap: jobMasterIdCustomizationMap.value,
            smsTemplateList: smsTemplateList.value,
            statusList: statusList.value
        }
    }
}

export let transactionCustomizationService = new TransactionCustomization()