import { keyValueDBService } from './KeyValueDBService'
import moment from 'moment'
import {
    JOB_ATTRIBUTE_VALUE,
    TABLE_JOB_TRANSACTION,
    ALARM_JOB_TIMES,
    TABLE_JOB_DATA,
    JOB_STATUS,
    CUSTOMIZATION_LIST_MAP,
    TABLE_JOB,
    TABLE_FIELD_DATA,
    JOB_MASTER
} from '../../lib/constants'
import {
    COUNT_DOWN_TIMER,
} from '../../lib/AttributeConstants'
import _ from 'lodash'
import * as realm from '../../repositories/realmdb'
import { jobTransactionService } from './JobTransaction'
let scheduleAlarm = require('../../wrapper/ScheduleAlarm')
import { jobService } from './Job'
import { jobDataService } from './JobData'
import { fieldDataService } from './FieldData'

class CountDownTimerService {

    async checkForCountDownTimer(jobDataList, syncStoreDto) {
        let countDownTimerMasterIdMap = {}
        for (let jobAttribute of syncStoreDto.jobAttributesList) {
            if (jobAttribute.attributeTypeId == COUNT_DOWN_TIMER) {
                countDownTimerMasterIdMap[jobAttribute.id] = jobAttribute
            }
        }
        if (_.isEmpty(countDownTimerMasterIdMap)) {
            return
        }
        let jobAttributeValueList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_VALUE)
        if (_.isEmpty(jobAttributeValueList) || _.isEmpty(jobAttributeValueList.value)) {
            return
        }
        let jobAttributeMasterIdToJobAttributeValueList = _.groupBy(jobAttributeValueList.value, 'jobAttributeMasterId')
        for (let jobData of jobDataList) {
            if (countDownTimerMasterIdMap[jobData.jobAttributeMasterId] && jobAttributeMasterIdToJobAttributeValueList[jobData.jobAttributeMasterId]) {
                let snoozeInterval, alarmStartValue
                for (let jobAttributeValueMaster of jobAttributeMasterIdToJobAttributeValueList[jobData.jobAttributeMasterId]) {
                    if (jobAttributeValueMaster.code == 'snoozeInterval') {
                        snoozeInterval = jobAttributeValueMaster.name
                    }
                    if (jobAttributeValueMaster.code == 'ringAlarmBefore') {
                        alarmStartValue = jobAttributeValueMaster.name
                    }
                }
                let countDownTimerValue = realm._decryptData(jobData.value)
                if (moment().isAfter(countDownTimerValue)) {
                    continue;
                }
                await this.onCountDownTimerPresent(countDownTimerValue, jobData, alarmStartValue, snoozeInterval)
            }
        }

    }

    async onCountDownTimerPresent(countDownTimerValue, jobData, alarmStartValue, snoozeInterval) {
        if (!moment().isSame(countDownTimerValue, 'day')) {
            return
        }
        console.log('alarm is for same date')

        let alarmStartHour = parseInt(alarmStartValue / 3600)
        let alarmStartMinute = parseInt((alarmStartValue - alarmStartHour * 3600) / 60)
        let alarmTimeAddHours = moment(countDownTimerValue).subtract(alarmStartHour, 'hours')
        let alarmTime = moment(alarmTimeAddHours).subtract(alarmStartMinute, 'minutes')
        let alarmTimeInFormat = moment(alarmTime).format('YYYY-MM-DD HH:mm:ss')
        console.log('alarm time', alarmTimeInFormat)
        if (moment().isAfter(moment(alarmTimeInFormat))) {
            return
        }
        await this.scheduleAlarm(jobData, alarmTimeInFormat, snoozeInterval, countDownTimerValue)
    }
    async navigateToJobDetailsAndScheduleAlarm(intentData) {
        let jobData = realm.getRecordListOnQuery(TABLE_JOB_DATA, 'jobId = ' + intentData.jobId + ' AND jobAttributeMasterId = ' + intentData.jobAttributeMasterId)
        let countDownTimerValue = jobData[0].value
        if (moment().isAfter(countDownTimerValue)) {
            return;
        }
        let alarmTime = moment().format('YYYY-MM-DD HH:mm')
        let snoozeTime = moment(alarmTime).add(parseInt(intentData.snoozeValue), 'seconds')
        let snoozeAlarmTime = moment(snoozeTime).format('YYYY-MM-DD HH:mm:ss')
        const statusList = await keyValueDBService.getValueFromStore(JOB_STATUS)
        let jobTransactionDbObjcet = realm.getRecordListOnQuery(TABLE_JOB_TRANSACTION, 'jobId = ' + parseInt(intentData.jobId))
        let jobTransaction = { ...jobTransactionDbObjcet[0] }
        let statusIdToStatusMap = _.mapKeys(statusList.value, 'id')
        if (statusIdToStatusMap[jobTransaction.jobStatusId] && (!statusIdToStatusMap[jobTransaction.jobStatusId].nextStatusList || statusIdToStatusMap[jobTransaction.jobStatusId].nextStatusList.length == 0)) {
            return
        }
        let x = await this.getJobTransactionCustomizationObject(jobTransaction)
        await this.scheduleAlarm(jobData[0], snoozeAlarmTime, intentData.snoozeValue, countDownTimerValue, intentData.numberOfAlarms)
        return jobTransaction
    }

    async scheduleAlarm(jobData, alarmTimeInFormat, snoozeInterval, countDownTimerValue, numberOfAlarms) {
        let alarmJobIdAndTimes = await keyValueDBService.getValueFromStore(ALARM_JOB_TIMES)
        let storeObjectToSave = {}
        if (!alarmJobIdAndTimes || !alarmJobIdAndTimes.value) {
            storeObjectToSave = {
                numberOfAlarms: 1,
                alarmTimes: [alarmTimeInFormat]
            }
        } else {
            for (let index in alarmJobIdAndTimes.value.alarmTimes) {
                // console.log(moment(alarmJobIdAndTimes.value.alarmTimes[index]).format('HH:mm:ss'))
                // console.log(moment(alarmTimeInFormat).format('HH:mm:ss'))
                if (moment(alarmJobIdAndTimes.value.alarmTimes[index]).format('HH:mm:ss') == moment(alarmTimeInFormat).format('HH:mm:ss')) {
                    let tempAlarmTime = moment(alarmTimeInFormat).add(1, 'minutes')
                    alarmTimeInFormat = moment(tempAlarmTime).format('YYYY-MM-DD HH:mm:ss')
                    index = 0
                }
            }
            alarmJobIdAndTimes.value.alarmTimes.push(alarmTimeInFormat),
                storeObjectToSave = {
                    numberOfAlarms: (!numberOfAlarms) ? alarmJobIdAndTimes.value.numberOfAlarms + 1 : numberOfAlarms,
                    alarmTimes: alarmJobIdAndTimes.value.alarmTimes
                }
        }
        if (moment(alarmTimeInFormat).isBefore(moment(countDownTimerValue))) {
            scheduleAlarm.setAlarm(alarmTimeInFormat,
                jobData.jobId + '',
                snoozeInterval + '',
                numberOfAlarms ? numberOfAlarms : storeObjectToSave.numberOfAlarms,
                jobData.jobAttributeMasterId + '',
                () => {
                    console.log('success')
                },
                () => {
                    console.log('failure')
                });
            await keyValueDBService.validateAndSaveData(ALARM_JOB_TIMES, storeObjectToSave)
        }
    }

    async getJobTransactionCustomizationObject(jobTransaction) {
        const jobMasterIdCustomization = await keyValueDBService.getValueFromStore(CUSTOMIZATION_LIST_MAP)
        const jobMasters = await keyValueDBService.getValueFromStore(JOB_MASTER)
        let jobMasterIdCustomizationMap = jobMasterIdCustomization.value
        let jobTransactionObject = jobTransactionService.getJobTransactionMapAndQuery([jobTransaction]);
        let jobTransactionDTO = {}
        jobTransactionDTO.jobTransactionMap = jobTransactionObject.jobTransactionMap;
        jobTransactionObject.jobQuery = jobTransactionObject.jobQuery;
        let jobsList = realm.getRecordListOnQuery(TABLE_JOB, jobTransactionObject.jobQuery);
        let jobMapAndJobDataQuery = jobService.getJobMapAndJobDataQuery(jobsList);
        jobTransactionDTO.jobMap = jobMapAndJobDataQuery.jobMap;
        let jobDataList = realm.getRecordListOnQuery(TABLE_JOB_DATA, jobMapAndJobDataQuery.jobDataQuery);
        jobTransactionDTO.jobDataDetailsForListing = jobDataService.getJobDataDetailsForListing(jobDataList, {});
        let fieldDataList = realm.getRecordListOnQuery(TABLE_FIELD_DATA, jobTransactionObject.fieldDataQuery);
        jobTransactionDTO.fieldDataMap = fieldDataService.getFieldDataMap(fieldDataList, true);
        let singleTransactionDTO = { jobTransaction, job: jobTransactionDTO.jobMap[jobTransaction.jobId], jobData: jobTransactionDTO.jobDataDetailsForListing.jobDataMap[jobTransaction.jobId], fieldData: jobTransactionDTO.fieldDataMap[jobTransaction.id] };
        if (jobMasterIdCustomizationMap[jobTransaction.jobMasterId]) {
            jobTransaction.line1 = jobTransactionService.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobTransaction.jobMasterId][1], singleTransactionDTO);
            jobTransaction.line2 = jobTransactionService.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobTransaction.jobMasterId][2], singleTransactionDTO);
            jobTransaction.circleLine1 = jobTransactionService.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobTransaction.jobMasterId][3], singleTransactionDTO);
            jobTransaction.circleLine2 = jobTransactionService.setTransactionDisplayDetails(jobMasterIdCustomizationMap[jobTransaction.jobMasterId][4], singleTransactionDTO);
        } else {
            jobTransaction.line1 = jobTransaction.line2 = jobTransaction.circleLine1 = jobTransaction.circleLine2 = '';
        }
        let jobMaster = jobMasters.value.filter(jobMaster => jobMaster.id == jobTransaction.jobMasterId)[0]
        jobTransaction.jobMasterIdentifier = jobMaster.identifier
        jobTransaction.identifierColor = jobMaster.identifierColor;
    }
}

export let countDownTimerService = new CountDownTimerService()
