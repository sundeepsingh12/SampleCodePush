'use strict'

import {
    skuListing
} from '../classes/SkuListing'
import {
    keyValueDBService
} from '../classes/KeyValueDBService'
import {
    jobDataService
} from '../classes/JobData'


import * as realm from '../../repositories/realmdb'

describe('get sku listing dto', () => {

    it('should throw field attribute missing error', () => {
        const message = 'Field Attributes missing in store'
        const fieldAttributeMasterId = 1
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(null)
        return skuListing.getSkuListingDto(fieldAttributeMasterId).catch(error => {
            expect(error.message).toEqual(message)
        })
    })

    it('should throw error fieldattribute id missing', () => {
        const message = 'Field Attribute master id missing'
        const fieldAttributeMasterId = null
        return skuListing.getSkuListingDto(fieldAttributeMasterId).catch(error => {
            expect(error.message).toEqual(message)
        })
    })

    it('should get sku listing dto in case of sku code present', () => {
        const fieldAttributeMasterId = 1986
        let idFieldAttributeMap = new Map()
        idFieldAttributeMap.set(19, {
            id: 2,
            parentId: 1,
            attributeTypeId: 51,
            jobAttributeMasterId: 19

        })
        idFieldAttributeMap.set(16, {
            id: 3,
            parentId: 1,
            attributeTypeId: 16,
            jobAttributeMasterId: null
        })
        const skuListingDto = {
            childFieldAttributeId: [1],
            idFieldAttributeMap,
            isSkuCodePresent: true
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: [{
                    id: 1,
                    parentId: 1986,
                    attributeTypeId: 11,
                    jobAttributeMasterId: 0
                },
                {
                    id: 2,
                    parentId: 1,
                    attributeTypeId: 51,
                    jobAttributeMasterId: 19
                },
                {
                    id: 3,
                    parentId: 1,
                    attributeTypeId: 16,
                    jobAttributeMasterId: null
                }
            ]
        })
        return skuListing.getSkuListingDto(fieldAttributeMasterId).then(
            data => {
                expect(data).toEqual(skuListingDto)
            }
        )

    })

    it('should get sku listing dto in case of sku code absent', () => {
        const fieldAttributeMasterId = 1986
        let idFieldAttributeMap = new Map()
        idFieldAttributeMap.set(20, {
            id: 2,
            parentId: 1,
            attributeTypeId: 15,
            jobAttributeMasterId: 20

        })
        idFieldAttributeMap.set(16, {
            id: 3,
            parentId: 1,
            attributeTypeId: 16,
            jobAttributeMasterId: null
        })
        const skuListingDto = {
            childFieldAttributeId: [1],
            idFieldAttributeMap,
            isSkuCodePresent: false
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({
            value: [{
                    id: 1,
                    parentId: 1986,
                    attributeTypeId: 11,
                    jobAttributeMasterId: 0
                },
                {
                    id: 2,
                    parentId: 1,
                    attributeTypeId: 15,
                    jobAttributeMasterId: 20
                },
                {
                    id: 3,
                    parentId: 1,
                    attributeTypeId: 16,
                    jobAttributeMasterId: null
                }
            ]
        })
        return skuListing.getSkuListingDto(fieldAttributeMasterId).then(
            data => {
                expect(data).toEqual(skuListingDto)
            }
        )
    })

    describe('get sku child attributes', () => {

        it('should get sku child attributes', () => {
            const attributeTypeIdValueMap = {
                32: 0,
                35: 0,
                36: 0
            }
            let idFieldAttributeMap = new Map()
            idFieldAttributeMap.set(32, {
                id: 1
            })
            idFieldAttributeMap.set(35, {
                id: 2
            })
            idFieldAttributeMap.set(36, {
                id: 3
            })
            const childAttributesList = {
                32: {
                    id: 1,
                    value: 0,
                    attributeTypeId: 32
                },
                35: {
                    id: 2,
                    value: 0,
                    attributeTypeId: 35
                },
                36: {
                    id: 3,
                    value: 0,
                    attributeTypeId: 36
                }
            }
            expect(skuListing.getSkuChildAttributes(idFieldAttributeMap, attributeTypeIdValueMap)).toEqual(childAttributesList)
        })

        it('should throw error total original quantity missing', () => {
            const errorMessage = 'Total Original Quantity missing'
            const attributeTypeIdValueMap = {}
            let idFieldAttributeMap = new Map()
            idFieldAttributeMap.set(32, {
                id: 1
            })
            idFieldAttributeMap.set(36, {
                id: 3
            })
            try {
                skuListing.getSkuChildAttributes(idFieldAttributeMap, attributeTypeIdValueMap)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }

        })

        it('should throw error total actual quantity missing', () => {
            const errorMessage = 'Total Actual Quantity missing'
            const attributeTypeIdValueMap = {}
            let idFieldAttributeMap = new Map()
            idFieldAttributeMap.set(32, {
                id: 1
            })
            idFieldAttributeMap.set(35, {
                id: 3
            })
            try {
                skuListing.getSkuChildAttributes(idFieldAttributeMap, attributeTypeIdValueMap)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }
        })

        it('should throw error sku actual amount missing', () => {
            const errorMessage = 'Sku Actual Amount missing'
            const attributeTypeIdValueMap = {}
            let idFieldAttributeMap = new Map()
            idFieldAttributeMap.set(36, {
                id: 1
            })
            idFieldAttributeMap.set(35, {
                id: 3
            })
            try {
                skuListing.getSkuChildAttributes(idFieldAttributeMap, attributeTypeIdValueMap)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }
        })
    })

    describe('getFinalCheckForValidation', () => {

        it('should throw error Sku Object validation missing', () => {
            const errorMessage = 'Sku Object validation missing'
            try {
                const skuObjectValidation = null,
                    skuRootChildElements = {}
                skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildElements)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }
        })

        it('should throw error child elements missing', () => {
            const errorMessage = 'Sku child elements missing'
            try {
                const skuObjectValidation = {},
                    skuRootChildElements = null
                skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildElements)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }
        })

        it('should show message Quantity should be less than max quantity', () => {
            const message = 'Quantity should be less than max quantity.Cannot proceed.'
            const skuObjectValidation = {
                rightKey: ["1"]
            }
            const skuRootChildElements = {
                36: {
                    value: 1
                },
                35: {
                    value: 1
                }
            }
            expect(skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildElements)).toEqual(message)
        })

        it('should show message Quantity cant be 0', () => {
            const message = `Quantity can't be 0.Cannot proceed.`
            const skuObjectValidation = {
                rightKey: ["2"]
            }
            const skuRootChildElements = {
                36: {
                    value: 0
                }
            }
            expect(skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildElements)).toEqual(message)
        })

        it('should show message Quantity should be equal to max quantity', () => {
            const message = `Quantity should be equal to max quantity.Cannot proceed.`
            const skuObjectValidation = {
                rightKey: ["3"]
            }
            const skuRootChildElements = {
                36: {
                    value: 2
                },
                35: {
                    value: 1
                }
            }
            expect(skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildElements)).toEqual(message)
        })

        it('should show message Quantity should be 0', () => {
            const message = `Quantity should be 0.Cannot proceed.`
            const skuObjectValidation = {
                rightKey: ["4"]
            }
            const skuRootChildElements = {
                36: {
                    value: 2
                }
            }
            expect(skuListing.getFinalCheckForValidation(skuObjectValidation, skuRootChildElements)).toEqual(message)
        })

    })

    describe('prepareSkuListChildElementsForSaving', () => {

        it('should throw error object attribute id missing', () => {
            const errorMessage = 'Sku Object AttributeId missing'
            try {
                const skuListItems = {},
                    skuRootChildItems = {},
                    skuObjectAttributeId = null
                skuListing.prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }
        })

        it('should prepare SkuList child elements for saving', () => {
            const childElementsArray = [{
                    fieldAttributeMasterId: 19865,
                    value: 'ObjectSarojFareye',
                    attributeTypeId: 11,
                    childDataList: [{
                            attributeTypeId: 51,
                            value: "skucode1",
                            fieldAttributeMasterId: 19867
                        },
                        {
                            attributeTypeId: 14,
                            value: "12",
                            fieldAttributeMasterId: 19868
                        }
                    ]
                },
                {
                    id: 19870,
                    value: 0,
                    attributeTypeId: 32
                }, {
                    id: 19871,
                    value: 5,
                    attributeTypeId: 35
                }, {
                    id: 19872,
                    value: 0,
                    attributeTypeId: 36
                }
            ]
            const skuListItems = {
                    12: [{
                            id: 19867,
                            attributeTypeId: 51,
                            value: 'skucode1'
                        },
                        {
                            id: 19868,
                            attributeTypeId: 14,
                            value: '12'
                        }
                    ]
                },
                skuRootChildItems = {
                    32: {
                        id: 19870,
                        value: 0,
                        attributeTypeId: 32
                    },
                    35: {
                        id: 19871,
                        value: 5,
                        attributeTypeId: 35
                    },
                    36: {
                        id: 19872,
                        value: 0,
                        attributeTypeId: 36
                    }
                },
                skuObjectAttributeId = 19865
            expect(skuListing.prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId)).toEqual(childElementsArray)

        })

        it('should throw error Sku list items missing', () => {
            const errorMessage = 'Sku list items missing'
            try {
                const skuListItems = null,
                    skuRootChildItems = {},
                    skuObjectAttributeId = {}
                skuListing.prepareSkuListChildElementsForSaving(skuListItems, skuRootChildItems, skuObjectAttributeId)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }
        })

    })

    describe('prepareSkuListingData', () => {

        it('should throw job data missing', () => {
            const errorMessage = 'Job id missing'
            try {
                const idFieldAttributeMap = {},
                    jobId = null,
                    skuObjectValidation = {}
                skuListing.prepareSkuListingData(idFieldAttributeMap, jobId, skuObjectValidation)
            } catch (error) {
                expect(error.message).toEqual(errorMessage)
            }
        })

        it('should prepare sku listing data', () => {
            const jobId = 4328887,
                skuObjectValidation = {
                    id: 1,
                    leftKey: '0'
                }
            let idFieldAttributeMap = new Map()
            idFieldAttributeMap.set(10233, {
                id: 19867,
                attributeTypeId: 51,
                jobAttributeMasterId: 10233
            })
            idFieldAttributeMap.set(16, {
                id: 19869,
                attributeTypeId: 16,
                jobAttributeMasterId: 0
            })

            const returnObject = {
                skuObjectListDto: {
                    12: [{
                            attributeTypeId: 51,
                            autoIncrementId: 0,
                            id: 19867,
                            parentId: "12",
                            value: "skucode1"
                        },
                        {
                            attributeTypeId: 16,
                            autoIncrementId: 1,
                            id: 19869,
                            parentId: "12",
                            value: "0"
                        }
                    ]
                },
                attributeTypeIdValueMap: {
                    32: 0,
                    35: 0,
                    36: 0
                }
            }
            realm.getRecordListOnQuery = jest.fn()
            jobDataService.getParentIdJobDataListMap = jest.fn()
            jobDataService.getParentIdJobDataListMap.mockReturnValue({
                12: [{
                    id: 1,
                    jobAttributeMasterId: 10233,
                    value: 'skucode1',
                    jobId: 4328887
                }]
            })
            expect(skuListing.prepareSkuListingData(idFieldAttributeMap, jobId, skuObjectValidation)).toEqual(returnObject)
            expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
            expect(jobDataService.getParentIdJobDataListMap).toHaveBeenCalledTimes(1)
        })
    })

    describe('test cases for prepareUpdatedSkuArray', () => {
        it('should return updated sku array', () => {
            const value = 2,
                parentId = 12,
                skuListItems = {
                    12: [{
                        attributeTypeId: 16,
                        value: 0,
                        id: 19869,
                        parentId: 12
                    }, {
                        attributeTypeId: 14,
                        value: 12,
                        id: 19868,
                        parentId: 12
                    }, {
                        attributeTypeId: 15,
                        value: 5,
                        id: 19866,
                        parentId: 12
                    }]
                },
                skuChildElements = {
                    32: {
                        id: 19870,
                        value: 0,
                        attributeTypeId: 32
                    },
                    35: {
                        id: 19871,
                        value: 5,
                        attributeTypeId: 35
                    },
                    36: {
                        id: 19872,
                        value: 0,
                        attributeTypeId: 36
                    }
                }
            const returnObject = {
                updatedObject: {
                    12: [{
                        attributeTypeId: 16,
                        value: 2,
                        id: 19869,
                        parentId: 12
                    }, {
                        attributeTypeId: 14,
                        value: 12,
                        id: 19868,
                        parentId: 12
                    }, {
                        attributeTypeId: 15,
                        value: 5,
                        id: 19866,
                        parentId: 12
                    }]
                },
                updatedChildElements: {
                    32: {
                        id: 19870,
                        value: 24,
                        attributeTypeId: 32
                    },
                    35: {
                        id: 19871,
                        value: 5,
                        attributeTypeId: 35
                    },
                    36: {
                        id: 19872,
                        value: 2,
                        attributeTypeId: 36
                    }
                }
            }
            expect(skuListing.prepareUpdatedSkuArray(value, parentId, skuListItems, skuChildElements)).toEqual(returnObject)
        })
    })
})