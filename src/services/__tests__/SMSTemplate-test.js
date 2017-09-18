'use strict'

import { smsTemplateService } from '../classes/SMSTemplate'

describe('test cases for getSMSTemplateMap', () => {

    it('should return empty smsTemplateMap for undefined smsTemplateList', () => {
        expect(smsTemplateService.getSMSTemplateMap(undefined)).toEqual({})
    })

    it('should return empty smsTemplateMap for empty smsTemplateList', () => {
        expect(smsTemplateService.getSMSTemplateMap([])).toEqual({})
    })

    it('should return smsTemplateMap for specified smsTemplateList', () => {
        const smsTemplateList = [
            {
                jobMasterId: 1,
                value: 'xyz'
            },
            {
                jobMasterId: 1,
                value: 'abc'
            },
            {
                jobMasterId: 2,
                value: 'xyz'
            }
        ]

        const smsTemplateMap = {
            1: [
                {
                    jobMasterId: 1,
                    value: 'xyz'
                },
                {
                    jobMasterId: 1,
                    value: 'abc'
                },
            ],
            2: [
                {
                    jobMasterId: 2,
                    value: 'xyz'
                }
            ]
        }

        expect(smsTemplateService.getSMSTemplateMap(smsTemplateList)).toEqual(smsTemplateMap)
    })

})