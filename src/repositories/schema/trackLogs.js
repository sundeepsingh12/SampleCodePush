'use strict'
const { TABLE_TRACK_LOGS } = require('../../lib/constants').default
import Realm from 'realm';

export default class TrackLogs extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
TrackLogs.schema = {
  name: TABLE_TRACK_LOGS,
  properties: {
    battery: { type: 'double' },
    gpsSignal: { type: 'double' },
    latitude: { type: 'double' },
    longitude: { type: 'double' },
    speed: { type: 'double' },
    trackTime: { type: 'string' },
    userId: { type: 'int' }
  }
}