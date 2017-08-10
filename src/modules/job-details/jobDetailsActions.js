'use strict'

import { Actions } from 'react-native-router-flux'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
const {
    JOB_ATTRIBUTE,
    FIELD_ATTRIBUTE,
    JOB_ATTRIBUTE_STATUS,
    FIELD_ATTRIBUTE_STATUS
} = require('../../lib/constants').default

export function getJobDetails() {
    return async function(dispatch) {
        try {
            const jobAttributeMaster = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE)
            const fieldAttributeMaster = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE)
            const jobAttributeStatusList = await keyValueDBService.getValueFromStore(JOB_ATTRIBUTE_STATUS)
            const fieldAttributeStatusList = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_STATUS)

        } catch (error) {
            console.log(error)
        }
    }
}