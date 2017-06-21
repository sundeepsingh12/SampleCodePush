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
    initialize (token) {
        if (!_.isNull(token) && _.isUndefined(token)) {
            throw new Error('TokenMissing')
        }
        this._sessionToken = _.isNull(token) ? null : token

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
        if (this._sessionToken) {
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
        console.log('url >> '+url)
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
                    'Content-Type': 'application/json'
                }
            }
        }

        return this._fetch(opts)
            .then((res) => {
                console.log('status code')
                  console.log(res.status)
                if(res.status==200) {
                    return res;
                } else {
                    switch(res.status) {
                    case 401:
                        throw new Error("Invalid User Credentials")
                    case 500:
                        throw new Error("Internal server error")
                    case 502:
                        throw new Error("Bad Gateway")
                    case 1201:
                        throw new Error("User already logged in ")
                    case 1203:
                        throw new Error("User locked.Try after 15 minutes")
                    default:
                        throw {code: res.status, message: 'Something went wrong'}
                    }
                }
            })
            .catch((error) => {
                throw(error)
            })
    }
}
// The singleton variable
export let restAPI = new RestAPI()