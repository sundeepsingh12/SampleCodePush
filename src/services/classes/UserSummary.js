import {
    USER_SUMMARY,
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
}

export let userSummaryService = new UserSummary()