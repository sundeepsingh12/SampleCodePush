/**
 * # BackendFactory
 *
 * This class sets up the backend by checking the config.js
 *
 */
'use strict'

import CONFIG from './config'
import {restAPI} from './RestAPI'

export default function RestAPIFactory (token = null) {
  // if (CONFIG.backend.url) {
    restAPI.initialize(token)
    return restAPI
}
