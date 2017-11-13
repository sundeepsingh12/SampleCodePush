'use strict'
import { TABLE_JOB_DATA } from '../../lib/constants'
import Realm from 'realm';

export default class JobData extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
JobData.schema = {
  name: TABLE_JOB_DATA,
  properties: {
    id: 'int?',
    value: 'string?',
    jobId:  'int' ,
    positionId: 'int' ,
    parentId: 'int' ,
    jobAttributeMasterId:  'int' 
  }
}