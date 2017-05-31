'use strict'
const { TABLE_JOB} = require('../../lib/constants').default
import Realm from 'realm';

export default class Job extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
Job.schema = {
  name: TABLE_JOB,
  primaryKey: 'id',
  properties: {
      id: { type: 'int' },
      referenceNo: { type: 'string', default: '' },
      hubId: { type: 'int', default: 0 },
      cityId: { type: 'int', default: 0 },
      jobMasterId: { type: 'int', default: 0 },
      companyId: { type: 'int', default: 0 },
      missionId: { type: 'int', default: 0,optional:true},
      status: { type: 'int', default: 3 },
      latitude: { type: 'double', default: 0 },
      longitude: { type: 'double', default: 0 },
      slot: { type: 'int', default: 0 },
      merchantCode: { type: 'string',optional:true},
      jobStartTime: { type: 'string', default: '' },
      createdAt: { type: 'string', default: '' },
      attemptCount: { type: 'int', default: 1 },
      jobEndTime: { type: 'string',optional:true},
      currentProcessId: { type: 'int', default: 0,optional:true}
  }
}