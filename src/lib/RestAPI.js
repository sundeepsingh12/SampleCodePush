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
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob'
import {keyValueDBService} from '../services/classes/KeyValueDBService.js'
const {
  PENDING_SYNC_TRANSACTION_IDS
} = require('./constants').default

const fetch = require('react-native-cancelable-fetch');
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
  async _fetch(opts, fetchRequestId) {
    let url = this.API_BASE_URL + opts.url
    if (this._sessionToken) {
      opts.headers['Cookie'] = this._sessionToken
    }
    const response = await fetch(url, opts, fetchRequestId)
    const { status, code, headers } = response;
    let res = {
      status,
      code,
      headers,
      json: {}
    }

    //Check if server returned JSON or Text response
    let isJsonResponse = false;
    response.headers.forEach(function (val, key) { if (val.indexOf('json') != -1) isJsonResponse = true; });
    try {
      res.json = (isJsonResponse) ? await response.json() : await response.text()
    } catch (e) {
      res.json = {}
    }
    if (res.status != 200) {
      throw {
        code: res.status,
        message: ((res.json && res.json.message) ? res.json.message : 'Unknow error. Retry or contact support.')
      }
    }
    return res;
  }

  /**
   * Remove  null, NaN, empty String and empty objects from JSON Objects
   **/
  _pruneEmpty(obj) {
    function prune(current) {
      _.forEach(current, function (value, key) {
        if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
          (_.isString(value) && _.isEmpty(value)) ||
          (_.isObject(value) && _.isEmpty(prune(value)))) {

          delete current[key];
        }
      });
      return current;
    };
    return prune(obj);
  }

  /** 
  * Parameters (Request Body, URL, Method (enum type POST, LOGIN, GET))
  * 
  * Success response JSON object
  * {
  *   status,
  *   code,
  *   headers,
  *   json: {}
  * }
  * 
  * Failure response JSON object
  * {
  *   code: xxx,
  *   message: 'error message'
  * }
  */
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

    //Random number between 1 and 1000
    const fetchRequestId = Math.floor((Math.random() * 1000) + 1);

    //Creating a _fetch request which will timeout in 30 seconds
    return this.timeoutPromise(30 * 1000, new Error('Timed Out!'), this._fetch(opts, fetchRequestId))
      .then((res) => {
        return res;
      })
      .catch((e) => {
        //Aborting the Fetch API call
        fetch.abort(fetchRequestId);

        //Throw custom error instance
        if (e instanceof Error) {
          throw {
            code: 504,
            message: 'Slow or no internet on Device.'
          }
        } else {
          throw e
        }
      })
  }

  //Wrapper function to timeout a "Promise" after specific time
  timeoutPromise(timeout, err, promise) {
    return new Promise(function (resolve, reject) {
      promise.then(resolve, reject);
      setTimeout(reject.bind(null, err), timeout);
    });
  }

  async uploadZipFile() {
    var PATH = RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER;
  await RNFetchBlob.fetch('POST', this.API_BASE_URL+CONFIG.API.UPLOAD_DATA_API, {
    Authorization :this._sessionToken,
    'Content-Type' : 'multipart/form-data',
  }, [
    { name : 'file', filename : 'sync.zip', type:'*/*', data: RNFetchBlob.wrap(PATH+'/sync.zip')},
  ]).uploadProgress((written, total) => {
        console.log('uploaded', written / total)
    }).then(async(resp) => {
    const responseBody = resp.text()
    console.log('responseBody>>>>>',responseBody)
    const message = responseBody.split(",")[0]
    console.log('message >>>>>',message);
    const syncCount = responseBody.split(",")[1]
    if(message=='success'){
      //do something
      let storeValue =await keyValueDBService.deleteValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
      let transactionIdToBeSynced = await keyValueDBService.getValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
    }
  }).catch((err) => {
    console.log(err)
  })
  }

}
// The singleton variable
export let restAPI = new RestAPI()
