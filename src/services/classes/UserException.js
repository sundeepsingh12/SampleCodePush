import {
    USER_EXCEPTION_LOGS,
    USER,
} from '../../lib/constants'
import {
    keyValueDBService
} from './KeyValueDBService'
import moment from 'moment'
var package_json = require('../../../package.json')

class UserException {

    /**
     * 
     * @param {String} errorMessage // errormessage to add in userExceptionLogs DB. 
     * @param {Number} errorCode // code which represents action of a particular class in which error has occured.
     */
    async addUserExceptionLogs(errorMessage, errorCode) {
        if (errorMessage && errorCode) {
            errorMessage = "errorCode: " + errorCode + ", error: " + errorMessage
        }
        let userDetails = await keyValueDBService.getValueFromStore(USER)
        let userId = (userDetails && userDetails.value && userDetails.value.id) ? userDetails.value.id : 0
        let hubId = (userDetails && userDetails.value && userDetails.value.hubId) ? userDetails.value.hubId : 0
        let cityId = (userDetails && userDetails.value && userDetails.value.cityId) ? userDetails.value.cityId : 0
        let companyId = (userDetails && userDetails.value && userDetails.value.company && userDetails.value.company.id) ? userDetails.value.company.id : 0
        let userExceptionLogObject = {
            id: 0,
            userId,
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            stacktrace: errorMessage,
            packageVersion: package_json.version,
            packageName: 'N.A',
            hubId,
            cityId,
            companyId,
        }
        let oldUserExceptionLogArray = await keyValueDBService.getValueFromStore(USER_EXCEPTION_LOGS)
        let userExceptionLogArray = oldUserExceptionLogArray ? oldUserExceptionLogArray.value : []
        userExceptionLogArray.push(userExceptionLogObject)          // Adding new exceptionLog in existing DB.
        await keyValueDBService.validateAndSaveData(USER_EXCEPTION_LOGS, userExceptionLogArray)
    }

    /**
     * @param {*} lastSyncTime --Latest time when the sync is done.
     */
    async getUserExceptionLogs(lastSyncTime) {
        const userExceptionLogs = await keyValueDBService.getValueFromStore(USER_EXCEPTION_LOGS);
        const userExceptionLogsValues = userExceptionLogs ? userExceptionLogs.value : []
        let userExceptionLogsToBeSynced = []
        userExceptionLogsValues.forEach(exceptionLog => { // fetching only those exceptionLogs which are saved after lastSyncTime.
            if (moment(exceptionLog.dateTime).isAfter(lastSyncTime.value)) {
                userExceptionLogsToBeSynced.push(exceptionLog)
            }
        })
        return userExceptionLogsToBeSynced
    }
}

export let userExceptionLogsService = new UserException()