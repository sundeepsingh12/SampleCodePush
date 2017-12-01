'use strict'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import {

} from '../../lib/AttributeConstants'
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
class LiveJobService {
    async getLiveJobList() {
        const jobTransactionCustomizationListParametersDTO = await transactionCustomizationService.getJobListingParameters()
        const jobTransactionCustomizationList = await jobTransactionService.getAllJobTransactionsCustomizationList(jobTransactionCustomizationListParametersDTO, 'LiveJob', null)
        const idJobTransactionCustomizationListMap = _.mapKeys(jobTransactionCustomizationList, 'id')
        const liveJobsWithValidTime = await this.checkJobExpiry(idJobTransactionCustomizationListMap)
        return liveJobsWithValidTime
    }
    checkJobExpiry(liveJobMap) {
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
            return this.deleteJob(expiredJobIds, liveJobMap)
        } else {
            return liveJobMap
        }
    }
    async requestServerForApproval(status, token, job, liveJobList) {
        let postJson = "{\"jobId\":\"" + job.id + "\", \"jobDate\":\"" + job.jobStartTime + "\", \"statusId\":\"" + status + "\"}"
        try {
            let serviceAlertResponse = await RestAPIFactory(token.value).serviceCall(postJson, CONFIG.API.SERVICE_ALERT_JOB, 'POST')
            if (serviceAlertResponse) {
                let jobIdList = []
                jobIdList.push(job.id)
                let newLiveJobList = await this.deleteJob(jobIdList, liveJobList)
                return newLiveJobList
            }
        } catch (e) {
            return e.message
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
            let postJson = JSON.stringify(multipleJobsDTO)
            let serviceAlertResponse = await RestAPIFactory(token.value).serviceCall(postJson, CONFIG.API.SERVICE_ALERT_JOB_MULTIPLE, 'POST')
            if (serviceAlertResponse && serviceAlertResponse.status == 200) {
                console.log(serviceAlertResponse)
                let successCount = serviceAlertResponse.json.successCount
                let failCount = serviceAlertResponse.json.failCount
                let successJsonArray = serviceAlertResponse.json.successList
                let failureJsonArray = serviceAlertResponse.json.failureList
                let successJobList, failedJobList

                let newLiveJobList = await this.deleteJob(selectedItems, liveJobList)
                return newLiveJobList
            }
        } catch (e) {
            return e.message
        }
    }
}

export let liveJobService = new LiveJobService()
