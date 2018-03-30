'use strict'
import { TABLE_FIELD_DATA } from '../../lib/constants'
import Realm from 'realm';

export default class FieldData extends Realm.Object { }

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
FieldData.schema = {
  name: TABLE_FIELD_DATA,
  properties: {
    fieldAttributeMasterId: 'int' ,
    id:  'int' ,
    jobTransactionId:  'int' ,
    parentId:  'int' ,
    positionId:  'int' ,
    value:  'string?',
    attributeTypeId: 'int?', 
  }
}