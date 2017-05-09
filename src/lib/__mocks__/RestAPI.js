'use strict'

require('regenerator-runtime/runtime')

export default class RestAPI {

  constructor() {
    var _bodyInit = JSON.stringify({
      code: 200
    })
    this.response = {
      'status': 201
    }
    this.response._bodyInit = _bodyInit
  }

  _fetch() {
    const res = {
      'status': 401
    }
    return res;
  }

  serviceCall(postData) {
    return postData;
  }

  _pruneEmpty(response) {
    return response;
  }
}
