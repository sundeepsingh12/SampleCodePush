import {
    USER_SUMMARY,
    UNSEEN
} from '../../lib/constants'

import {
    keyValueDBService
} from './KeyValueDBService'
import { geoFencingService } from './GeoFencingService'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import { showToastAndAddUserExceptionLog } from '../../modules/global/globalActions'
let imei = require('../../wrapper/IMEI')
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { PENDING, APP_VERSION_NUMBER } from '../../lib/AttributeConstants'
import { jobTransactionService } from './JobTransaction'

class UserSummary {

    /**
     * @param {*} currentLatitude --current Latitude of user
     * @param {*} currentLongitude --current longitude of user
     */
    async _updateUserSummary(currentLatitude, currentLongitude) {
        try {
            let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
            let lastLatitude = userSummary.value.lastLat
            let lastLongitude = userSummary.value.lastLng
            let gpsKms = userSummary.value.gpsKms
            let totalDistanceTravelled = 0
            if (!isEmpty(lastLatitude)) {
                let distanceTravelled = geoFencingService.distance(lastLatitude, lastLongitude, currentLatitude, currentLongitude)
                totalDistanceTravelled = (distanceTravelled *1000) + gpsKms
            }
            else{
                userSummary.value.firstLat = currentLatitude
            }

            if(isEmpty(lastLongitude)){
                userSummary.value.firstLong = currentLongitude
            }
            userSummary.value.lastLat = currentLatitude
            userSummary.value.lastLng = currentLongitude
            userSummary.value.gpsKms = totalDistanceTravelled
            userSummary.value.lastLocationDatetime = moment().format('YYYY-MM-DD HH:mm:ss')
            await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)
        } catch (error) {
            showToastAndAddUserExceptionLog(9001, error.message, 'danger', 0)
        }
    }

    async updateUserSummaryCount(allCount){
        let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
        if(userSummary && userSummary.value){
            userSummary.value.pendingCount = allCount[0], userSummary.value.failCount = allCount[1], userSummary.value.successCount = allCount[2]
        }
        await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)  
    }

    //Do not set imei no in sync as getting imei no in android is a bridge call which is expensive operation
    async setUserSummaryImeiNo(userSummary){
        let imeiNumber
        if (Platform.OS === 'ios') {
            imeiNumber = DeviceInfo.getUniqueID()
          } else {
            imeiNumber = await imei.getIMEI()
          }
          userSummary.imeiNumber = imeiNumber
          return userSummary
    }

    updateUserSummary(syncStoreDTO) {
        const {statusList, jobMasterList, userSummary, user, lastSyncWithServer} = syncStoreDTO
        if (!userSummary) {
            throw new Error('User Summary missing in store');
        }
        const pendingStatusList = statusList ? statusList.filter(jobStatus => jobStatus.statusCategory == PENDING && jobStatus.code != UNSEEN) : null;
        const jobMasterListWithEnableResequence = jobMasterList ? jobMasterList.filter(jobMaster => jobMaster.enableResequenceRestriction == true) : null;
        const firstEnableSequenceTransaction = (jobMasterListWithEnableResequence && pendingStatusList) ? jobTransactionService.getFirstTransactionWithEnableSequence(jobMasterListWithEnableResequence, pendingStatusList) : null;
        userSummary.nextJobTransactionId = firstEnableSequenceTransaction ? firstEnableSequenceTransaction.id : null;
        userSummary.appVersion = APP_VERSION_NUMBER
        userSummary.lastLocationDatetime = moment().format('YYYY-MM-DD HH:mm:ss')
        const activeTime = userSummary.activeTimeInMillis
        let currentTimeInMili = moment().format('x')
        if(_.isEmpty(activeTime) || activeTime == 0) {
            userSummary.activeTimeInMillis = this._calculateActiveTime(moment(user.lastLoginTime).format('x'), currentTimeInMili)
        } else {
            userSummary.activeTimeInMillis = activeTime + this._calculateActiveTime(moment(lastSyncWithServer).format('x'), currentTimeInMili);
        }
        console.log('activeTimeInMillisLOL', userSummary.activeTimeInMillis);
        return userSummary;
    }

    _calculateActiveTime(previousActiveTime, currentTimeInMili) {
        return (currentTimeInMili - previousActiveTime)
    }
}

export let userSummaryService = new UserSummary()