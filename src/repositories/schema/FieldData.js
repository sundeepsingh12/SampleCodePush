'use strict'
const { TABLE_FIELD_DATA} = require('../../lib/constants').default
import Realm from 'realm';

export default class FieldData extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
FieldData.schema = {
  name: TABLE_FIELD_DATA,
  primaryKey: 'id',
  properties: {
      id: { type: 'int' },
     value:{type: 'string'},
     jobTransactionId:{type:'int'},
     positionId:{type:'int'},
     parentId:{type:'int'},
     fieldAttributeMasterId:{type:'int'}
  }
}