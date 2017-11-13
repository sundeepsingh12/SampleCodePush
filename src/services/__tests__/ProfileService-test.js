'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'

import {

} from '../../lib/AttributeConstants'
import { profileService } from '../classes/ProfileService'

describe('test cases for getResponse after hitting API', () => {
    it('should return and reset the new password', () => {
        const result = {
            fieldAttributeMasterId: 1,
            label: 'sample_label',
            attributeTypeId: 11
        }
        const fieldAttributeData = {
            id: 1,
            label: 'sample_label',
            attributeTypeId: 11
        }
        expect(CashTenderingService.prepareObjectWithFieldAttributeData(fieldAttributeData)).toEqual(result)
    })

    it('should return null when fieldAttributeData is undefined', () => {
        expect(CashTenderingService.prepareObjectWithFieldAttributeData(undefined)).toEqual(null)
    })
})

