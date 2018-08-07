import {
    USER_SUMMARY,
} from '../../lib/constants'

import {
    keyValueDBService
} from './KeyValueDBService'
import { geoFencingService } from './GeoFencingService'
import _ from 'lodash'
import moment from 'moment'

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
            if (!_.isNull(lastLatitude)) {
                let distanceTravelled = geoFencingService.distance(lastLatitude, lastLongitude, currentLatitude, currentLongitude)
                totalDistanceTravelled = (distanceTravelled *1000) + gpsKms
            }
            userSummary.value.lastLat = currentLatitude
            userSummary.value.lastLng = currentLongitude
            userSummary.value.gpsKms = totalDistanceTravelled
            userSummary.value.lastLocationDatetime = moment().format('YYYY-MM-DD HH:mm:ss')
            await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)
        } catch (error) {
        }
    }

    async updateUserSummaryCount(allCount){
        let userSummary = await keyValueDBService.getValueFromStore(USER_SUMMARY)
        if(userSummary && userSummary.value){
            userSummary.value.pendingCount = allCount[0], userSummary.value.failCount = allCount[1], userSummary.value.successCount = allCount[2]
        }
        await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)  
    }
}

export let userSummaryService = new UserSummary()