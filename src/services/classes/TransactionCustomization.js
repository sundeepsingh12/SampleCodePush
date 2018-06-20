'use strict'

import { keyValueDBService } from './KeyValueDBService'
import { CUSTOMER_CARE, CUSTOMIZATION_LIST_MAP, JOB_ATTRIBUTE, JOB_ATTRIBUTE_STATUS, JOB_MASTER, JOB_STATUS, SMS_TEMPLATE, TAB, USER, LAST_SYNC_WITH_SERVER, FIELD_ATTRIBUTE, SMS_JOB_STATUS, IS_SERVER_REACHABLE, USER_SUMMARY, JOB_SUMMARY, HUB, DEVICE_IMEI, USER_EVENT_LOG, PENDING_SYNC_TRANSACTION_IDS, CUSTOM_NAMING, PAGES } from '../../lib/constants'

class TransactionCustomization {

    /** This function fetch different values from store for job transaction listing
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
        const tabList = await keyValueDBService.getValueFromStore(TAB)
        const customNaming = await keyValueDBService.getValueFromStore(CUSTOM_NAMING)
        return {
            customerCareList: customerCareList ? customerCareList.value : customerCareList,
            jobAttributeMasterList: jobAttributeMasterList ? jobAttributeMasterList.value : jobAttributeMasterList,
            jobAttributeStatusList: jobAttributeStatusList ? jobAttributeStatusList.value : jobAttributeStatusList,
            jobMasterList: jobMasterList ? jobMasterList.value : jobMasterList,
            jobMasterIdCustomizationMap: jobMasterIdCustomizationMap ? jobMasterIdCustomizationMap.value : jobMasterIdCustomizationMap,
            smsTemplateList: smsTemplateList ? smsTemplateList.value : smsTemplateList,
            statusList: statusList ? statusList.value : statusList,
            tabList: tabList ? tabList.value : tabList,
            customNaming: customNaming ? customNaming.value : customNaming
        }
    }

    /**
     * This function fetch different values from store for upload and download data api
     * @returns
     * {
     *      user 
            jobMasterList
            statusList
            lastSyncWithServer
            jobAttributesList
            fieldAttributesList
            smsJobStatusList
            userSummary
            jobSummaryList
            serverReachable
            hub
            imei
     * }
     */
    async getSyncParamaters() {
        const user = await keyValueDBService.getValueFromStore(USER);
        const jobMasterList = await keyValueDBService.getValueFromStore(JOB_MASTER);
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS);
        const lastSyncWithServer = await keyValueDBService.getValueFromStore(LAST_SYNC_WITH_SERVER);
        const jobAttributesList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE);
        const fieldAttributesList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
        const smsJobStatusList = await keyValueDBService.getValueFromStore(SMS_JOB_STATUS);
        const userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY);
        const jobSummaryList = await keyValueDBService.getValueFromStore(JOB_SUMMARY);
        const serverReachable = await keyValueDBService.getValueFromStore(IS_SERVER_REACHABLE);
        const hub = await keyValueDBService.getValueFromStore(HUB);
        const imei = await keyValueDBService.getValueFromStore(DEVICE_IMEI);
        const userEventsLogsList = await keyValueDBService.getValueFromStore(USER_EVENT_LOG);
        const transactionIdToBeSynced = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
        const pageList = await keyValueDBService.getValueFromStore(PAGES);
        return {
            user: user ? user.value : user,
            jobMasterList: jobMasterList ? jobMasterList.value : jobMasterList,
            statusList: statusList ? statusList.value : statusList,
            lastSyncWithServer: lastSyncWithServer ? lastSyncWithServer.value : lastSyncWithServer,
            jobAttributesList: jobAttributesList ? jobAttributesList.value : jobAttributesList,
            fieldAttributesList: fieldAttributesList ? fieldAttributesList.value : fieldAttributesList,
            smsJobStatusList: smsJobStatusList ? smsJobStatusList.value : smsJobStatusList,
            userSummary: userSummary ? userSummary.value : userSummary,
            jobSummaryList: jobSummaryList ? jobSummaryList.value : jobSummaryList,
            serverReachable: serverReachable ? serverReachable.value : serverReachable,
            hub: hub ? hub.value : hub,
            imei: imei ? imei.value : imei,
            userEventsLogsList: userEventsLogsList ? userEventsLogsList.value : userEventsLogsList,
            transactionIdToBeSynced: transactionIdToBeSynced ? transactionIdToBeSynced.value : transactionIdToBeSynced,
            pageList: pageList ? pageList.value : pageList
        }
    }
}

export let transactionCustomizationService = new TransactionCustomization()