'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {
    TABLE_JOB,
    TABLE_JOB_DATA
} from '../../lib/constants'
import { jobTransactionService } from './JobTransaction'
import {
    transactionCustomizationService
} from './TransactionCustomization'
import * as realm from '../../repositories/realmdb'
import RestAPIFactory from '../../lib/RestAPIFactory'
import CONFIG from '../../lib/config'
import moment from 'moment'
import _ from 'lodash'
class LiveJobService {
    async getLiveJobList() {
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        const {jobTransactionCustomizationList} = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'LiveJob', null)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList, 'id')
        const liveJobsWithValidTime = await this.checkJobExpiry(idJobTransactionCustomizationListMap)
        return liveJobsWithValidTime
    }
    async checkJobExpiry(liveJobMap) {
        if (!liveJobMap || _.isEmpty(liveJobMap)) return {}
        let expiredJobIds = []
        let liveJobList = Object.values(liveJobMap)
        for (let job of liveJobList) {
            let jobEndTime = moment(job.jobEndTime, 'HH:mm:ss')
            let currentTime = moment()
            if (moment(jobEndTime).diff(moment(currentTime)) <= 0) {
                expiredJobIds.push(job.id)
            }
        }
        if (expiredJobIds.length > 0) {
            return await this.deleteJob(expiredJobIds, liveJobMap)
        } else {
            return liveJobMap
        }
    }
    async requestServerForApproval(status, token, job, liveJobList) {
        let postJson = "{\"jobId\":\"" + job.id + "\",\"jobDate\":\"" + job.jobStartTime + "\",\"statusId\":\"" + status + "\"}"
        try {
            let toastMessage = '', newLiveJobList
            let serviceAlertResponse = await RestAPIFactory(token.value).serviceCall(postJson, CONFIG.API.SERVICE_ALERT_JOB, 'POST')
            if (serviceAlertResponse && serviceAlertResponse.status == 200) {
                let jobIdList = []
                jobIdList.push(job.id)
                newLiveJobList = await this.deleteJob(jobIdList, liveJobList)
                let statusMessage = serviceAlertResponse._bodyText
                if (statusMessage == 'success') {
                    toastMessage = 'Your request has been accepted'
                } else if (statusMessage == 'failed' && status == '1') {
                    toastMessage = 'Your request has been rejected'
                } else if (statusMessage == 'failed' && status == '2') {
                    toastMessage = 'You rejected the job'
                }
            } else {
                toastMessage = 'Something went wrong,try again'
            }
            return { newLiveJobList, toastMessage }
        } catch (e) {
            return { newLiveJobList: [], toastMessage: e.message }
        }
    }
    getSelectedJobIds(jobs) {
        const selectedTransactionIds = _.filter(jobs, job => job.jobTransactionCustomization.isChecked == true).map(job => job.id)
        return selectedTransactionIds
    }
    async deleteJob(jobIdList, liveJobList) {
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
        await realm.deleteRecordsInBatch(jobDatas, jobs)
        let newLiveJobList = await JSON.parse(JSON.stringify(liveJobList))
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
        try {
            let toastMessage = '', newLiveJobList
            let postJson = JSON.stringify(multipleJobsDTO)
            let serviceAlertResponse = await RestAPIFactory(token.value).serviceCall(postJson, CONFIG.API.SERVICE_ALERT_JOB_MULTIPLE, 'POST')
            if (serviceAlertResponse && serviceAlertResponse.status == 200) {
                let successCount = serviceAlertResponse.json.successCount
                let failCount = serviceAlertResponse.json.failCount
                if (selectedItems.length == successCount && status == '1') {
                    toastMessage = 'All your jobs are accepted'
                } else if (selectedItems.length == failCount && status == '2') {
                    toastMessage = 'All your jobs are rejected'
                } else {
                    toastMessage = successCount + ' jobs were accepted and ' + failCount + ' jobs were rejected.'
                }
                newLiveJobList = await this.deleteJob(selectedItems, liveJobList)
                return { newLiveJobList, toastMessage }
            } else {
                toastMessage = 'Something went wrong,try again'
            }
            return { newLiveJobList, toastMessage }
        } catch (e) {
            return { newLiveJobList: [], toastMessage: e.message }
        }
    }
}

export let liveJobService = new LiveJobService()
