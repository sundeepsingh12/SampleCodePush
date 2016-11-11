/**
 * # Backend.js
 *
 * Abstract Base class for Backend support
 *
 */
'use strict'
/**
 * ## Async support
 *
 */
require('regenerator/runtime')

export default class Backend {
 /**
   * ### login
   * encode the data and and call _fetch
   *
   * @param
   * * * * *  FORM DATA * * * * * * *
   *  j_username
   *  j_password
   *  _spring_security_remember_me
   *  submit
   *
   * @returns
   * * * * *  HEADERS  * * * * * * *
   * status: 200 | 403
   * JSESSIONID: "r:Kt9wXIBWD0dNijNIq2u5rRllW"
   *
   */
  login (username, password) {

  }

  /**
   * ### logout
   * prepare the request and call _fetch
   */
  logout () {

  }

  /**
    * ## Download Job Master
    * Post data in JSON format
    {
        deviceIMEI: 9247428347826348724,
        deviceSIM: 123894574234,
        currentJobMasterVersion: 19,
        deviceCompanyId: 27
    }
  */
  downloadJobMaster(deviceIMEI, deviceSIM, currentJobMasterVersion, deviceCompanyId) {

  }
}
