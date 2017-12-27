import {
    USER_SUMMARY,
} from '../../lib/constants'

import {
    keyValueDBService
} from './KeyValueDBService'
import { jobDetailsService } from './JobDetails'
import _ from 'lodash'

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
                let distanceTravelled = jobDetailsService.distance(lastLatitude, lastLongitude, currentLatitude, currentLongitude)
                totalDistanceTravelled = distanceTravelled*1000 + gpsKms
            }
            userSummary.value.lastLat = currentLatitude,
            userSummary.value.lastLng = currentLongitude,
            userSummary.value.gpsKms = totalDistanceTravelled
            await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)
        } catch (error) {
            console.log("error_updateUserSummary", error) // todo remove this
        }
    }
}

export let userSummaryService = new UserSummary()