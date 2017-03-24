'use strict'
const { TABLE_USER_SUMMARY } = require('../../lib/constants').default
import Realm from 'realm';

export default class UserSummary extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
UserSummary. schema = {
  name: TABLE_USER_SUMMARY,
  primaryKey: 'id',
  properties: {
    activeTimeInMillis: {type: 'int', default: 0},
    appVersion: {type: 'string', default: ''},
    avgSpeed: {type: 'double', default: 0},
    cashCollected: {type: 'double', default: 0},
    cashCollectedByCard: {type: 'double', default: 0},
    cashPayment: {type: 'double', default: 0},
    cityId: {type: 'int', default: 0},
    companyId: {type: 'int', default: 0},
    cugCallIncomingCount: {type: 'int', default: 0},
    cugCallIncomingDuration: {type: 'int', default: 0},
    cugCallOutgoingCount: {type: 'int', default: 0},
    cugCallOutgoingDuration: {type: 'int', default: 0},
    date: {type: 'string', default: ''},
    failCount: {type: 'int', default: 0},
    firstLat: {type: 'double', default: 0},
    firstLong: {type: 'double', default: 0},
    gpsKms: {type: 'double', default: 0},
    haltDuration: {type: 'double', default: 0},
    hubId: {type: 'int', default: 0},
    id : {type: 'int'},
    imeiNumber: {type: 'string', default: ''},
    lastBattery: {type: 'int', default: 0},
    lastCashCollected: {type: 'double', default: 0},
    lastLat: {type: 'double', default: 0},
    lastLng: {type: 'double', default: 0},
    lastLocationDatetime: {type: 'string', default: ''},
    lastLogoutTime: {type: 'string', default: ''},
    lastOrderNumber: {type: 'string', default: ''},
    lastOrderTime: {type: 'string', default: ''},
    lastSpeed: {type: 'double', default: 0},
    maxSpeed: {type: 'double', default: 0},
    odometerKms: {type: 'double', default: 0},
    officialCallIncomingCount: {type: 'int', default: 0},
    officialCallIncomingDuration: {type: 'int', default: 0},
    officialCallOutgoingCount: {type: 'int', default: 0},
    officialCallOutgoingDuration: {type: 'int', default: 0},
    officialSmsSentCount: {type: 'int', default: 0},
    pendingCount: {type: 'int', default: 0},
    personalCallIncomingCount: {type: 'int', default: 0},
    personalCallIncomingDuration: {type: 'int', default: 0},
    personalCallOutgoingCount: {type: 'int', default: 0},
    personalCallOutgoingDuration: {type: 'int', default: 0},
    personalSmsSentCount: {type: 'int', default: 0},
    successCount: {type: 'int', default: 0},
    travelDuration: {type: 'double', default: 0},
    userId: {type: 'int', default: 0},
  }
}
