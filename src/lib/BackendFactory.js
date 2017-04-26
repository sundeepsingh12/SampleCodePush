/**
 * # BackendFactory
 *
 * This class sets up the backend by checking the config.js
 *
 */
'use strict'

import CONFIG from './config'
import {restAPI} from './RestAPI'

export default function BackendFactory (token = null) {
  if (CONFIG.backend.fareyeProduction || CONFIG.backend.fareyeStaging || CONFIG.backend.fareyeDev) {
    restAPI.initialize(token)
    return restAPI
  }
}
