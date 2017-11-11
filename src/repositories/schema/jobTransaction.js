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
              runsheetNo  :  { type: 'string',default:''} ,
              syncErp  : { type: 'bool',default:false},
              jobCreatedAt  :   { type: 'string',default:''} ,
              erpSyncTime  : { type: 'string',optional:true},
              androidPushTime  : { type: 'string',optional:true},
              lastUpdatedAtServer  :   { type: 'string' }  ,
              lastTransactionTimeOnMobile  : { type: 'string',optional:true},
              jobEtaTime  : { type: 'string',optional:true},
              seqSelected  : { type: 'int' },
              seqActual  : { type: 'int',optional:true},
              seqAssigned  : { type: 'int',optional:true},
              companyId  : { type: 'int' },
              jobId  : { type: 'int',default:0},
              jobMasterId  : { type: 'int' },
              userId  : { type: 'int' },
              jobStatusId  : { type: 'int',default:0},
              actualAmount  : { type: 'double',default:0.0,optional:true},
              originalAmount  : { type: 'double',default:0.0,optional:true},
              moneyTransactionType  :  { type: 'string',optional:true},
              referenceNumber  :    { type: 'string' }  ,
              runsheetId  :  { type: 'int',optional:true },
              hubId  : { type: 'int' },
              cityId  : { type: 'int' },
              trackKm  : { type: 'double' },
              trackHalt  : { type: 'double' },
              trackCallCount  : { type: 'int',default:0},
              trackCallDuration  : { type: 'int',default:0},
              trackSmsCount  : { type: 'int',default:0},
              trackTransactionTimeSpent  : { type: 'double' },
              latitude  : { type: 'double' },
              longitude  : { type: 'double' },
              trackBattery  : { type: 'int' },
              deleteFlag  : { type: 'int' },
              attemptCount  : { type: 'int',default:1},
              startTime  :  { type: 'string',optional:true},
              endTime  : { type: 'string',optional:true},
              merchantCode  : { type: 'string',optional:true},
              imeiNumber  : { type: 'string',optional:true},
              npsFeedBack  : { type: 'string',optional:true},
              id  : { type: 'int' },
              jobType : {type : 'string', optional : true},
              statusCode : {type : 'string', optional : true},
              employeeCode : {type : 'string', optional : true},
              hubCode : {type : 'string', optional : true},
              negativeJobTransactionId : {type : 'int',optional:true}
  }
}