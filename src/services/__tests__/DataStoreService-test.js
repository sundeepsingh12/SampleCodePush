
import { dataStoreService } from '../classes/DataStoreService'
const {
    REMARKS,
    MINMAX,
    SPECIAL
} = require('../../lib/constants').default
import RestAPIFactory from '../../lib/RestAPIFactory'

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
            isAllowFromField: true
        }
        expect(dataStoreService.getValidations(validationArray)).toEqual(validationsResult)
    })

    it('should throw Validation Array missing error', () => {
        const message = 'Validation Array Missing'
        try {
            dataStoreService.getValidations(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
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

    it('should return formElement having mapped value set for mapped keys with dataStoreAttributeValueMap', () => {
        expect(dataStoreService.fillKeysInFormElement(dataStoreAttributeValueMap, formLayoutMap)).toEqual(formLayoutMapResult)
    })

    it('should return same formElement', () => {
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

    it('should throw formElements missing error', () => {
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

describe('test fetchJson', () => {
    it('should return jsonResponse', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        dataStoreService.fetchJson(1, 'abhi', 123, 234)
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })

    it('should throw token missing error', () => {
        const message = 'Token Missing'
        try {
            dataStoreService.fetchJson(null, 'abhi', 123, 234)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should throw DataStoreMasterAttributeId missing error', () => {
        const message = 'DataStoreMasterAttributeId missing in currentElement'
        try {
            dataStoreService.fetchJson(1, 'abhi', 123, null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should throw DataStoreMasterId missing error', () => {
        const message = 'DataStoreMasterId missing in currentElement'
        try {
            dataStoreService.fetchJson(1, 'abhi', null, 234)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should throw Search Text missing error', () => {
        const message = 'Search Text not present'
        try {
            dataStoreService.fetchJson(1, null, 123, 234)
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

    it('should return dataStoreAttrValueMap', () => {
        expect(dataStoreService.getDataStoreAttrValueMapFromJson(dataStoreResponse)).toEqual(attrValueMap)
    })

    it('should throw dataStoreResponse missing error', () => {
        const message = 'dataStoreResponse is missing'
        try {
            dataStoreService.getDataStoreAttrValueMapFromJson(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})

function getMapFromObject(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}