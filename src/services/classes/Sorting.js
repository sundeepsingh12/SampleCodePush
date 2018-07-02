'use strict'

import RestAPIFactory from '../../lib/RestAPIFactory'
import _ from 'lodash'
import CONFIG from '.././../lib/config'
import { REFERENCE_NO, GET, NA } from '../../lib/AttributeConstants'
import { REF_UNAVAILABLE, FAILURE_SORTING, } from '../../lib/ContainerConstants'

class Sorting {

  /**This method first get data from server according to given reference no. 
   * 
   * @param {*} referenceNumber 
   * @param {*} token 
   * @Return type
   *       object
   * 
   * Returns data = {
   *       firstName : '',
   *       lastName : '',
   *       jobsInRunsheet : '',
   *       jobTransaction : {},
   *       empHubCode : '',
   *       addressData : ''
   * }
   */

  async getSortingData(referenceNumber, token) {
    if ( _.isEmpty(referenceNumber))
      throw new Error(REF_UNAVAILABLE)
    let referenceData = REFERENCE_NO + referenceNumber;
    const url = (referenceData == null) ? CONFIG.API.SCAN_AND_SEARCH_SORTING : CONFIG.API.SCAN_AND_SEARCH_SORTING + "?" + referenceData
    let getSortingData = await RestAPIFactory(token).serviceCall(null, url, GET)
    let json = await getSortingData.json
    let data = (!_.isEmpty(json)) ? json : null
    return data
  }


  /**This method first set data to display on screen. 
* 
* @param {*} jsonData 
* 
* @Return type
*       object
* 
* Returns sortingList = {
*  0:{id: 0, value: "NITESH-1510252533058", label: ""}
*  1:{id: 1, value: "MANUPRA SINGH", label: "Name"}
*  2:{id: 2, value: "1/1", label: "Sequence Number"}
*  3:{id: 3, value: "udyog12", label: "Employee Code"}
*  4:{id: 4, value: "N.A"}
* }
*/

  setSortingData(jsonData) {
    let sortingList = {}, id = 0,label = [];
    if (jsonData.jobTransaction) {
      label = ['', 'Name', 'Employee Code', 'Sequence Number', 'Address']
      sortingList[id] = (jsonData.jobTransaction.referenceNumber) ? { id, value: jsonData.jobTransaction.referenceNumber, label: label[id++] } : { id: id++, value: NA }
      sortingList[id] = (jsonData.firstName != null && jsonData.lastName != null) ? { id, value: jsonData.firstName.toUpperCase() + ' ' + jsonData.lastName.toUpperCase(), label: label[id++] } : { id: id++, value: NA };
      sortingList[id] = (jsonData.empHubCode) && (jsonData.empCode) ? { id, value: jsonData.empCode + '/' + jsonData.empHubCode, label: label[id++] } : (jsonData.empCode) ?
        { id, value: jsonData.empCode, label: label[id++] } : { id: id++, value: NA }
      sortingList[id] = (jsonData.jobsInRunsheet) && (jsonData.jobTransaction.seqSelected) ? { id, value: jsonData.jobTransaction.seqSelected + '/' + jsonData.jobsInRunsheet, label: label[id++] } :
        (jsonData.jobTransaction.seqSelected) ? { id, value: jsonData.jobTransaction.seqSelected, label: label[id++] } : { id: id++, value: NA };
      sortingList[id] = (jsonData.addressData) ? { id, value: jsonData.addressData, label: label[id++] } : { id: id++, value: NA }
    } else {
      throw new Error(FAILURE_SORTING)
    }
    return sortingList
  }



}
export let sortingService = new Sorting()