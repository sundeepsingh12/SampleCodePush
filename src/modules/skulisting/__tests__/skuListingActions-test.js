'use strict'
import * as actions from '../skuListingActions'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    skuListing
} from '../../../services/classes/SkuListing'
import {
    fieldAttributeValidation
} from '../../../services/classes/FieldAttributeValidation'
import {
  SKU_LIST_FETCHING_START,
  SKU_LIST_FETCHING_STOP
} from '../../../lib/constants'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('prepare Sku List', () => {
    it('should prepare sku list', () => {
        const fieldAttributeMasterId = 19865,
            jobId = 2
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
       
        skuListing.getSkuListingDto = jest.fn()
        skuListing.getSkuListingDto.mockReturnValue(skuListingDto)

         fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId = jest.fn()
        fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId.mockReturnValue({
            fieldAttributeMasterId: 19865,
            id: 16298,
        })

        skuListing.prepareSkuListingData = jest.fn()
        skuListing.prepareSkuListingData.mockReturnValue({
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
        })

        skuListing.getSkuChildAttributes = jest.fn()
        skuListing.getSkuChildAttributes.mockReturnValue({
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
        })

         const expectedActions = [
            {
                type: SKU_LIST_FETCHING_START,
            },
            {
                type: SKU_LIST_FETCHING_STOP,
            }
        ]
        const store = mockStore({})
        return store.dispatch(actions.prepareSkuList())
            .then(() => {
                expect(skuListing.getSkuListingDto).toHaveBeenCalledTimes(1)
                expect(fieldAttributeValidation.getFieldAttributeValidationFromFieldAttributeId).toHaveBeenCalledTimes(1)
                expect(skuListing.prepareSkuListingData).toHaveBeenCalledTimes(1)
                expect(skuListing.getSkuChildAttributes).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
            })
    })
})