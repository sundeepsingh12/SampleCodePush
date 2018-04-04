
import { dataStoreService } from '../classes/DataStoreService'
import {
    REMARKS,
    MINMAX,
    SPECIAL
} from '../../lib/constants'
import RestAPIFactory from '../../lib/RestAPIFactory'
import * as realm from '../../repositories/realmdb'
import moment from 'moment'
import { keyValueDBService } from '../classes/KeyValueDBService'
import { dataStoreFilterService } from '../classes/DataStoreFilterService'
import { EXTERNAL_DATA_STORE, DATA_STORE } from '../../lib/AttributeConstants'
import { SEARCH_TEXT_MISSING, DATA_STORE_MAP_MISSING, CURRENT_ELEMENT_MISSING } from '../../lib/ContainerConstants'

describe('test getValidations', () => {
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
            editable: true,
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
            editable: true,
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
        dataStoreService.checkIfUniqueConditionExists = jest.fn()
        dataStoreService.checkIfUniqueConditionExists.mockReturnValue(true)
        expect(dataStoreService.checkForUniqueValidation('abhi', { fieldAttributeMasterId: 123 })).toEqual(true)
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
        dataStoreService.checkIfUniqueConditionExists = jest.fn()
        dataStoreService.checkIfUniqueConditionExists.mockReturnValue(false)
        expect(dataStoreService.checkForUniqueValidation('xyz', { fieldAttributeMasterId: 12345 })).toEqual(false)
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

    it('should return undefined', () => {
        const jobAttributes = [{
            id: 123
        }, {
            id: 456
        }]
        const jobAttributeMasterId = 4567
        expect(dataStoreService.getFieldAttribute(jobAttributes, jobAttributeMasterId)).toEqual([])
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


    beforeEach(() => {
        dataStoreService.fetchDataStore = jest.fn()
        dataStoreService.saveDataStoreToDB = jest.fn()
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
        dataStoreService.fetchDataStore.mockReturnValue({ status: 200, json: dataStoreJsonResponse })
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

describe('test saveDataStoreToDB', () => {
    beforeEach(() => {
        realm.getAll = jest.fn()
        realm.performBatchSave = jest.fn()
        dataStoreService.saveDataStoreToDB = jest.fn()
    })
    it('should return undefined when dataStoreJsonResponse is missing', () => {
        expect(dataStoreService.saveDataStoreToDB()).toEqual(undefined)
    })

    it('should test saveDataStoreToDB', () => {
        realm.getAll.mockReturnValue(12)
        dataStoreService.fetchDatastoreAndSaveInDB('temp_token').then(() => {
            expect(realm.getAll).toHaveBeenCalledTimes(1)
            expect(realm.performBatchSave).toHaveBeenCalledTimes(1)
            expect(dataStoreService.saveDataStoreToDB).toHaveBeenCalledTimes(1)
        })
    })
})

describe('test checkIfRecordPresentWithServerId', () => {
    beforeEach(() => {
        realm.deleteSingleRecord = jest.fn()
    })
    it('should throw serverUniqueKey missing error', () => {
        const message = 'serverUniqueKey missing'
        try {
            dataStoreService.checkIfRecordPresentWithServerId()
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should test checkIfRecordPresentWithServerId', () => {
        dataStoreService.checkIfRecordPresentWithServerId('temp_token').then(() => {
            expect(realm.deleteSingleRecord).toHaveBeenCalledTimes(1)
        })
    })
})


describe('test searchDataStore', () => {
    beforeEach(() => {
        realm.getRecordListOnQuery = jest.fn()
    })
    it('should throw searchList missing error', () => {
        const message = 'searchList not present'
        try {
            dataStoreService.searchDataStore()
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })
    it('should return listOfUniqueRecords', () => {
        realm.getRecordListOnQuery.mockReturnValue(
            [{
                serverUniqueKey: 123,
                key: 'name'
            }, {
                serverUniqueKey: 231,
                key: 'num'
            }]
        )
        return dataStoreService.searchDataStore('abc', 123, ['a'])
            .then((listOfUniqueRecords) => {
                expect(realm.deleteSingleRecord).toHaveBeenCalledTimes(1)
                expect(listOfUniqueRecords).toEqual([
                    {
                        serverUniqueKey: 123,
                        matchKey: 'name'
                    }, {
                        serverUniqueKey: 231,
                        matchKey: 'num'
                    }
                ])
            })
    })

    it('should return listOfUniqueRecords with same key', () => {
        realm.getRecordListOnQuery.mockReturnValue(
            [{
                serverUniqueKey: 123,
                key: 'name'
            }, {
                serverUniqueKey: 231,
                key: 'name'
            }]
        )
        return dataStoreService.searchDataStore('abc', 123, ['a'])
            .then((listOfUniqueRecords) => {
                expect(realm.deleteSingleRecord).toHaveBeenCalledTimes(1)
                expect(listOfUniqueRecords).toEqual([
                    {
                        serverUniqueKey: 123,
                        matchKey: 'name'
                    }, {
                        serverUniqueKey: 231,
                        matchKey: 'name'
                    }
                ])
            })
    })

    it('should return listOfUniqueRecords', () => {
        realm.getRecordListOnQuery.mockReturnValue(
            [{
                serverUniqueKey: 123,
                key: 'name'
            }, {
                serverUniqueKey: 123,
                key: 'name'
            }]
        )
        return dataStoreService.searchDataStore('abc', 123, ['a'])
            .then((listOfUniqueRecords) => {
                expect(realm.deleteSingleRecord).toHaveBeenCalledTimes(1)
                expect(listOfUniqueRecords).toEqual([
                    {
                        serverUniqueKey: 123,
                        matchKey: 'name'
                    }
                ])
            })
    })
})


describe('test createDataStoreAttrValueMap', () => {
    it('should throw listOfUniqueRecords missing error', () => {
        const message = 'listOfUniqueRecords not present'
        try {
            dataStoreService.createDataStoreAttrValueMap(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should return dataStoreAttrValueMap', () => {
        const listOfUniqueRecords = [{
            serverUniqueKey: '123',
            matchKey: 'name'
        }]
        const uniqueKey = 'name'
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(
            [{
                key: 'name',
                value: 'abhi'
            }], [{
                key: '_id',
                value: '123'
            }])

        const dataStoreAttrValueMap = {
            0: {
                id: 0,
                uniqueKey,
                matchKey: 'name',
                dataStoreAttributeValueMap: {
                    'name': 'abhi',
                    '_id': '123'
                }
            }
        }
        expect(dataStoreService.createDataStoreAttrValueMap(uniqueKey, listOfUniqueRecords)).toEqual(dataStoreAttrValueMap)
    })

    it('should return dataStoreAttrValueMap', () => {
        const listOfUniqueRecords = [{
            serverUniqueKey: '123',
            matchKey: 'name'
        }]
        const uniqueKey = null
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue(
            [{
                key: 'name',
                value: 'abhi'
            }]

            , [{
                key: '_id',
                value: '123'
            }])

        const dataStoreAttrValueMap = {
            0: {
                id: 0,
                uniqueKey: '_id',
                matchKey: 'name',
                dataStoreAttributeValueMap: {
                    'name': 'abhi',
                    '_id': '123'
                }
            }
        }
        expect(dataStoreService.createDataStoreAttrValueMap(uniqueKey, listOfUniqueRecords)).toEqual(dataStoreAttrValueMap)
    })
})

describe('test checkForOfflineDsResponse', () => {
    it('should throw searchText missing error', () => {
        const message = 'searchText not present'
        try {
            dataStoreService.checkForOfflineDsResponse(null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    it('should throw dataStoreMasterId missing error', () => {
        const message = 'dataStoreMasterId not present'
        try {
            dataStoreService.checkForOfflineDsResponse('abc', null)
        } catch (error) {
            expect(error.message).toEqual(message)
        }
    })

    beforeEach(() => {
        realm.getRecordListOnQuery = jest.fn()
        dataStoreService.searchDataStore = jest.fn()
        dataStoreService.createDataStoreAttrValueMap = jest.fn()
    })

    it('should return offline DS not present', () => {
        realm.getRecordListOnQuery.mockReturnValue([])
        return dataStoreService.checkForOfflineDsResponse('abc', 123)
            .then((result) => {
                expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
                expect(result).toEqual(
                    { offlineDSPresent: false }
                )
            })
    })

    it('should return offline DS not present', () => {
        realm.getRecordListOnQuery.mockReturnValue([{
            uniqueIndex: true,
            searchIndex: true,
            key: 'name'
        }, {
            uniqueIndex: false,
            searchIndex: true,
            key: 'num'
        }])
        dataStoreService.searchDataStore.mockReturnValue([])
        dataStoreService.createDataStoreAttrValueMap.mockReturnValue({})
        return dataStoreService.checkForOfflineDsResponse('abc', 123)
            .then((result) => {
                expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
                expect(dataStoreService.searchDataStore).toHaveBeenCalledTimes(1)
                expect(dataStoreService.createDataStoreAttrValueMap).toHaveBeenCalledTimes(1)

                expect(result).toEqual(
                    {
                        offlineDSPresent: true,
                        dataStoreAttrValueMap: {}
                    }
                )
            })
    })
})

describe('test searchDataStoreAttributeValueMap', () => {

    it('should throw data store map missing error', () => {
        try {
            dataStoreService.searchDataStoreAttributeValueMap('123', null)
        } catch (error) {
            expect(error.message).toEqual(DATA_STORE_MAP_MISSING)
        }
    })

    it('should return dataStoreAttrValueMap and cloneDataStoreAttrValueMap when cloneDataStoreAttrValueMap is empty', () => {
        const dataStoreAttrValueMap = {
            123: {
                id: '123',
                uniqueKey: '_id',
                dataStoreAttributeValueMap: {
                    'name': 'abhi',
                    '_id': '123'
                }
            }
        }
        const cloneDataStoreAttrValueMap = {}
        expect(dataStoreService.searchDataStoreAttributeValueMap('1', dataStoreAttrValueMap, cloneDataStoreAttrValueMap)).toEqual({
            dataStoreAttrValueMap,
            cloneDataStoreAttrValueMap: dataStoreAttrValueMap
        })
    })

    it('should return dataStoreAttrValueMap and cloneDataStoreAttrValueMap when cloneDataStoreAttrValueMap is not empty', () => {
        const dataStoreAttrValueMap = {
            123: {
                id: '123',
                uniqueKey: '_id',
                dataStoreAttributeValueMap: {
                    'name': 'abhi',
                    '_id': '123'
                }
            }
        }
        const cloneDataStoreAttrValueMap = {
            123: {
                id: '123',
                uniqueKey: '_id',
                dataStoreAttributeValueMap: {
                    'name': 'abhi',
                    '_id': '123'
                }
            }
        }
        expect(dataStoreService.searchDataStoreAttributeValueMap('1', dataStoreAttrValueMap, cloneDataStoreAttrValueMap)).toEqual({
            dataStoreAttrValueMap,
            cloneDataStoreAttrValueMap: dataStoreAttrValueMap
        })
    })

    it('should return empty dataStoreAttrValueMap and cloneDataStoreAttrValueMap when cloneDataStoreAttrValueMap is not empty', () => {
        const dataStoreAttrValueMap = {
            123: {
                id: '123',
                uniqueKey: '_id',
                dataStoreAttributeValueMap: {
                    'name': 'abhi',
                    '_id': '123'
                }
            }
        }
        const cloneDataStoreAttrValueMap = {
            123: {
                id: '123',
                uniqueKey: '_id',
                dataStoreAttributeValueMap: {
                    'name': 'abhi',
                    '_id': '123'
                }
            }
        }
        expect(dataStoreService.searchDataStoreAttributeValueMap('2', dataStoreAttrValueMap, cloneDataStoreAttrValueMap)).toEqual({
            dataStoreAttrValueMap: {},
            cloneDataStoreAttrValueMap: dataStoreAttrValueMap
        })
    })
})

describe('test createDataStoreAttrValueMapInCaseOfFilter', () => {
    it('should return empty dataStoreAttrValueMap as dataStoreResponse is not defined', () => {
        const dataStoreAttrValueMap = {}
        expect(dataStoreService.createDataStoreAttrValueMapInCaseOfFilter(null, 1)).toEqual({})
    })

    it('should return dataStoreAttrValueMap', () => {
        const dataStoreResponse = [[{
            attributeId: 123,
            key: 'name',
            value: 'temp'
        }, {
            attributeId: 1234,
            key: 'class',
            value: '12'
        }]]

        const dataStoreAttrValueMap = {
            'temp': {
                id: 'temp',
                uniqueKey: 'name',
                dataStoreAttributeValueMap: {
                    'name': 'temp',
                    'class': '12'
                }
            }
        }
        expect(dataStoreService.createDataStoreAttrValueMapInCaseOfFilter(dataStoreResponse, 123)).toEqual(dataStoreAttrValueMap)
    })
})

describe('test checkForFiltersAndValidations', () => {
    beforeEach(() => {
        dataStoreService.getValidations = jest.fn()
        keyValueDBService.getValueFromStore = jest.fn()
        dataStoreFilterService.fetchDataForFilter = jest.fn()
        dataStoreService.createDataStoreAttrValueMapInCaseOfFilter = jest.fn()
    })
    it('should throw current element missing error', () => {
        try {
            dataStoreService.checkForFiltersAndValidations(null)
        } catch (error) {
            expect(error.message).toEqual(CURRENT_ELEMENT_MISSING)
        }
    })

    it('should return isFiltersPresent to false and check for validations and validations are also not present', () => {
        const currentElement = { id: 1 }
        let validation = {
            isScannerEnabled: false,
            isAutoStartScannerEnabled: false,
            isMinMaxValidation: false,
            isSearchEnabled: false,
            isAllowFromFieldInExternalDS: false
        }
        return dataStoreService.checkForFiltersAndValidations(currentElement, {}, null, {})
            .then((result) => {
                expect(result).toEqual(
                    {
                        dataStoreAttrValueMap: {},
                        dataStoreFilterReverseMap: {},
                        isFiltersPresent: false,
                        validation
                    }
                )
            })
    })

    it('should return isFiltersPresent to false, check for validations and validations are also not present and dataStoreFilterMapping is []', () => {
        const currentElement = { id: 1, dataStoreFilterMapping: '[]' }
        let validation = {
            isScannerEnabled: false,
            isAutoStartScannerEnabled: false,
            isMinMaxValidation: false,
            isSearchEnabled: false,
            isAllowFromFieldInExternalDS: false
        }
        return dataStoreService.checkForFiltersAndValidations(currentElement, {}, null, {})
            .then((result) => {
                expect(result).toEqual(
                    {
                        dataStoreAttrValueMap: {},
                        dataStoreFilterReverseMap: {},
                        isFiltersPresent: false,
                        validation
                    }
                )
            })
    })

    it('should return isFiltersPresent to false, check for validations and validations are also not present and attribute type id is 63', () => {
        const currentElement = { id: 1, dataStoreFilterMapping: '[J[123]]', attributeTypeId: EXTERNAL_DATA_STORE }
        let validation = {
            isScannerEnabled: false,
            isAutoStartScannerEnabled: false,
            isMinMaxValidation: false,
            isSearchEnabled: false,
            isAllowFromFieldInExternalDS: false
        }
        return dataStoreService.checkForFiltersAndValidations(currentElement, {}, null, {})
            .then((result) => {
                expect(result).toEqual(
                    {
                        dataStoreAttrValueMap: {},
                        dataStoreFilterReverseMap: {},
                        isFiltersPresent: false,
                        validation
                    }
                )
            })
    })

    it('should return isFiltersPresent to false, check for validations and validations are present and attribute type id is 63', () => {
        const currentElement = { id: 1, dataStoreFilterMapping: '[J[123]]', attributeTypeId: EXTERNAL_DATA_STORE, validation: [{ timeOfExecution: REMARKS }] }
        let validation = {
            isScannerEnabled: true,
            isAutoStartScannerEnabled: false,
            isMinMaxValidation: false,
            isSearchEnabled: false
        }
        dataStoreService.getValidations.mockReturnValue({
            isScannerEnabled: true,
            isAutoStartScannerEnabled: false,
            isMinMaxValidation: false,
            isSearchEnabled: false
        })
        return dataStoreService.checkForFiltersAndValidations(currentElement, {}, null, {})
            .then((result) => {
                expect(dataStoreService.getValidations).toHaveBeenCalledTimes(1)
                expect(result).toEqual(
                    {
                        dataStoreAttrValueMap: {},
                        dataStoreFilterReverseMap: {},
                        isFiltersPresent: false,
                        validation
                    }
                )
            })
    })

    it('should return isFiltersPresent to true and dataStoreAttrValueMap', () => {
        const currentElement = { id: 1, dataStoreFilterMapping: '[J[123]]', attributeTypeId: DATA_STORE, validation: [{ timeOfExecution: REMARKS }] }
        let validation = {
            isScannerEnabled: false,
            isAutoStartScannerEnabled: false,
            isMinMaxValidation: false,
            isSearchEnabled: false,
            isAllowFromFieldInExternalDS: false
        }
        keyValueDBService.getValueFromStore.mockReturnValue({})
        dataStoreFilterService.fetchDataForFilter.mockReturnValue({
            dataStoreFilterResponse: {},
            dataStoreFilterReverseMap: {}
        })
        dataStoreService.createDataStoreAttrValueMapInCaseOfFilter.mockReturnValue({})
        return dataStoreService.checkForFiltersAndValidations(currentElement, {}, null, {})
            .then((result) => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
                expect(dataStoreService.createDataStoreAttrValueMapInCaseOfFilter).toHaveBeenCalledTimes(1)
                expect(dataStoreFilterService.fetchDataForFilter).toHaveBeenCalledTimes(1)
                expect(result).toEqual(
                    {
                        dataStoreAttrValueMap: {},
                        dataStoreFilterReverseMap: {},
                        isFiltersPresent: true,
                        validation
                    }
                )
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