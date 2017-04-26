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

    serviceCall(data,apiUrl,methodType) {
        return this._fetch({
            method: methodType,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            url:apiUrl,
            body: data
        })
            .then((res) => {
                if(res.status==200) {
                    return res;
                }else{
                    throw new Error({code: res.statusCode, error: res.message})
                }
            })
            .catch((error) => {
                throw(error)
            })
    }

    /**
     * ### logout
     * prepare the request and call _fetch
     */
    async logout () {
        return await this._fetch({
            method: 'GET',
            url: '/logout'
        })
            .then((res) => {
                //TODO Remove 500 by getting API changed on Server
                if ((res.status === 200 || res.status === 500)) {
                    return {}
                } else {
                    throw new Error({code: res.statusCode, error: res.message})
                }
            })
            .catch((error) => {
                throw (error)
            })
    }

}
// The singleton variable
export let restAPI = new RestAPI()