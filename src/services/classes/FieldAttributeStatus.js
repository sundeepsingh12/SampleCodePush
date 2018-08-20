'use strict'
import { FIELD_ATTRIBUTE_STATUS, } from '../../lib/constants'
import { keyValueDBService } from './KeyValueDBService'

class FieldAttributeStatus {

    getFieldAttributeStatusMap(fieldAttributeStatusList) {
        let fieldAttributeStatusMap = {};
        for (let fieldAttributeStatus in fieldAttributeStatusList) {
            fieldAttributeStatusMap[fieldAttributeStatus.fieldAttributeId] = fieldAttributeStatusMap[fieldAttributeStatus.fieldAttributeId] ? fieldAttributeStatusMap[fieldAttributeStatus.fieldAttributeId] : {};
            fieldAttributeStatusMap[fieldAttributeStatus.fieldAttributeId][fieldAttributeStatus.statusId] = fieldAttributeStatus;
        }
        return fieldAttributeStatusMap;
    }
}

export let fieldAttributeStatusService = new FieldAttributeStatus()