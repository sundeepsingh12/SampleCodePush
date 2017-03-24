'use strict'
const { TABLE_JOB_MASTER } = require('../../lib/constants').default

export default class JobMaster {
  schema : {
    name: TABLE_JOB_MASTER,
    properties: {
      id : {type: 'int'},
      title: {type: 'string'},
      identifier: {type: 'string'},
      identifierColor: {type: 'string'},
      code: {type: 'string'},
      companyId: {type: 'int'},
      enabled: {type: 'bool'},
      allowAddNew: {type: 'bool'},
      allowCollection: {type: 'bool'},
      allowPayment: {type: 'bool'},
      isStatusRevert: {type: 'bool'},
    }
  }
}
