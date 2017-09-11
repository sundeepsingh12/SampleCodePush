'use strict'

import { customerCareService } from '../classes/CustomerCare'

describe('test cases for getCustomerCareMap', () => {

    it('should return empty customerCareMap for undefined customerCareList', () => {
        expect(customerCareService.getCustomerCareMap(undefined)).toEqual({})
    })

    it('should return empty customerCareMap for empty customerCareList', () => {
        expect(customerCareService.getCustomerCareMap([])).toEqual({})
    })

    it('should return customerCareMap for specified customerCareList', () => {
        const customerCareList = [
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

        const customerCareMap = {
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

        expect(customerCareService.getCustomerCareMap(customerCareList)).toEqual(customerCareMap)
    })

})