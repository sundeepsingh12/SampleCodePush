
import { dataStoreService } from '../classes/DataStoreService'
const {
    REMARKS,
    MINMAX,
    SPECIAL
} = require('../../lib/constants').default
import RestAPIFactory from '../../lib/RestAPIFactory'
import * as realm from '../../repositories/realmdb'

describe('test getValidationsArray', () => {
    it('should return validation array having all validations', () => {
        const validationArray = [{
            timeOfExecution: REMARKS,
            condition: 'true'
        },
        {
            timeOfExecution: REMARKS,
            condition: 'false'
        },
        {
            timeOfExecution: MINMAX,
            condition: 'true'
        },
        {
            timeOfExecution: SPECIAL,
            condition: 'true'
        }]

        const validationsResult = {
            isScannerEnabled: true,
            isAutoStartScannerEnabled: false,
            isSearchEnabled: true,
            isMinMaxValidation: true
        }
        expect(dataStoreService.getValidations(validationArray)).toEqual(validationsResult)
    })

    it('should return empty Object', () => {
        const validationArray = [{
            condition: 'true'
        }]

        const validationsResult = {}
        expect(dataStoreService.getValidations(validationArray)).toEqual(validationsResult)
    })
})

describe('test fillKeysInFormElement', () => {
    const formLayoutObject = {
        1: {
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "name",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: false,
            validation: []
        },
        2: {
            label: "ds",
            subLabel: "d",
            helpText: "w",
            key: "contact",
            required: true,
            hidden: true,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: true,
            editable: false,
            focus: false,
            validation: []
        }
    }

    const formLayoutMap = getMapFromObject(formLayoutObject);

    const formLayoutResultObject = {
        1: {
            label: "rr",
            subLabel: "d",
            helpText: "d",
            key: "name",
            required: true,
            hidden: false,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: false,
            editable: false,
            focus: false,
            validation: [],
            value: 'xyz'
        },
        2: {
            label: "ds",
            subLabel: "d",
            helpText: "w",
            key: "contact",
            required: true,
            hidden: true,
            attributeTypeId: 1,
            fieldAttributeMasterId: 1,
            positionId: 0,
            parentId: 0,
            showHelpText: true,
            editable: false,
            focus: false,
            validation: [],
            value: '123456'
        }
    }
    const formLayoutMapResult = getMapFromObject(formLayoutResultObject);

    const dataStoreAttributeValueMap = {
        name: 'xyz',
        contact: '123456',
    }

    const unmatchedDataStoreAttributeValueMap = {
        a: 'abc',
        b: 'pqr'
    }

    it('should return FormElement having mapped value set for mapped keys with dataStoreAttributeValueMap', () => {
        expect(dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formLayoutMap)).toEqual(formLayoutMapResult)
    })

    it('should return same FormElement', () => {
        expect(dataStoreService.fillKeysInFormElement(unmatchedDataStoreAttributeValueMap, formLayoutMap)).toEqual(formLayoutMap)
    })

    it('should throw dataStoreAttributeValueMap missing error', () => {
        const message = 'dataStoreAttributeValueMap not present'
        try {
            dataStoreService.fillKeysInFormElement(null, {
                name: 'abc'
            })
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw FormElements missing error', () => {
        const message = 'formElements not present'
        try {
            dataStoreService.fillKeysInFormElement({
                name: 'abc'
            }, null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})

describe('test fetchJsonForDS', () => {
    it('should return jsonResponse', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        dataStoreService.fetchJsonForDS(1, 'abhi', 123, 234)
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })

    it('should throw Token missing error', () => {
        const message = 'Token Missing'
        try {
            dataStoreService.fetchJsonForDS(null, 'abhi', 123, 234)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw DataStoreMasterAttributeId missing error', () => {
        const message = 'DataStoreMasterAttributeId missing in currentElement'
        try {
            dataStoreService.fetchJsonForDS(1, 'abhi', 123, null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw DataStoreMasterId missing error', () => {
        const message = 'DataStoreMasterId missing in currentElement'
        try {
            dataStoreService.fetchJsonForDS(1, 'abhi', null, 234)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw Search Text missing error', () => {
        const message = 'Search Text not present'
        try {
            dataStoreService.fetchJsonForDS(1, null, 123, 234)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})

describe('test getDataStoreAttrValueMapFromJson', () => {

    const dataStoreResponse = {
        items: [{
            matchKey: 'name',
            uniqueKey: 'contact',
            details: {
                dataStoreAttributeValueMap: {
                    _id: '_1234',
                    name: 'temp_name',
                    contact: 'temp_contact'
                }
            }
        }]
    }

    const attrValueMap = {
        '0': {
            id: '0',
            matchKey: 'name',
            uniqueKey: 'contact',
            dataStoreAttributeValueMap: {
                name: 'temp_name',
                contact: 'temp_contact'
            }
        }
    }

    it('should return DataStoreAttrValueMap', () => {
        expect(dataStoreService.getDataStoreAttrValueMapFromJson(dataStoreResponse)).toEqual(attrValueMap)
    })

    it('should throw DataStoreResponse missing error', () => {
        const message = 'DataStoreResponse is missing'
        try {
            dataStoreService.getDataStoreAttrValueMapFromJson(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})

describe('test fetchJsonForExternalDS', () => {
    it('should return jsonResponse', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        dataStoreService.fetchJsonForExternalDS(1, 'abhi', 123, 234)
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })

    it('should throw Token missing error', () => {
        const message = 'Token Missing'
        try {
            dataStoreService.fetchJsonForExternalDS(null, 'abhi', 123, 234)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw ExternalDataStoreUrl missing error', () => {
        const message = 'ExternalDataStoreUrl missing in currentElement'
        try {
            dataStoreService.fetchJsonForExternalDS(1, 'abhi', null, 123)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw AttributeKey missing error', () => {
        const message = 'AttributeKey missing in currentElement'
        try {
            dataStoreService.fetchJsonForExternalDS(1, 'abhi', 234, null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw Search Text missing error', () => {
        const message = 'Search Text not present'
        try {
            dataStoreService.fetchJsonForExternalDS(1, null, 123, 234)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})

describe('test dataStoreValuePresentInFieldData', () => {

    it('should throw DataStorevalue missing error', () => {
        const message = 'dataStorevalue missing in currentElement'
        try {
            dataStoreService.dataStoreValuePresentInFieldData(null, 123)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw FieldAttributeMasterId missing error', () => {
        const message = 'fieldAttributeMasterId missing in currentElement'
        try {
            dataStoreService.dataStoreValuePresentInFieldData('abhi', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return true as dataStoreValue is present is FieldData Table', () => {
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{
            fieldAttributeMasterId: 123,
            id: 234,
            jobTransactionId: 2345,
            parentId: 0,
            positionId: 0,
            value: 'abhi'
        }]);
        expect(dataStoreService.dataStoreValuePresentInFieldData('abhi', 123)).toEqual(true)
    })

    it('should return false as dataStoreValue is not present is FieldData Table', () => {
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{
            fieldAttributeMasterId: 123,
            id: 234,
            jobTransactionId: 2345,
            parentId: 0,
            positionId: 0,
            value: 'abhi'
        }]);
        expect(dataStoreService.dataStoreValuePresentInFieldData('xyz', 989)).toEqual(false)
    })
})


function getMapFromObject(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}