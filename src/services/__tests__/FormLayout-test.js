'use strict'

import { formLayoutService } from '../classes/formLayout/FormLayout'
import { dataStoreService } from '../classes/DataStoreService'
import * as realm from '../../repositories/realmdb'

describe('test cases for getFieldAttributeValidationMap', () => {

    it('should return null', () => {
        expect(formLayoutService.getFieldAttributeValidationMap()).toEqual(undefined)
    })

    it('should return field attr validation map', () => {
        let fieldAttributeMasterValidations = [{
            id: 1
        }, {
            fieldAttributeMasterId: 1,
            validation: 'test'
        }]
        let result = {
            1: [{
                fieldAttributeMasterId: 1,
                validation: 'test'
            }]
        }
        expect(formLayoutService.getFieldAttributeValidationMap(fieldAttributeMasterValidations)).toEqual(result)
    })
})

describe('test cases for getFieldAttributeValidationConditionMap', () => {

    it('should return null', () => {
        expect(formLayoutService.getFieldAttributeValidationConditionMap()).toEqual(undefined)
    })

    it('should return field attr validation condition map', () => {
        let fieldAttributeMasterValidations = [{
            id: 1
        }, {
            fieldAttributeMasterId: 1,
            validation: 'test'
        }]

        let fieldAttributeValidationConditions = [{
            fieldAttributeMasterValidationId: 1,
            validation: 'test'
        }]
        let result = {
            1: [{
                fieldAttributeMasterValidationId: 1,
                validation: 'test'
            }]
        }
        expect(formLayoutService.getFieldAttributeValidationConditionMap(fieldAttributeValidationConditions, fieldAttributeMasterValidations)).toEqual(result)
    })
})

describe('test cases for getFormLayoutSortedObject', () => {

    it('should return empty map for null attributes list', () => {
        let result = { formLayoutObject: new Map(), isSaveDisabled: false, noFieldAttributeMappedWithStatus: true }
        expect(formLayoutService.getFormLayoutSortedObject()).toEqual(result)
    })

    it('should return formlayout object', () => {
        let sequenceWiseSortedFieldAttributesForStatus = [{
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "d",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            id: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: true,
            validation: [],
            dataStoreMasterId: undefined,
            dataStoreAttributeId: undefined,
            dataStoreFilterMapping: undefined
        }, {
            label: "ds",
            subLabel: "d",
            helpText: "w",
            key: "dd",
            required: false,
            hidden: true,
            attributeTypeId: 1,
            id: 2,
            positionId: 0,
            parentId: 0,
            showHelpText: true,
            editable: false,
            focus: false,
            validation: [],
            dataStoreMasterId: undefined,
            dataStoreAttributeId: undefined,
            dataStoreFilterMapping: undefined
        }]
        let formLayoutObject = new Map()
        formLayoutObject.set(1, {
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "d",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 1,
            parentId: 0,
            showHelpText: false,
            editable: true,
            focus: true,
            validation: null,
            dataStoreMasterId: undefined,
            dataStoreAttributeId: undefined,
            dataStoreFilterMapping: undefined,
            externalDataStoreMasterUrl: undefined,
            sequenceMasterId: undefined

        }).set(2, {
            label: "ds",
            subLabel: "d",
            helpText: "w",
            key: "dd",
            required: false,
            hidden: true,
            attributeTypeId: 1,
            fieldAttributeMasterId: 2,
            positionId: 2,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: false,
            validation: null,
            dataStoreMasterId: undefined,
            dataStoreAttributeId: undefined,
            dataStoreFilterMapping: undefined,
            externalDataStoreMasterUrl: undefined,
            sequenceMasterId: undefined
        });

        let result = {
            formLayoutObject, isSaveDisabled: true, noFieldAttributeMappedWithStatus: false, latestPositionId: 2
        }
        expect(formLayoutService.getFormLayoutSortedObject(sequenceWiseSortedFieldAttributesForStatus, {}, {}, null, 0)).toEqual(result)
    })
})

describe('test cases for concatFormElementForTransientStatus', () => {

    it('should return concatenated form element', () => {
        let formElement = new Map()
        formElement.set(1, {
            fieldAttributeMasterId: 1
        })

        let formElement2 = new Map()
        formElement.set(2, {
            fieldAttributeMasterId: 2
        })
        let navig = {
            0: {
                formElement: formElement2
            }
        }
        let result = new Map()
        result.set(1, {
            fieldAttributeMasterId: 1
        })
        result.set(2, {
            fieldAttributeMasterId: 2
        })
        expect(formLayoutService.concatFormElementForTransientStatus(navig, formElement)).toEqual(result)
    })
})

describe('test cases for checkUniqueValidation', () => {

    it('should return false', () => {
        let fieldAttributeMaster = {
            attributeTypeId: 20
        }
        expect(formLayoutService.checkUniqueValidation(fieldAttributeMaster)).toEqual(false)
    })

    it('should return true for validation existing', () => {
        let fieldAttributeMaster = {
            attributeTypeId: 1
        }
        dataStoreService.checkForUniqueValidation = jest.fn()
        dataStoreService.checkForUniqueValidation.mockReturnValue(true)
        expect(formLayoutService.checkUniqueValidation(fieldAttributeMaster)).toEqual(true)
    })

})

describe('test cases for getLatestPositionIdForJobTransaction', () => {

    it('should return position id', () => {
        realm.getMaxValueOfProperty = jest.fn()
        expect(formLayoutService.getLatestPositionIdForJobTransaction({ id: 1 })).toEqual(0)
    })

    it('should return position id from db', () => {
        realm.getMaxValueOfProperty = jest.fn()
        realm.getMaxValueOfProperty.mockReturnValue(1)
        expect(formLayoutService.getLatestPositionIdForJobTransaction([{ jobTransactionId: 1 }])).toEqual(1)
    })
})

// describe('test cases for isFormValid', () => {

//     it('should return position id', () => {
//         realm.getMaxValueOfProperty = jest.fn()
//         expect(formLayoutService.getLatestPositionIdForJobTransaction({ id: 1 })).toEqual(0)
//     })

//     it('should return position id from db', () => {
//         realm.getMaxValueOfProperty = jest.fn()
//         realm.getMaxValueOfProperty.mockReturnValue(1)
//         expect(formLayoutService.getLatestPositionIdForJobTransaction([{ jobTransactionId: 1 }])).toEqual(1)
//     })
// })