'use strict'

import { keyValueDBService } from './KeyValueDBService'
import {
    CUSTOMER_CARE,
    CUSTOMIZATION_LIST_MAP,
    JOB_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    JOB_MASTER, JOB_STATUS,
    SMS_TEMPLATE, TAB, USER,
    LAST_SYNC_WITH_SERVER,
    FIELD_ATTRIBUTE,
    SMS_JOB_STATUS,
    IS_SERVER_REACHABLE,
    USER_SUMMARY,
    JOB_SUMMARY,
    HUB,
    DEVICE_IMEI,
    USER_EVENT_LOG,
    PENDING_SYNC_TRANSACTION_IDS,
    CUSTOM_NAMING,
    PAGES,
    FIELD_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_VALIDATION,
    FIELD_ATTRIBUTE_VALIDATION_CONDITION,
    DEVICE_SIM,
    UPDATE_JOBMASTERID_JOBID_MAP
} from '../../lib/constants'
import { jobTransactionService } from './JobTransaction'
import { draftService } from './DraftService'
import _ from 'lodash'

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


    async fetchUpdatedTransactionList(jobIdMap, jobTransactionCustomizationList) {
        const jobTransactionCustomizationListParametersDTO = await this.getJobListingParameters();
        let queryDTO = {}, jobIdList = {}, transactionForDeletingDraft = [], jobTransactionQuery = '';
        let firstindex = true;
        for(let jobMasterId in jobIdMap){
            for(let jobId in jobIdMap[jobMasterId]){
                if(firstindex) {
                    jobTransactionQuery = jobTransactionQuery + 'jobId = ' + jobId;
                    firstindex = false;
                } else {
                    jobTransactionQuery = jobTransactionQuery + ' OR jobId = ' + jobId 
                }
                jobIdList[jobId] = jobIdMap[jobMasterId][jobId]
            }
        }
        queryDTO.jobTransactionQuery = _.size(jobTransactionQuery) ?  jobTransactionQuery : null
        console.logs("queryDTO.jobTransactionQuery",jobIdList,queryDTO.jobTransactionQuery)
        let jobTransactionList = jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, queryDTO);
        await keyValueDBService.deleteValueFromStore(UPDATE_JOBMASTERID_JOBID_MAP)
        for (let jobId in jobIdList) {
            if (jobTransactionList[jobIdList[jobId].jobMasterId] && !jobTransactionList[jobIdList[jobId].jobMasterId][jobId] && jobTransactionCustomizationList[jobIdList[jobId].jobMasterId] && jobTransactionCustomizationList[jobIdList[jobId].jobMasterId][jobId]) {
                delete jobTransactionCustomizationList[jobIdList[jobId].jobMasterId][jobId]
            } else if(jobTransactionList[jobIdList[jobId].jobMasterId] && jobTransactionList[jobIdList[jobId].jobMasterId][jobId]){
                jobTransactionCustomizationList[jobIdList[jobId].jobMasterId] = jobTransactionCustomizationList[jobIdList[jobId].jobMasterId] ? jobTransactionCustomizationList[jobIdList[jobId].jobMasterId] : {}
                jobTransactionCustomizationList[jobIdList[jobId].jobMasterId][jobId] = jobTransactionList[jobIdList[jobId].jobMasterId][jobId]
                transactionForDeletingDraft.push({jobTransactionId : jobTransactionCustomizationList[jobIdList[jobId].jobMasterId][jobId].id})
            }
        }
        if(transactionForDeletingDraft && transactionForDeletingDraft.length){
            draftService.deleteDraftFromDb(transactionForDeletingDraft)
        }
        return _.isEmpty(jobIdMap) ? jobTransactionList : jobTransactionCustomizationList
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
        const deviceSim = await keyValueDBService.getValueFromStore(DEVICE_SIM);
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
            pageList: pageList ? pageList.value : pageList,
            deviceSim: deviceSim && deviceSim.value ? deviceSim.value : deviceSim
        }
    }

    async getFormLayoutParameters() {
        const fieldAttributes = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE);
        const jobAttributes = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
        const user = await keyValueDBService.getValueFromStore(USER)
        const hub = await keyValueDBService.getValueFromStore(HUB)
        const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS);
        const fieldAttributeMasterValidation = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALIDATION);
        const fieldAttributeValidationCondition = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALIDATION_CONDITION);
        return {
            fieldAttributes: fieldAttributes ? fieldAttributes.value : fieldAttributes,
            jobAttributes: jobAttributes ? jobAttributes.value : jobAttributes,
            user: user ? user.value : user,
            hub: hub ? hub.value : hub,
            fieldAttributeStatusList: fieldAttributeStatusList ? fieldAttributeStatusList.value : [],
            fieldAttributeMasterValidation: fieldAttributeMasterValidation ? fieldAttributeMasterValidation.value : fieldAttributeMasterValidation,
            fieldAttributeValidationCondition: fieldAttributeValidationCondition ? fieldAttributeValidationCondition.value : fieldAttributeValidationCondition
        }
    }
}

export let transactionCustomizationService = new TransactionCustomization()