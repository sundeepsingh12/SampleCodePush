'use strict'
const { TABLE_JOB_DATA} = require('../../lib/constants').default
import Realm from 'realm';

export default class JobData extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
JobData.schema = {
  name: TABLE_JOB_DATA,
  properties: {
    id: { type: 'int' },
    value: { type: 'string',optional:true },
    jobId: { type: 'int' },
    positionId: { type: 'int' },
    parentId: { type: 'int' },
    jobAttributeMasterId: { type: 'int' }
  }
}