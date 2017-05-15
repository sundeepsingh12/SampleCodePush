'use strict'

const RestAPI = require('./RestAPI').default


export default function RestAPIFactory (token = null) {
  return new RestAPI();
}