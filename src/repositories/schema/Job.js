'use strict'
import { TABLE_JOB } from '../../lib/constants'
import Realm from 'realm';

export default class Job extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
Job.schema = {
  name: TABLE_JOB,
  primaryKey: 'id',
  properties: {
    id: 'int',
    referenceNo: 'string',
    hubId: 'int',
    cityId: 'int',
    jobMasterId: 'int',
    companyId: 'int',
    missionId: { type: 'int', default: 0, optional: true },
    status: 'int',
    latitude: { type: 'double', default: 0,optional:true },
    longitude: { type: 'double', default: 0,optional:true },
    slot: { type: 'int', default: 0, optional: true },
    merchantCode: 'string?',
    jobStartTime: { type: 'string', default: '' },
    createdAt: { type: 'string', default: '' },
    attemptCount: { type: 'int', default: 1 },
    jobEndTime: 'string?',
    currentProcessId: { type: 'int', default: 0, optional: true },
    groupId: { type: 'string', default: null, optional: true },
    jobPriority: { type: 'int', default: 0, optional: true },
  }
}