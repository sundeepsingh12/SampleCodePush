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
export class RestAPI {
    /**
     * ## API.js client
     *
     *
     * @throws tokenMissing if token is undefined
     */
    initialize (token) {
        console.log('token initialize')
        console.log(token)
        if (!_.isNull(token) && _.isUndefined(token.sessionToken)) {
            throw new Error('TokenMissing')
        }
        this._sessionToken = _.isNull(token) ? null : token.sessionToken

        this.API_BASE_URL = CONFIG.backend.fareyeProduction
            ? CONFIG.FAREYE.production.url
            : CONFIG.FAREYE.staging.url
    }

    /**
     * ### _fetch
     * A generic function that prepares the request
     *
     * @returns object:
     *  {code: response.code,
 *   status: response.status,
 *   json: response.json()
 */
    async _fetch (opts) {
        let url = this.API_BASE_URL + opts.url
        console.log("this.sessionToken")
        console.log(this._sessionToken)
        if (this._sessionToken) {
            opts.headers = {}
            opts.headers['Cookie'] = this._sessionToken
        }
        const response = await fetch(url, opts)
        const {status, code, headers} = response;
        let res = {
            status,
            code,
            headers,
            json: {}
        }
        if (opts.headers["Content-Type"] == "application/json") {
            res.json = response.json()
        }
        return res
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

    serviceCall(body,url,method) {
        let opts;
        if(method==='POST'){
            opts = {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                url,
                body
            }
        }
        else if(method==='LOGIN'){
           opts = {
               headers: {
               },
               url,
               body,
               method:'POST'
           }
        }
        else{
            opts = {
                method,
                url,
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        }

        return this._fetch(opts)
            .then((res) => {
                console.log(res.status)
                console.log(res.message)
                if(res.status==200) {
                    return res;
                }else{
                    console.log(res)
                    throw new Error({code: res.statusCode, error: res.message})
                }
            })
            .catch((error) => {
                throw(error)
            })
    }
}
// The singleton variable
export let restAPI = new RestAPI()