'use strict'
import {
    FIELD_ATTRIBUTE_VALIDATION
} from '../../lib/constants'
import {
    keyValueDBService
} from './KeyValueDBService'

class FieldAttributeValidation {

    async getFieldAttributeValidationFromFieldAttributeId(fieldAttributeMasterId){
        const fieldAttributeValidations = await keyValueDBService.getValueFromStore(FIELD_ATTRIBUTE_VALIDATION)
         if (!fieldAttributeValidations || !fieldAttributeValidations.value) {
            throw new Error('Field Attribute Validation missing in store')
        }
        const fieldAttributeValidationForFieldAttribute = fieldAttributeValidations.value.filter(fieldAttributeValidationObject=>fieldAttributeValidationObject.fieldAttributeMasterId==fieldAttributeMasterId)
        return fieldAttributeValidationForFieldAttribute[0]
    }
}

export let fieldAttributeValidation = new FieldAttributeValidation()