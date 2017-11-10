

import RestAPIFactory from '../../lib/RestAPIFactory'
import _ from 'underscore'
import CONFIG from '.././../lib/config'
import {REF_UNAVAILABLE,REFERENCE_NO,GET,FAILURE_SORTING,NA} from '../../lib/AttributeConstants'

class sortingAndPrintingService {

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



    async getSortingData(referenceNumber,token){
        let data = null;
        let referenceData = null;
        if( !_.isNull(referenceNumber) && !_.isUndefined(referenceNumber) ){
            referenceData = REFERENCE_NO + referenceNumber.value;
            const url = (referenceData == null) ? CONFIG.API.SCAN_AND_SEARCH_SORTING : CONFIG.API.SCAN_AND_SEARCH_SORTING + "?" + referenceData
            let getSortingData = await RestAPIFactory(token).serviceCall(null, url, GET)
            if (getSortingData) {
                json = await getSortingData.json
                data =(!_.isNull(json) && !_.isUndefined(json) && !_.isEmpty(json)) ? json : null ;
            }else{
                throw new Error(FAILURE_SORTING)
            }
        }else{
            throw new Error(REF_UNAVAILABLE)
        }
        return data;  
    }


     /**This method first set data to display on screen. 
   * 
   * @param {*} jsonData 
   * @param {*} referenceNumber 
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

    setSortingData(jsonData,referenceNumber){
    let  sortingList = {}, id = 0;
      if(jsonData.jobTransaction != null && jsonData.jobTransaction != undefined){
        label = ['','Name','Sequence Number','Employee Code','Address']
        sortingList[id] = (jsonData.jobTransaction.referenceNumber) ? {id, value : jsonData.jobTransaction.referenceNumber , label : label[id++]} : {id: id++,value:NA}
        sortingList[id] = (jsonData.firstName != null && jsonData.lastName != null) ? {id, value : jsonData.firstName.toUpperCase() + ' ' + jsonData.lastName.toUpperCase(),label : label[id++] } :  {id: id++,value:NA};
        sortingList[id] = (jsonData.jobsInRunsheet) && (jsonData.jobTransaction.seqSelected)? {id, value : jsonData.jobTransaction.seqSelected + '/' + jsonData.jobsInRunsheet, label : label[id++]}: 
                                  (jsonData.jobTransaction.seqSelected) ? {id, value : jsonData.jobTransaction.seqSelected, label : label[id++] }: {id: id++,value:NA};
        sortingList[id] = (jsonData.empHubCode) ? {id, value : jsonData.empHubCode, label : label[id++] }:  {id: id++,value:NA}
        sortingList[id] = (jsonData.addressData) ? {id, value : jsonData.addressData, label : label[id++] }:  {id: id++,value:NA}
      }else{
        throw new Error(FAILURE_SORTING)
      }
      return sortingList;
    }



}
export let sortingService = new sortingAndPrintingService()