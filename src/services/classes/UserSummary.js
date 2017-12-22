import {
    USER_SUMMARY,
} from '../../lib/constants'

import {
    keyValueDBService
} from './KeyValueDBService'

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
                let distanceTravelled = this._calculateDistance(lastLatitude, lastLongitude, currentLatitude, currentLongitude)
                totalDistanceTravelled = distanceTravelled + gpsKms
            }
            userSummary.value.lastLat = currentLatitude,
            userSummary.value.lastLng = currentLongitude,
            userSummary.value.gpsKms = totalDistanceTravelled
            await keyValueDBService.validateAndSaveData(USER_SUMMARY, userSummary.value)
        } catch (error) {
            console.log("error_updateUserSummary", error)
        }
    }

    /**
     * @param {*} currentLatitude --current Latitude of user
     * @param {*} currentLongitude --current longitude of user
     * @param {*} lastLatitude --last longitude of user
     * @param {*} lastLongitude --last longitude of user
     */
    _calculateDistance(lastLatitude, lastLongitude, currentLatitude, currentLongitude) {
        let distance = Math.sin(this._toRadians(lastLatitude)) * Math.sin(this._toRadians(currentLatitude)) + Math.cos(this._toRadians(lastLatitude)) * Math.cos(this._toRadians(currentLatitude)) * Math.cos(this._toRadians(lastLongitude - currentLongitude))
        distance = Math.acos(distance) * 180.0 / Math.PI
        distance = distance * 60 * 1.1515 * 1.609344 * 1000
        return (distance)
    }

    /**
     * @param {*} angle --angle which is to be converted to radians.
     */
    _toRadians(angle) {
        return angle * (Math.PI / 180);
    }
}

export let userSummaryService = new UserSummary()