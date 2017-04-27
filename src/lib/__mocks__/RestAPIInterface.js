'use strict'

require('regenerator-runtime/runtime')

export default class RestAPIInterface {

    constructor () {
    var _bodyInit = JSON.stringify({
      code: 200
    })
    this.response = {
      'status': 201
    }
    this.response._bodyInit = _bodyInit
  }

    serviceCall() {
        return null;
    }

    _pruneEmpty() {
      return null;
    }
}
