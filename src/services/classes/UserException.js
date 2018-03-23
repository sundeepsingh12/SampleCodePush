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
        const userDetails = await keyValueDBService.getValueFromStore(USER)
        if (!userDetails) {
            throw new Error("userDetails are missing")
        }
        let userExceptionLogObject = {
            id: 0,
            userId: userDetails.value.id,
            dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            stacktrace: errorMessage,
            packageVersion: package_json.version,
            packageName: 'N.A',
            hubId: userDetails.value.hubId,
            cityId: userDetails.value.cityId,
            companyId: userDetails.value.company.id,
        }
        let oldUserExceptionLogArray = await keyValueDBService.getValueFromStore(USER_EXCEPTION_LOGS)
        let userExceptionLogArray = oldUserExceptionLogArray ? oldUserExceptionLogArray.value : []
        userExceptionLogArray.push(userExceptionLogObject)          // Adding new exceptionLog in existing DB.
        await keyValueDBService.validateAndSaveData(USER_EXCEPTION_LOGS, userExceptionLogArray)
        let a = await keyValueDBService.getValueFromStore(USER_EXCEPTION_LOGS)
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