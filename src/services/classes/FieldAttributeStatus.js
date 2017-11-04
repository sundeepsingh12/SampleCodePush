'use strict'
const {
    FIELD_ATTRIBUTE_STATUS,
} = require('../../lib/constants').default
import _ from 'underscore'
import {
    keyValueDBService
} from './KeyValueDBService'

class FieldAttributeStatus {

    async getFieldAttributeIdSequenceMap(fieldAttributeIdList) {
        let fieldAttributeIdSequenceObject = {}
        const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS)
        const sortedFieldAttributeStatus = fieldAttributeStatusList.value.filter(fieldAttributeStatus => fieldAttributeIdList.includes(fieldAttributeStatus.id)).sort((a,b)=>b.sequence - a.sequence)
    }
}

export let fieldAttributeStatusService = new FieldAttributeStatus()