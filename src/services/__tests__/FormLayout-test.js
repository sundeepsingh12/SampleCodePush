'use strict'

import { formLayoutService } from '../classes/formLayout/FormLayout'
import { dataStoreService } from '../classes/DataStoreService'
import { fieldValidationService } from '../classes/FieldValidation'
import * as realm from '../../repositories/realmdb'
import { draftService } from '../classes/DraftService';
import { formLayoutEventsInterface } from '../classes/formLayout/FormLayoutEventInterface';
import { transientStatusAndSaveActivatedService } from '../classes/TransientStatusAndSaveActivatedService'
import { keyValueDBService } from '../classes/KeyValueDBService'
import { geoFencingService } from '../classes/GeoFencingService'
import { transactionCustomizationService } from '../classes/TransactionCustomization'

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
describe('test cases for getFieldAttributeObject', () => {
    let formElement = {
        label: "ds",
        subLabel: "d",
        helpText: "w",
        key: "dd",
        required: false,
        hidden: true,
        attributeTypeId: 1,
        fieldAttributeMasterId: undefined,
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
    }
    it('should return fieldAttribute Object', () => {
        expect(formLayoutService.getFieldAttributeObject(formElement, [], 2)).toEqual(formElement)
    })
})

describe('test cases for getFormLayoutSortedObject', () => {
    beforeEach(() => {
        formLayoutService.getFieldAttributeObject = jest.fn()
    })
    it('should return empty map for null attributes list', () => {
        let result = { formLayoutObject: {}, isSaveDisabled: false, noFieldAttributeMappedWithStatus: true }
        expect(formLayoutService.getFormLayoutSortedObject(null, null, 0, [])).toEqual(result)
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
        let formLayoutObject = {
            1: {
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

            }, 2: {
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
            }
        };
        let fieldAttributesMappedToStatus = [{ fieldAttributeId: 1 }, { fieldAttributeId: 2 }]
        let fieldAttributeMap = {
            1: {
                id: 1, parentId: null
            }, 2: {
                id: 2, parentId: null
            }
        }
        let fieldAttributeMasterValidationMap = { 1: [{ id: 1 }, { id: 2 }] }
        let fieldAttrMasterValidationConditionMap = { 1: {}, 2: {} }
        let result =
        {
            "fieldAttributeMasterParentIdMap":
                { "1": null, "2": null },
            "formLayoutObject":
                { "1": undefined, "2": undefined },
            "isSaveDisabled": false, "latestPositionId": 2,
            "noFieldAttributeMappedWithStatus": false,
            "sequenceWiseSortedFieldAttributesMasterIds": [1, 2]
        }

        expect(formLayoutService.getFormLayoutSortedObject(fieldAttributeMasterValidationMap, fieldAttrMasterValidationConditionMap, 0, fieldAttributesMappedToStatus, fieldAttributeMap, false)).toEqual(result)
    })
})

describe('test cases for concatFormElementForTransientStatus', () => {

    it('should return concatenated form element', () => {
        let formElement = {
            1: {
                fieldAttributeMasterId: 1
            }
        }

        let formElement2 = {
            2: {
                fieldAttributeMasterId: 2
            }
        }
        let navig = {
            0: {
                formElement: formElement2
            }
        }
        let result = { 1: { fieldAttributeMasterId: 1 }, 2: { fieldAttributeMasterId: 2 } }
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
        realm.getMaxValueOfProperty.mockReturnValue(2)
        expect(formLayoutService.getLatestPositionIdForJobTransaction({ id: 1 })).toEqual(2)
    })

    it('should return position id from db', () => {
        realm.getMaxValueOfProperty = jest.fn()
        realm.getMaxValueOfProperty.mockReturnValue(1)
        expect(formLayoutService.getLatestPositionIdForJobTransaction([{ jobTransactionId: 1 }])).toEqual(1)
    })
})

describe('test cases for isFormValid', () => {
    beforeEach(() => {
        fieldValidationService.fieldValidations = jest.fn()
        formLayoutService.checkUniqueValidation = jest.fn()
    })
    let formLayoutObject = {
        1: {
            required: true,
            attributeTypeId: 1,
            value: null,
            displayValue: 2
        }
    };
    it('should throw error', () => {
        try {
            expect(formLayoutService.isFormValid(null, { id: 1 })).toEqual({ isFormValid: false, formElement: formLayoutObject })
        } catch (error) {
            expect(error.message).toEqual("formElement is missing")
        }
    })
    it('should check for is formValid and return true', () => {
        let data = {
            1: {
                required: true,
                attributeTypeId: 1,
                value: 2,
                displayValue: 2
            }
        };
        fieldValidationService.fieldValidations.mockReturnValueOnce(true)
        formLayoutService.checkUniqueValidation.mockReturnValueOnce(false)
        expect(formLayoutService.isFormValid(formLayoutObject, { id: 1 })).toEqual({ isFormValid: true, formElement: data })
    })

    it('should check for is formValid in case of null value', () => {
        fieldValidationService.fieldValidations.mockReturnValueOnce(false)
        formLayoutService.checkUniqueValidation.mockReturnValueOnce(true)
        expect(formLayoutService.isFormValid(formLayoutObject, { id: 1 })).toEqual({ isFormValid: false, formElement: formLayoutObject })
    })

    it('should check for is formValid in case of FIXED_SKU_QUANTITY ', () => {
        formLayoutObject = {
            1: {
                required: false,
                attributeTypeId: 6,
                value: 'abc',
                displayValue: 'abc'
            }
        };
        fieldValidationService.fieldValidations.mockReturnValueOnce(true)
        formLayoutService.checkUniqueValidation.mockReturnValueOnce(false)
        expect(formLayoutService.isFormValid(formLayoutObject, { id: 1 })).toEqual({ isFormValid: false, formElement: formLayoutObject })
    })
    it('should check for is formValid in case of FIXED_SKU_UNIT_PRICE', () => {
        formLayoutObject = {
            1: {
                required: false,
                attributeTypeId: 13,
                value: 'abc',
                displayValue: 'abc'
            }
        };
        fieldValidationService.fieldValidations.mockReturnValueOnce(true)
        formLayoutService.checkUniqueValidation.mockReturnValueOnce(false)
        expect(formLayoutService.isFormValid(formLayoutObject, { id: 1 })).toEqual({ isFormValid: false, formElement: formLayoutObject })
    })
})

describe('test cases for save and navigate to container', () => {
    beforeEach(() => {
        transientStatusAndSaveActivatedService.getCurrentStatus = jest.fn()
        transientStatusAndSaveActivatedService.getDataFromFormElement = jest.fn()
        transientStatusAndSaveActivatedService.calculateTotalAmount = jest.fn()
        formLayoutService.concatFormElementForTransientStatus = jest.fn()
        transientStatusAndSaveActivatedService.saveDataInDbAndAddTransactionsToSyncList = jest.fn()
        draftService.deleteDraftFromDb = jest.fn()
        formLayoutEventsInterface.addTransactionsToSyncList = jest.fn()
        formLayoutEventsInterface.saveDataInDb = jest.fn()
        keyValueDBService.validateAndSaveData = jest.fn()
        geoFencingService.addNewGeoFenceAndDeletePreviousFence = jest.fn()
    })
    let jobMasterId = 1, contactData = 1, jobTransaction = { id: 1 }, currentStatus = { saveActivated: true }
    let navigationFormLayoutStates = null, previousStatusSaveActivated = false, statusList = {}, taskListScreenDetails = { jobDetailsScreenKey: 1, pageObjectAdditionalParams: 1 }
    it('should save data and navigate to saveActivated container', () => {
        transientStatusAndSaveActivatedService.getCurrentStatus.mockReturnValueOnce(currentStatus)
        let formLayoutState = { jobTransactionId: -1, statusId: 1 }
        return formLayoutService.saveAndNavigate(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList, taskListScreenDetails).then(data => {
            expect(data).toEqual({
                routeName: 'SaveActivated',
                routeParam: {
                    formLayoutState, contactData, currentStatus, jobTransaction, jobMasterId, navigationFormLayoutStates
                }
            })
            expect(transientStatusAndSaveActivatedService.getCurrentStatus).toHaveBeenCalledTimes(1)
        })
    })
    it('should save data and navigate to transient container', () => {
        currentStatus = { transient: true }
        transientStatusAndSaveActivatedService.getCurrentStatus.mockReturnValueOnce(currentStatus)
        let formLayoutState = { jobTransactionId: -1, statusId: 1 }

        return formLayoutService.saveAndNavigate(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList, taskListScreenDetails).then(data => {
            expect(data).toEqual({
                routeName: 'Transient',
                routeParam: {
                    formLayoutState, contactData, currentStatus, jobTransaction, jobMasterId, jobDetailsScreenKey: 1, pageObjectAdditionalParams: 1
                }
            })
            expect(transientStatusAndSaveActivatedService.getCurrentStatus).toHaveBeenCalledTimes(1)
        })
    })
    it('should save data and navigate to CheckoutDetails container', () => {
        previousStatusSaveActivated = {
            commonData: { commonData: {}, amount: 10 },
            recurringData: {}
        }
        navigationFormLayoutStates = {}
        transientStatusAndSaveActivatedService.getCurrentStatus.mockReturnValueOnce({ saveActivated: false })
        transientStatusAndSaveActivatedService.getDataFromFormElement.mockReturnValueOnce({ elementsArray: [], amount: 10 })
        transientStatusAndSaveActivatedService.calculateTotalAmount.mockReturnValueOnce(20)
        formLayoutService.concatFormElementForTransientStatus.mockReturnValueOnce({})
        let formLayoutState = { jobTransactionId: -1, statusId: 1 }
        return formLayoutService.saveAndNavigate(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList, taskListScreenDetails).then(data => {
            expect(data).toEqual({
                routeName: 'CheckoutDetails',
                routeParam: { "commonData": {}, "jobMasterId": 1, "recurringData": {}, "signOfData": [], "totalAmount": 20 }
            })
            expect(transientStatusAndSaveActivatedService.getCurrentStatus).toHaveBeenCalledTimes(1)
        })
    })
    it('should save data and navigate to TabScreen', () => {
        previousStatusSaveActivated = {
            commonData: { commonData: {}, amount: 10 },
            recurringData: {}
        }
        navigationFormLayoutStates = {}
        transientStatusAndSaveActivatedService.getCurrentStatus.mockReturnValueOnce({ saveActivated: false })
        formLayoutService.concatFormElementForTransientStatus.mockReturnValueOnce({})
        formLayoutEventsInterface.saveDataInDb.mockReturnValueOnce({})
        let formLayoutState = { jobTransactionId: 1, statusId: 1, formElement: {} }
        return formLayoutService.saveAndNavigate(formLayoutState, jobMasterId, contactData, jobTransaction, navigationFormLayoutStates, previousStatusSaveActivated, statusList, taskListScreenDetails).then(data => {
            expect(data).toEqual({
                routeName: 'TabScreen',
                routeParam: {}
            })
            expect(transientStatusAndSaveActivatedService.getCurrentStatus).toHaveBeenCalledTimes(1)
        })
    })
})

describe('test cases for get sequence wise sorted fieldAttribute', () => {
    beforeEach(() => {
        transactionCustomizationService.getFormLayoutParameters = jest.fn()
        formLayoutService.getFieldAttributeValidationMap = jest.fn()
        formLayoutService.getFieldAttributeValidationConditionMap = jest.fn()
        formLayoutService.getLatestPositionIdForJobTransaction = jest.fn()
        formLayoutService.getFormLayoutSortedObject = jest.fn()
    })
    let jobTransaction = { id: 1 }
    let fieldAttributes = [{ parentId: 1, attributeTypeId: 11, id: 1 }, { parentId: 1, attributeTypeId: 1, id: 2 }]
    let jobAttributes = null, user = null, hub = null, fieldAttributeStatusList = [{ statusId: 1, sequence: 1 }, { statusId: 1, sequence: 3 }, { statusId: 2, sequence: 1 }, { statusId: 1, sequence: 3 }]
    let fieldAttributeMasterValidation = null, fieldAttributeValidationCondition = null
    it('should throw statusId missing error', () => {
        return formLayoutService.getSequenceWiseRootFieldAttributes(null, 1, jobTransaction, 0).then(data => {
        }).catch(error => {
            expect(error.message).toEqual('Missing statusId')
        })
    })
    it('should throw fieldAttributes missing error', () => {
        transactionCustomizationService.getFormLayoutParameters.mockReturnValueOnce({ fieldAttributes: null, jobAttributes, user, hub, fieldAttributeStatusList, fieldAttributeMasterValidation, fieldAttributeValidationCondition })
        return formLayoutService.getSequenceWiseRootFieldAttributes(1, 1, jobTransaction, 0).then(data => {
        }).catch(error => {
            expect(error.message).toEqual('Value of fieldAttributes or fieldAttribute Status missing')
        })
    })
    it('should return empty list', () => {
        transactionCustomizationService.getFormLayoutParameters.mockReturnValueOnce({ fieldAttributes, jobAttributes, user, hub, fieldAttributeStatusList, fieldAttributeMasterValidation, fieldAttributeValidationCondition })
        return formLayoutService.getSequenceWiseRootFieldAttributes(5, 1, jobTransaction, 0).then(data => {
            expect(data).toEqual([])
        }).catch(error => {
            expect(error.message).toEqual('Value of fieldAttributes or fieldAttribute Status missing')
        })
    })
    it('should return sorted formLayoutObject in case of array', () => {
        transactionCustomizationService.getFormLayoutParameters.mockReturnValueOnce({ fieldAttributes, jobAttributes, user, hub, fieldAttributeStatusList, fieldAttributeMasterValidation, fieldAttributeValidationCondition })
        formLayoutService.getFieldAttributeValidationMap.mockReturnValueOnce({})
        formLayoutService.getFieldAttributeValidationConditionMap.mockReturnValueOnce({})
        formLayoutService.getLatestPositionIdForJobTransaction.mockReturnValueOnce(1)
        formLayoutService.getFormLayoutSortedObject.mockReturnValueOnce({})
        let object = { "arrayMainObject": { "attributeTypeId": 11, "id": 1, "parentId": 1 } }

        return formLayoutService.getSequenceWiseRootFieldAttributes(1, true, jobTransaction, null).then(data => {
            expect(data).toEqual(object)
        }).catch(error => {
            expect(error.message).toEqual('Value of fieldAttributes or fieldAttribute Status missing')
        })
    })
    it('should return sorted formLayoutObject in case of formLayout', () => {
        transactionCustomizationService.getFormLayoutParameters.mockReturnValueOnce({ fieldAttributes, jobAttributes, user, hub, fieldAttributeStatusList, fieldAttributeMasterValidation, fieldAttributeValidationCondition })
        formLayoutService.getFieldAttributeValidationMap.mockReturnValueOnce({})
        formLayoutService.getFieldAttributeValidationConditionMap.mockReturnValueOnce({})
        formLayoutService.getLatestPositionIdForJobTransaction.mockReturnValueOnce(1)
        formLayoutService.getFormLayoutSortedObject.mockReturnValueOnce({})
        let result = { "jobAndFieldAttributesList": { "fieldAttributes": [{ "attributeTypeId": 11, "id": 1, "parentId": 1 }, { "attributeTypeId": 1, "id": 2, "parentId": 1 }], "hub": null, "jobAttributes": null, "user": null } }

        return formLayoutService.getSequenceWiseRootFieldAttributes(1, false, jobTransaction, 1).then(data => {
            expect(data).toEqual(result)
        }).catch(error => {
            expect(error.message).toEqual('Value of fieldAttributes or fieldAttribute Status missing')
        })
    })
})