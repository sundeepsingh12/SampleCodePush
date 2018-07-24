'use strict'
import { TABLE_JOB, TABLE_JOB_DATA } from '../../lib/constants'
import { jobTransactionService } from './JobTransaction'
import { transactionCustomizationService } from './TransactionCustomization'
import * as realm from '../../repositories/realmdb'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import moment from 'moment'
import _ from 'lodash'
import { jobService } from './Job';
import { jobDataService } from './JobData';
class LiveJobService {

    async getLiveJobList() {
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        let jobTransactionCustomizationList = this.getLiveJobAndJobDataList(jobTransactionCustomizationListParametersDTO)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList, 'id')
        const liveJobsWithValidTime = this.checkJobExpiry(idJobTransactionCustomizationListMap)
        return liveJobsWithValidTime
    }

    getLiveJobAndJobDataList(jobTransactionCustomizationListParametersDTO) {
        let jobTransactionCustomizationListParametersMaps = jobTransactionService.prepareMapsForTransactionCustomizationList(jobTransactionCustomizationListParametersDTO);
        let jobQuery = 'status = 6';
        let jobsList = realm.getRecordListOnQuery(TABLE_JOB, jobQuery);
        let jobMapAndJobDataQuery = jobService.getJobMapAndJobDataQuery(jobsList);
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobMapAndJobDataQuery.jobDataQuery);
        let jobDataDetailsForListing = jobDataService.getJobDataDetailsForListing(jobDataList, jobTransactionCustomizationListParametersMaps.jobAttributeMasterMap);
        let jobTransactionDTO = { jobTransactionMap: jobMapAndJobDataQuery.jobMap, jobMap: jobMapAndJobDataQuery.jobMap, jobDataDetailsForListing, fieldDataMap: {} }
        let jobTransactionCustomizationList = jobTransactionService.prepareJobCustomizationList(jobTransactionDTO, jobTransactionCustomizationListParametersDTO.jobMasterIdCustomizationMap, jobTransactionCustomizationListParametersMaps, {})
        return jobTransactionCustomizationList
    }

    checkJobExpiry(liveJobMap) {
        if (!liveJobMap || _.isEmpty(liveJobMap)) {
            return {}
        }
        let expiredJobIds = []
        for (let index in liveJobMap) {
            let jobEndTime = moment(liveJobMap[index].jobEndTime, 'HH:mm:ss')
            if (moment(jobEndTime).diff(moment()) <= 0) {
                expiredJobIds.push(liveJobMap[index].id)
            }
        }
        if (expiredJobIds.length > 0) {
            return this.deleteJob(expiredJobIds, liveJobMap)
        } else {
            return liveJobMap
        }
    }

    checkJobExpiryForReloading(liveJobMap){
        if (!liveJobMap || _.isEmpty(liveJobMap)) {
            return {}
        }
        for (let index in liveJobMap) {
            let jobEndTime = moment(liveJobMap[index].jobEndTime, 'HH:mm:ss')
            if (moment(jobEndTime).diff(moment()) <= 0) {
                delete liveJobMap[index]
            }
        }
        return liveJobMap
    }

    async requestServerForApproval(status, token, job, liveJobList) {
        let postJson = "{\"jobId\":\"" + job.id + "\",\"jobDate\":\"" + job.jobStartTime + "\",\"statusId\":\"" + status + "\"}"
        let toastMessage = '', newLiveJobList
        let serviceAlertResponse = await RestAPIFactory(token.value).serviceCall(postJson, CONFIG.API.SERVICE_ALERT_JOB, 'POST')
        let jobIdList = []
        jobIdList.push(job.id)
        newLiveJobList = this.deleteJob(jobIdList, liveJobList)
        let statusMessage = serviceAlertResponse._bodyText
        if (statusMessage == 'success') {
            toastMessage = 'Your request has been accepted'
        } else if (statusMessage == 'failed' && status == '1') {
            toastMessage = 'Your request has been rejected'
        } else if (statusMessage == 'failed' && status == '2') {
            toastMessage = 'You rejected the job'
        }
        return { newLiveJobList, toastMessage }
    }
    getSelectedJobIds(jobs) {
        const selectedTransactionIds = _.filter(jobs, job => job.isChecked == true).map(job => job.id)
        return selectedTransactionIds
    }

    deleteJob(jobIdList, liveJobList) {
        const jobDatas = {
            tableName: TABLE_JOB_DATA,
            valueList: jobIdList,
            propertyName: 'jobId'
        }
        const jobs = {
            tableName: TABLE_JOB,
            valueList: jobIdList,
            propertyName: 'id'
        }
        realm.deleteRecordsInBatch(jobDatas, jobs)
        let newLiveJobList = JSON.parse(JSON.stringify(liveJobList))
        for (let id of jobIdList) {
            delete newLiveJobList[id]
        }
        return newLiveJobList
    }
    async requestServerForApprovalForMultiple(status, selectedItems, liveJobList, token) {
        let multipleJobsDTO = []
        for (let selectedItem of selectedItems) {
            const { id, jobStartTime } = liveJobList[selectedItem]
            multipleJobsDTO.push({ jobId: id, jobDate: jobStartTime, statusId: status })
        }
        let toastMessage = '', newLiveJobList
        let postJson = JSON.stringify(multipleJobsDTO)
        let serviceAlertResponse = await RestAPIFactory(token.value).serviceCall(postJson, CONFIG.API.SERVICE_ALERT_JOB_MULTIPLE, 'POST')
        let successCount = serviceAlertResponse.json.successCount
        let failCount = serviceAlertResponse.json.failCount
        if (selectedItems.length == successCount && status == '1') {
            toastMessage = 'All your jobs are accepted'
        } else if (selectedItems.length == failCount && status == '2') {
            toastMessage = 'All your jobs are rejected'
        } else {
            toastMessage = successCount + ' jobs were accepted and ' + failCount + ' jobs were rejected.'
        }
        newLiveJobList = this.deleteJob(selectedItems, liveJobList)
        return { newLiveJobList, toastMessage }
    }
}

export let liveJobService = new LiveJobService()
