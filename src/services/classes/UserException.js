import {
    USER_EXCEPTION_LOGS,
    USER,
} from '../../lib/constants'
import {
    keyValueDBService
} from './KeyValueDBService'
import moment from 'moment'
import package_json from '../../../package.json'
import * as realm from '../../repositories/realmdb'
import { Platform } from 'react-native'

class UserException {


    /**
     * 
     * @param {String} errorMessage // errormessage to add in userExceptionLogs DB. 
     * @param {Number} errorCode // code which represents action of a particular class in which error has occured.
     */
    async addUserExceptionLogs(errorMessage, errorCode) {
        const userDetails = await keyValueDBService.getValueFromStore(USER)
        let userId = (userDetails && userDetails.value && userDetails.value.id) ? userDetails.value.id : 0
        let hubId = (userDetails && userDetails.value && userDetails.value.hubId) ? userDetails.value.hubId : 0
        let cityId = (userDetails && userDetails.value && userDetails.value.cityId) ? userDetails.value.cityId : 0
        let companyId = (userDetails && userDetails.value && userDetails.value.company && userDetails.value.company.id) ? userDetails.value.company.id : 0
        let userExceptionLogObject = {
            'id': 0,
            userId,
            'dateTime': moment().format('YYYY-MM-DD HH:mm:ss'),
            'stacktrace': errorMessage,
            'packageVersion': package_json.version,
            'packageName': (Platform.OS === 'ios') ? 'ios' : 'android',
            hubId,
            cityId,
            companyId,
        }
        realm.save(USER_EXCEPTION_LOGS, userExceptionLogObject)
    }

    /**
     * @param {*} lastSyncTime --Latest time when the sync is done.
     */
    async getUserExceptionLog(userExceptionLogs, lastSyncTime) {
        let userExceptionLogToBeSynced = []
        userExceptionLogs.forEach(userExceptionLog => {
            if (moment(userExceptionLog.dateTime).isAfter(lastSyncTime.value)) {
                userExceptionLogToBeSynced.push(userExceptionLog)
            }
        })
        return userExceptionLogToBeSynced
    }
}

export let userExceptionLogsService = new UserException()