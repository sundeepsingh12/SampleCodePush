'use strict'
const { TABLE_RUNSHEET} = require('../../lib/constants').default
import Realm from 'realm';

export default class Runsheet extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
Runsheet.schema = {
  name: TABLE_RUNSHEET,
  primaryKey: 'id',
  properties: {
      id: { type: 'int' },
      runsheetNumber:{type:'string'},
      endDate:{type:'string'},
      startDate:{type:'string'},
      userId:{type:'int'},
      hubId : {type:'int'},
      cityId: { type: 'int' },
      companyId: { type: 'int' },
      cashCollected: { type: 'double' },
      cashPayment: { type: 'double' },
      isClosed: { type: 'bool' },
      closedDateTime: { type: 'string', optional: true },
      closedByManagerId: { type: 'int', optional: true },
      closedByManagerSign: { type: 'string', optional: true },
      pendingCount: { type: 'int' },
      successCount: { type: 'int' },
      failCount: { type: 'int' },
      cashCollectedByCard: { type: 'double' }
  }
}