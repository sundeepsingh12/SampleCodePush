/**
 * # API.js
 *
 * This class interfaces with FarEye server using the rest api
 *
 */
'use strict'

/**
 * ## Imports
 *
 * Config for defaults and underscore for a couple of features
 */
import CONFIG from './config'
import _ from 'underscore'
class RestAPI {
  /**
   * ## API.js client
   *
   *
   * @throws tokenMissing if token is undefined
   */
  initialize(token) {
    if (!_.isNull(token) && _.isUndefined(token)) {
      throw new Error('TokenMissing')
    }
    this._sessionToken = _.isNull(token) ? null : token

    this.API_BASE_URL = CONFIG.backend.fareyeProduction ?
      CONFIG.FAREYE.production.url :
      CONFIG.FAREYE.staging.url
  }

  /**
   * ### _fetch
   * A generic function that prepares the request
   *
   * @returns object:
   * { code: response.code,
   *   status: response.status,
   *   json: response.json() }
   * 
   * @throws exception:
   * {
   *    code: response.status,
   *    message: 'Error message like Internal server error'
   *  }
   */
  async _fetch(opts) {
    let url = this.API_BASE_URL + opts.url
    console.log(url)
    if (this._sessionToken) {
      opts.headers['Cookie'] = this._sessionToken

    }
    const response = await fetch(url, opts)
    const { status, code, headers } = response;
    let res = {
      status,
      code,
      headers,
      json: {}
    }
    console.log(">>>> response");
    console.log(response);
    //Check if server returned JSON or Text response
    let isJsonResponse = false;
    response.headers.forEach(function(val, key) {  if(val.indexOf('json')!=-1) isJsonResponse = true; });
    console.log("=====Is JSON response ?======="+isJsonResponse);
    try {
      res.json = (isJsonResponse) ? await response.json() : await response.text()
    } catch (e) {
      console.log("Error in parsing response JSON/ Text")
      console.log(e);
      res.json = {}
    }
    if (res.status!=200) {
      throw {
        code: res.status,
        message: ((res.json && res.json.message) ? res.json.message : 'Unknow error. Retry or contact support.') 
      }
    }
    return res;
  }

  serviceCall(body, url, method) {
    let opts;
    if (method === 'POST') {
      opts = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        url,
        body
      }
    } else if (method === 'LOGIN') {
      opts = {
        headers: {},
        url,
        body,
        method: 'POST'
      }
    } else {
      opts = {
        method,
        url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
    return this._fetch(opts);
  }
}
// The singleton variable
export let restAPI = new RestAPI()
