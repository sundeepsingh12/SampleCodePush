'use strict'
import { USER_EXCEPTION_LOGS } from '../../lib/constants'
import Realm from 'realm';

export default class userExceptionLogsDB extends Realm.Object { }

userExceptionLogsDB.schema = {
    name: USER_EXCEPTION_LOGS,
    properties: {
        id: 'int',
        userId: 'int',
        dateTime: 'string?',
        stacktrace: 'string?',
        packageVersion: 'string?',
        packageName: 'string?',
        hubId: 'int',
        cityId: 'int',
        companyId: 'int',
    }
}