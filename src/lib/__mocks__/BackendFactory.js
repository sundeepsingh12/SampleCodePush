'use strict'

// import RestAPIInterFace from './RestAPIInterface'
const RestAPIInterFace = require('./RestAPIInterface').default


export default function BackendFactory (token = null) {
  return new RestAPIInterFace();
}