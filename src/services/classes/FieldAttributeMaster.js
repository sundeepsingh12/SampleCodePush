'use strict'
import {
    keyValueDBService
} from './KeyValueDBService'
class FieldAttributeMaster {
    /**
     * @param {*} fieldAttributeMasterList 
     * @returns
     * FieldAttributeMasterMap : {
     *                              jobMasterId : {
     *                                              fieldAttributeMasterId : {
     *                                                                          fieldAttributeMaster
     *                                                                       }
     *                                            }
     *                           }
     */
    getFieldAttributeMasterMap(fieldAttributeMasterList) {
        let fieldAttributeMasterMap = {}
        fieldAttributeMasterList = fieldAttributeMasterList ? fieldAttributeMasterList : []
        fieldAttributeMasterList.forEach(fieldAttributeMaster => {
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] = fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] ? fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] : {}
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId][fieldAttributeMaster.id] = fieldAttributeMaster
        })
        return fieldAttributeMasterMap
    }

    /**
     * @param {*} fieldAttributeStatusList
     * @returns
     * FieldAttributeStatusMap : {
     *                              fieldAttributeId : { fieldAttributeStatus }
     *                           }
     */
    getFieldAttributeStatusMap(fieldAttributeStatusList) {
        let fieldAttributeStatusMap = {}
        fieldAttributeStatusList = fieldAttributeStatusList ? fieldAttributeStatusList : []
        fieldAttributeStatusList.forEach(fieldAttributeStatus => {
            fieldAttributeStatusMap[fieldAttributeStatus.fieldAttributeId] = fieldAttributeStatus
        })
        return fieldAttributeStatusMap
    }

    /**
     * 
     * @param {*} fieldAttributeMasterList 
     * @returns
     * FieldAttributeMasterMap : {
     *                              jobMasterId : {
     *                                              parentId : {
     *                                                              fieldAttributeMasterId : fieldAttributeMaster
     *                                                         }
     *                                            }
     *                           }
     */
    getFieldAttributeMasterMapWithParentId(fieldAttributeMasterList) {
        let fieldAttributeMasterMap = {}
        for(let index in fieldAttributeMasterList) {
            let fieldAttributeMaster = fieldAttributeMasterList[index]
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] = fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] ? fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId] : {}
            fieldAttributeMaster.parentId = fieldAttributeMaster.parentId ? fieldAttributeMaster.parentId : 'root'
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId][fieldAttributeMaster.parentId] = fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId][fieldAttributeMaster.parentId] ? fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId][fieldAttributeMaster.parentId] : {}
            fieldAttributeMasterMap[fieldAttributeMaster.jobMasterId][fieldAttributeMaster.parentId][fieldAttributeMaster.id] = fieldAttributeMaster
        }
        return fieldAttributeMasterMap;
    }

    /**
     * This function returns child field attribute master of a field attribute master
     * @param {*} childObjectList 
     * @param {*} map 
     * @returns
     * childObject : {
     *                      fielAttributeMaster,
     *                      childObject : { fielAttributeMaster } 
     *                   }
     */
    setChildFieldAttributeMaster(childObjectList, map) {
        for (let index in childObjectList) {
            childObjectList[index].childObject = map[index] ? this.setChildFieldAttributeMaster(map[index], map) : null;
        }
        return childObjectList
    }
}

export let fieldAttributeMasterService = new FieldAttributeMaster()