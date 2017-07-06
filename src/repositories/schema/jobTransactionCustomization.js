'use strict'
const { TABLE_JOB_TRANSACTION_CUSTOMIZATION} = require('../../lib/constants').default
import Realm from 'realm';

export default class JobTransactionCustomization extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
JobTransactionCustomization.schema = {
  name: TABLE_JOB_TRANSACTION_CUSTOMIZATION,
  primaryKey: 'id',
  properties: {
      circleLine1: { type: 'string', default: '',optional:true },
      circleLine2: { type: 'string', default: '',optional:true },
      id: { type: 'int' },
      line1: { type: 'string', default: '',optional:true },
      line2: { type: 'string', default: '',optional:true },
  }
}