
import { dataStoreService } from '../classes/DataStoreService'
import {
    REMARKS,
    MINMAX,
    SPECIAL
} from '../../lib/constants'
import RestAPIFactory from '../../lib/RestAPIFactory'
import * as realm from '../../repositories/realmdb'
import moment from 'moment'
import { keyValueDBService } from '../classes/KeyValueDBService';

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
            value: 'xyz',
            displayValue: 'xyz'
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
            value: '123456',
            displayValue: '123456'
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
                _id: '_1234',
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

describe('test checkForUniqueValidation', () => {

    it('should throw fieldAttributeValue missing error', () => {
        const message = 'fieldAttributeValue missing in currentElement'
        try {
            dataStoreService.checkForUniqueValidation(null, 123)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw FieldAttributeMasterId missing error', () => {
        const message = 'fieldAttributeMasterId missing in currentElement'
        try {
            dataStoreService.checkForUniqueValidation('abhi', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return true as fieldAttributeValue is present is FieldData Table', () => {
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{
            fieldAttributeMasterId: 123,
            id: 234,
            jobTransactionId: 2345,
            parentId: 0,
            positionId: 0,
            value: 'abhi'
        }]);
        expect(dataStoreService.checkForUniqueValidation('abhi', 123)).toEqual(true)
    })

    it('should return false as fieldAttributeValue is not present is FieldData Table', () => {
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{
            fieldAttributeMasterId: 123,
            id: 234,
            jobTransactionId: 2345,
            parentId: 0,
            positionId: 0,
            value: 'abhi'
        }]);
        expect(dataStoreService.checkForUniqueValidation('xyz', 989)).toEqual(false)
    })
})


describe('test getFieldAttribute', () => {

    it('should throw fieldAttributes missing error', () => {
        const message = 'fieldAttributes missing'
        try {
            dataStoreService.getFieldAttribute(null, 123)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw fieldAttributeMasterId missing error', () => {
        const message = 'fieldAttributeMasterId missing'
        try {
            dataStoreService.getFieldAttribute('abhi', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return FieldAttribuute', () => {
        const fieldAttributes = [{
            id: 123
        }, {
            id: 456
        }]
        const fieldAttributeMasterId = 123
        expect(dataStoreService.getFieldAttribute(fieldAttributes, fieldAttributeMasterId)).toEqual([{ id: 123 }])
    })
})


describe('test getJobAttribute', () => {

    it('should throw jobAttributes missing error', () => {
        const message = 'jobAttributes missing'
        try {
            dataStoreService.getJobAttribute(null, 123)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw jobAttributeMasterId missing error', () => {
        const message = 'jobAttributeMasterId missing'
        try {
            dataStoreService.getJobAttribute('abhi', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return JobAttribute', () => {
        const jobAttributes = [{
            id: 123
        }, {
            id: 456
        }]
        const jobAttributeMasterId = 123
        expect(dataStoreService.getFieldAttribute(jobAttributes, jobAttributeMasterId)).toEqual([{ id: 123 }])
    })
})



describe('test fetchDataStoreMaster', () => {
    it('should return jsonResponse', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        dataStoreService.fetchDataStoreMaster('token')
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })

    it('should throw Token missing error', () => {
        const message = 'Token Missing'
        try {
            dataStoreService.fetchDataStoreMaster(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})


describe('test fetchDataStore', () => {
    it('should return jsonResponse', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        dataStoreService.fetchDataStore(1, 123, '22/08/2017', 0)
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })

    it('should throw Token missing error', () => {
        const message = 'Token Missing'
        try {
            dataStoreService.fetchDataStore(null, 123, '22/08/2017', 0)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw datastoreMasterId missing error', () => {
        const message = 'datastoreMasterId missing'
        try {
            dataStoreService.fetchDataStore(1, null, '22/08/2017', 0)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})


describe('test getDataStoreMasterIdMappedWithFieldAttribute', () => {
    it('should throw fieldAttributes missing error', () => {
        const message = 'fieldAttributes missing'
        try {
            dataStoreService.getDataStoreMasterIdMappedWithFieldAttribute(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return dataStoreMasterIdList', () => {
        const fieldAttributes = [{
            dataStoreMasterId: 123,
            attributeTypeId: 44
        }, {
            dataStoreMasterId: 234,
            attributeTypeId: 62
        }]
        const dataStoreMasterIdList = [123]
        expect(dataStoreService.getDataStoreMasterIdMappedWithFieldAttribute(fieldAttributes)).toEqual(dataStoreMasterIdList)
    })
})


describe('test getDataStoreMasterList', () => {
    it('should throw dataStoreMasterjsonResponse missing error', () => {
        const message = 'dataStoreMasterjsonResponse missing'
        try {
            dataStoreService.getDataStoreMasterList(null, 123)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw dataStoreMasterIdList missing error', () => {
        const message = 'dataStoreMasterIdList missing'
        try {
            dataStoreService.getDataStoreMasterList(123, null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return dataStoreMasterIdList', () => {
        const dataStoreMasterjsonResponse = [{
            dsMasterId: 123,
            attributeTypeId: 22,
            key: 'test',
            label: 'test',
            searchIndex: true,
            uniqueIndex: false,
            dsMasterTitle: 'test'
        }, {
            dsMasterId: 233,
            attributeTypeId: 12,
            key: 'test1',
            label: 'test1',
            searchIndex: false,
            uniqueIndex: true,
            dsMasterTitle: 'test1'
        }]
        const dataStoreMasterIdList = [123]
        const returnParams = {
            dataStoreIdVSTitleMap: {
                '123': 'test'
            },
            dataStoreMasterList: [{
                attributeTypeId: 22,
                datastoreMasterId: 123,
                id: 0,
                key: 'test',
                label: 'test',
                lastSyncTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                searchIndex: true,
                uniqueIndex: false,
            }]
        }
        expect(dataStoreService.getDataStoreMasterList(dataStoreMasterjsonResponse, dataStoreMasterIdList)).toEqual(returnParams)
    })
})

describe('test getLastSyncTimeInFormat', () => {
    it('should throw dataStoreMasterjsonResponse missing error', () => {
        const message = 'lastSyncTime not present'
        try {
            dataStoreService.getLastSyncTimeInFormat(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
})

describe('test getDataStoreMasters', () => {
    it('should throw Token missing error', () => {
        const message = 'Token Missing'
        try {
            dataStoreService.getDataStoreMasters(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return dataStoreIdVSTitleMap', () => {
        const dataStoreMasterjsonResponse = [{
            dsMasterId: 123,
            attributeTypeId: 22,
            key: 'test',
            label: 'test',
            searchIndex: true,
            uniqueIndex: false,
            dsMasterTitle: 'test'
        }, {
            dsMasterId: 233,
            attributeTypeId: 12,
            key: 'test1',
            label: 'test1',
            searchIndex: false,
            uniqueIndex: true,
            dsMasterTitle: 'test1'
        }]
        const dataStoreMasterIdList = [123]
        const fieldAttributes = [{ attributeTypeId: 44, dataStoreMasterId: 123 }]
        const returnParams = {
            dataStoreIdVSTitleMap: {
                '123': 'test'
            },
            dataStoreMasterList: [{
                attributeTypeId: 22,
                datastoreMasterId: 123,
                id: 0,
                key: 'test',
                label: 'test',
                lastSyncTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                searchIndex: true,
                uniqueIndex: false,
            }]
        }

        dataStoreService.fetchDataStoreMaster = jest.fn()
        dataStoreService.fetchDataStoreMaster.mockReturnValue({ status: 200, json: dataStoreMasterjsonResponse })
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(fieldAttributes)
        dataStoreService.getDataStoreMasterIdMappedWithFieldAttribute = jest.fn()
        dataStoreService.getDataStoreMasterIdMappedWithFieldAttribute.mockReturnValue(dataStoreMasterIdList)
        realm.deleteSpecificTableRecords = jest.fn()
        dataStoreService.getDataStoreMasterList = jest.fn()
        dataStoreService.getDataStoreMasterList.mockReturnValue(returnParams)
        realm.performBatchSave = jest.fn()
        dataStoreService.getDataStoreMasters('temp_token').then(() => {
            expect(dataStoreService.fetchDataStoreMaster).toHaveBeenCalledTimes(1)
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(dataStoreService.getDataStoreMasterIdMappedWithFieldAttribute).toHaveBeenCalledTimes(1)
            expect(realm.deleteSpecificTableRecords).toHaveBeenCalledTimes(1)
            expect(dataStoreService.getDataStoreMasterList).toHaveBeenCalledTimes(1)
            expect(realm.performBatchSave).toHaveBeenCalledTimes(1)
            expect(result).toEqual(returnParams.dataStoreIdVSTitleMap)
        })
    })
})



describe('test fetchDatastoreAndSaveInDB', () => {
    it('should throw Token missing error', () => {
        const message = 'Token Missing'
        try {
            dataStoreService.fetchDatastoreAndSaveInDB(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw datastoreMasterId missing error', () => {
        const message = 'datastoreMasterId missing'
        try {
            dataStoreService.fetchDatastoreAndSaveInDB('temp', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })


    it('should return totalElements && numberOfElements', () => {
        const dataStoreJsonResponse = {
            content: [{
                id: 123,
                dataStoreAttributeValueMap: {
                    temp_name: 'temp'
                }
            }, {
                id: 1234,
                dataStoreAttributeValueMap: {
                    temp_name: 'temp'
                }
            }],
            totalElements: 5000,
            numberOfElements: 500
        }
        dataStoreService.fetchDataStore = jest.fn()
        dataStoreService.fetchDataStore.mockReturnValue({ status: 200, json: dataStoreJsonResponse })
        dataStoreService.saveDataStoreToDB = jest.fn()
        dataStoreService.fetchDatastoreAndSaveInDB('temp_token').then(() => {
            expect(dataStoreService.fetchDataStore).toHaveBeenCalledTimes(1)
            expect(dataStoreService.saveDataStoreToDB).toHaveBeenCalledTimes(1)
            expect(result).toEqual({
                totalElements: dataStoreJsonResponse.totalElements,
                numberOfElements: dataStoreJsonResponse.numberOfElements
            })
        })
    })
})

function getMapFromObject(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}