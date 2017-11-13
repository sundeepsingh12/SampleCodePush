'use strict'
import { TABLE_JOB_TRANSACTION } from '../../lib/constants'
import Realm from 'realm';

export default class JobTransaction extends Realm.Object {}

//Properties are in chronological order.
//Default value for each property is mandatory
//Every Schema must have atleast 1 Primary key index
JobTransaction.schema = {
  name: TABLE_JOB_TRANSACTION,
  primaryKey: 'id',
  properties: {
              runsheetNo  :  'string' ,
              syncErp  : { type: 'bool',default:false},
              jobCreatedAt  :   { type: 'string',default:''} ,
              erpSyncTime  :  'string?',
              androidPushTime  :  'string?',
              lastUpdatedAtServer  :     'string'   ,
              lastTransactionTimeOnMobile  :  'string?',
              jobEtaTime  :  'string?',
              seqSelected  : 'int' ,
              seqActual  :  'int?',
              seqAssigned  : 'int?',
              companyId  : { type: 'int' },
              jobId  : 'int',
              jobMasterId  :  'int' ,
              userId  :   'int' ,
              jobStatusId  :  'int',
              actualAmount  : { type: 'double',default:0.0,optional:true},
              originalAmount  : { type: 'double',default:0.0,optional:true},
              moneyTransactionType  :   'string?',
              referenceNumber  :     'string'  ,
              runsheetId  :   'int?',
              hubId  :  'int' ,
              cityId  :   'int' ,
              trackKm  :  'double' ,
              trackHalt  :  'double' ,
              trackCallCount  : { type: 'int',default:0},
              trackCallDuration  : { type: 'int',default:0},
              trackSmsCount  : { type: 'int',default:0},
              trackTransactionTimeSpent  :  'double' ,
              latitude  :  'double' ,
              longitude  :  'double' ,
              trackBattery  : 'int' ,
              deleteFlag  : 'int' ,
              attemptCount  : { type: 'int',default:1},
              startTime  :   'string?',
              endTime  :  'string?',
              merchantCode  :  'string?',
              imeiNumber  :  'string?',
              npsFeedBack  :  'string?',
              id  : 'int' ,
              jobType : 'string?',
              statusCode : 'string?',
              employeeCode :  'string?',
              hubCode : 'string?',
              negativeJobTransactionId : 'int?'
  }
}