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
import _ from 'lodash'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'react-native-fetch-blob'
import { keyValueDBService } from '../services/classes/KeyValueDBService.js'
import { PENDING_SYNC_TRANSACTION_IDS, LAST_SYNC_WITH_SERVER, DOMAIN_URL } from './constants'
import moment from 'moment'
import { sync } from '../services/classes/Sync'
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

    // this.API_BASE_URL = CONFIG.backend.fareyeProduction ?
    //   CONFIG.FAREYE.production.url :
    //   CONFIG.FAREYE.staging.url
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
    let url = opts.url
    if (!_.includes(opts.url, CONFIG.API.SEND_SMS_LINK) && !_.includes(opts.url, CONFIG.API.SEND_EMAIL_LINK) && opts.method != 'WALLET') {
      let data = await keyValueDBService.getValueFromStore(DOMAIN_URL)
      url = data.value + url
    }
    if (opts.method == 'WALLET') opts.method = 'POST'
    if (this._sessionToken) {
      opts.headers['Cookie'] = this._sessionToken
    }
    const response = await fetch(url, opts, fetchRequestId)
    const { status, code, headers, _bodyText } = response;
    let res = {
      status,
      code,
      headers,
      _bodyText,
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
    if (res.status != 200 && res.status != 202) {
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
    if (method === 'POST' || method === 'WALLET') {
      opts = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': method != 'WALLET' ? 'application/json' : 'application/x-www-form-urlencoded'
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
    return this.timeoutPromise(120 * 1000, new Error('Timed Out!'), this._fetch(opts, fetchRequestId))
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

  async uploadZipFile(path, fileName, currenDate, syncStoreDTO) {
    // const jid = this._sessionToken.split(';')[1].split(',')[1].trim()
    var PATH = (!path) ? RNFS.DocumentDirectoryPath + '/' + CONFIG.APP_FOLDER : path
    var filePath = (!path) ? PATH + '/sync.zip' : PATH
    let responseBody = "Fail"
    let data = await keyValueDBService.getValueFromStore(DOMAIN_URL)
    await RNFetchBlob.fetch('POST', data.value + CONFIG.API.UPLOAD_DATA_API, {
      'cookie': this._sessionToken,
      'Content-Type': 'multipart/form-data',
    }, [
        { name: 'file', filename: (!fileName) ? 'sync.zip' : fileName, data: RNFetchBlob.wrap(filePath) },
      ]).uploadProgress((written, total) => {
      }).then(async (resp) => {
        responseBody = resp.text()
        const message = responseBody.split(",")[0]
        if (!path && message == 'success') {
          if (currenDate) {
            await keyValueDBService.validateAndSaveData(LAST_SYNC_WITH_SERVER, currenDate)
          }
          if (syncStoreDTO) {
            await sync.deleteSpecificTransactionFromStoreList(syncStoreDTO.transactionIdToBeSynced, PENDING_SYNC_TRANSACTION_IDS, currenDate)
          }
          // await keyValueDBService.deleteValueFromStore(PENDING_SYNC_TRANSACTION_IDS);
        }
        else if (message != 'success') {
          throw new Error(responseBody)
        }
      }).catch(err => {
        throw {
          code: err.message ? JSON.parse(err.message).status : null,
        }
      })
    return responseBody
  }


}
// The singleton variable
export let restAPI = new RestAPI()
