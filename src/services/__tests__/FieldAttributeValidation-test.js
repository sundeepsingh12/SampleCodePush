'use strict'

import {
    keyValueDBService
} from '../classes/KeyValueDBService'

import {
    fieldAttributeValidation
} from '../classes/FieldAttributeValidation'

describe('get fieldattribute validation from fieldAttribute id', () => {

    it('should get fieldattribute validation from fieldAttribute id', () => {
        const fieldAttributeId = 19865
        const skuObjectValidationObject = {
            fieldAttributeMasterId: 19865,
            id: 16298,
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: [{
                    fieldAttributeMasterId: 19865,
                    id: 16298,
                },
                {
                    fieldAttributeMasterId: 19866,
                    id: 16299,
                }
            ]
        })
        return fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(fieldAttributeId).then(
            data => {
                expect(data).toEqual(skuObjectValidationObject)
            }
        )
    })

    it('should throw error when field attribute validations missing', () => {
        const fieldAttributeId = 19865
        const message = 'Field Attribute Validation missing in store'
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(fieldAttributeId).catch(error => {
            expect(error.message).toEqual(message)
        })
    })

    it('should throw error when field attribute id missing',() => {
        const fieldAttributeId = null
         const message = 'Field attribute id missing'
        keyValueDBService.getValueFromStore = jest.fn()
          keyValueDBService.getValueFromStore.mockReturnValueOnce({
            value: [{
                    fieldAttributeMasterId: 19865,
                    id: 16298,
                },
                {
                    fieldAttributeMasterId: 19866,
                    id: 16299,
                }
            ]
        })
         return fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId(fieldAttributeId).catch(error => {
            expect(error.message).toEqual(message)
        })
    })
})