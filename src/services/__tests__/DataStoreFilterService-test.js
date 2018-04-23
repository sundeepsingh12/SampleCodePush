
import { dataStoreFilterService } from '../classes/DataStoreFilterService'
import {
    JOB_ATTRIBUTE,
    TABLE_JOB_DATA
} from '../../lib/constants'
import {
    POST
} from '../../lib/AttributeConstants'
import RestAPIFactory from '../../lib/RestAPIFactory'
import * as realm from '../../repositories/realmdb'
import { keyValueDBService } from '../../services/classes/KeyValueDBService'
import { keyValueDb } from '../../repositories/keyValueDb'
import { fieldValidationService } from '../../services/classes/FieldValidation'
import {
    SEARCH_TEXT_MISSING,
    CURRENT_ELEMENT_MISSING,
    TOKEN_MISSING,
    JOBATTRIBUTES_MISSING,
    DSF_LIST_MISSING,
    FIELD_ATTRIBUTE_ATTR_MASTER_ID_MISSING,
    FORM_ELEMENT_IS_MISSING,
    INVALID_BULK_JOB_CONFIG,
} from '../../lib/ContainerConstants'
import _ from 'lodash'



describe('test checkForSameJobDataValue', () => {
    it('should return jobData', () => {
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue([{ value: 123 }])
        expect(dataStoreFilterService.checkForSameJobDataValue({ jobId: 123 }, [{ id: 1 }])).toEqual([{ value: 123 }])
    })

    it('should return INVALID_BULK_JOB_CONFIG', () => {
        try {
            realm.getRecordListOnQuery = jest.fn()
            realm.getRecordListOnQuery.mockReturnValueOnce([{ value: 123 }])
                .mockReturnValueOnce([{ value: 12345 }])
            dataStoreFilterService.checkForSameJobDataValue({ 0: { jobId: 123 }, 1: { jobId: 12 } }, [{ id: 1 }])
        } catch (error) {
            expect(error.message).toEqual(INVALID_BULK_JOB_CONFIG)
        }
    })

    it('empty job Data', () => {
        realm.getRecordListOnQuery = jest.fn()
        realm.getRecordListOnQuery.mockReturnValue({})
        expect(dataStoreFilterService.checkForSameJobDataValue({ jobId: 123 }, [{ id: 1 }])).toEqual({})
    })
})


describe('test clearMappedDSFValue', () => {
    it('should throw fieldAttributeMasterId missing error', () => {
        try {
            dataStoreFilterService.clearMappedDSFValue(null)
        } catch (error) {
            expect(error.message).toEqual(FIELD_ATTRIBUTE_ATTR_MASTER_ID_MISSING)
        }
    })

    it('should throw formElement missing error', () => {
        try {
            dataStoreFilterService.clearMappedDSFValue(1, 2, null)
        } catch (error) {
            expect(error.message).toEqual(FORM_ELEMENT_IS_MISSING)
        }
    })

    it('should return dataStoreMasterIdList', () => {
        const formElement = {}
        const dataStoreFilterReverseMap = {}
        expect(dataStoreFilterService.clearMappedDSFValue(1, dataStoreFilterReverseMap, formElement)).toEqual({})
    })

    it('should return formElement with changed displayValue and value', () => {
        const formLayoutObject = {
            1: {
                fieldAttributeMasterId: 1,
                value: 'abc',
                displayValue: 'abc'
            },
            2: {
                fieldAttributeMasterId: 2,
            }
        }
        const formElement = getMapFromObject(formLayoutObject)
        const dataStoreFilterReverseMap = {
            123: ['1', '2']
        }
        let resultFormLayoutObject = {
            1: {
                fieldAttributeMasterId: 1,
                value: null,
                displayValue: null
            },
            2: {
                fieldAttributeMasterId: 2,
            }
        }
        const resultFormElement = getMapFromObject(resultFormLayoutObject)
        expect(dataStoreFilterService.clearMappedDSFValue(123, dataStoreFilterReverseMap, formElement)).toEqual(resultFormElement)
    })

    it('should return formElement with changed displayValue and value', () => {
        const formLayoutObject = {
            1: {
                fieldAttributeMasterId: 1,
                value: 'abc',
                displayValue: 'abc'
            },
            2: {
                fieldAttributeMasterId: 2,
            },
            3: {
                fieldAttributeMasterId: 3,
                value: '123',
                displayValue: '234'
            }
        }
        const formElement = getMapFromObject(formLayoutObject)
        const dataStoreFilterReverseMap = {
            123: ['1', '2'],
            2: ['3']
        }
        let resultFormLayoutObject = {
            1: {
                fieldAttributeMasterId: 1,
                value: null,
                displayValue: null
            },
            2: {
                fieldAttributeMasterId: 2,
            },
            3: {
                fieldAttributeMasterId: 3,
                value: null,
                displayValue: null
            }
        }
        const resultFormElement = getMapFromObject(resultFormLayoutObject)
        expect(dataStoreFilterService.clearMappedDSFValue(123, dataStoreFilterReverseMap, formElement)).toEqual(resultFormElement)
    })
})


describe('test searchDSFList', () => {
    it('should throw dataStoreFilterList missing error', () => {
        try {
            dataStoreFilterService.searchDSFList(null)
        } catch (error) {
            expect(error.message).toEqual(DSF_LIST_MISSING)
        }
    })

    it('should throw searchText missing error', () => {
        try {
            dataStoreFilterService.searchDSFList(1, 2, null)
        } catch (error) {
            expect(error.message).toEqual(SEARCH_TEXT_MISSING)
        }
    })

    it('should return dataStoreFilterList, cloneDataStoreFilterList and cloneDataStoreFilterList is empty', () => {
        const cloneDataStoreFilterList = []
        const dataStoreFilterList = ['1', '2', '3']
        expect(dataStoreFilterService.searchDSFList(dataStoreFilterList, cloneDataStoreFilterList, '1')).toEqual({
            dataStoreFilterList: ['1'],
            cloneDataStoreFilterList: dataStoreFilterList
        })
    })

    it('should return dataStoreFilterList, cloneDataStoreFilterList and cloneDataStoreFilterList is not empty', () => {
        const cloneDataStoreFilterList = ['1', '2', '3']
        const dataStoreFilterList = ['1', '3']
        expect(dataStoreFilterService.searchDSFList(dataStoreFilterList, cloneDataStoreFilterList, '1')).toEqual({
            dataStoreFilterList: ['1'],
            cloneDataStoreFilterList
        })
    })
})


describe('test parseKey', () => {

    it('should return dataStoreAttributeIdtoValueMap, dataStoreFilterReverseMap and key is a jobAttribute', () => {
        let key = 'J[abc]'
        let jobAttributes = {
            value: [{
                key: 'abc',
                dataStoreAttributeId: 123
            }]
        }
        let dataStoreAttributeIdtoValueMap = {
            123: 'abhi'
        }
        fieldValidationService.splitKey = jest.fn()
        fieldValidationService.splitKey.mockReturnValue('abc')
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{
            value: 'abhi'
        }]);

        expect(dataStoreFilterService.parseKey(key, null, null, { jobId: 1 }, jobAttributes, {}, {})).toEqual({
            dataStoreAttributeIdtoValueMap,
            dataStoreFilterReverseMap: {}
        })
    })

    it('should return dataStoreAttributeIdtoValueMap, dataStoreFilterReverseMap, key is a jobAttribute and no JobData is present', () => {
        let key = 'J[abc]'
        let jobAttributes = {
            value: [{
                key: 'abc',
                dataStoreAttributeId: 123
            }]
        }
        fieldValidationService.splitKey = jest.fn()
        fieldValidationService.splitKey.mockReturnValue('abc')
        realm.getRecordListOnQuery = jest.fn();
        realm.getRecordListOnQuery.mockReturnValue([{

        }]);

        expect(dataStoreFilterService.parseKey(key, null, null, { jobId: 1 }, jobAttributes, {}, {})).toEqual({
            dataStoreAttributeIdtoValueMap: {},
            dataStoreFilterReverseMap: {}
        })
    })

    it('should return dataStoreAttributeIdtoValueMap, dataStoreFilterReverseMap and key is a Field Attribute', () => {
        let key = 'F[abc]'
        let dataStoreAttributeIdtoValueMap = {
            123: 'abhi'
        }
        const formLayoutObject = {
            1: {
                fieldAttributeMasterId: 1,
                key: 'abc',
                dataStoreAttributeId: 123,
                value: 'abhi'
            }
        }
        const formElement = getMapFromObject(formLayoutObject)

        fieldValidationService.splitKey = jest.fn()
        fieldValidationService.splitKey.mockReturnValue('abc')

        expect(dataStoreFilterService.parseKey(key, 123, formElement, null, null, {}, {})).toEqual({
            dataStoreAttributeIdtoValueMap,
            dataStoreFilterReverseMap: {
                1: [123]
            }
        })
    })

    it('should return dataStoreAttributeIdtoValueMap, dataStoreFilterReverseMap, key is a Field Attribute and dataStoreFilterReverseMap is not empty', () => {
        let key = 'F[abc]'
        const formLayoutObject = {
            1: {
                fieldAttributeMasterId: 1,
                key: 'abc',
                dataStoreAttributeId: 123,
            }
        }
        const formElement = getMapFromObject(formLayoutObject)

        fieldValidationService.splitKey = jest.fn()
        fieldValidationService.splitKey.mockReturnValue('abc')

        expect(dataStoreFilterService.parseKey(key, 123, formElement, null, null, {}, { 1: [234] })).toEqual({
            dataStoreAttributeIdtoValueMap: {},
            dataStoreFilterReverseMap: {
                1: [234, 123]
            }
        })
    })


    it('should return dataStoreAttributeIdtoValueMap, dataStoreFilterReverseMap, key is a Field Attribute and formElement does not have mapped key', () => {
        let key = 'F[abc]'
        const formLayoutObject = {
            1: {
                fieldAttributeMasterId: 1,
                key: 'xyz',
                dataStoreAttributeId: 123,
            }
        }
        const formElement = getMapFromObject(formLayoutObject)

        fieldValidationService.splitKey = jest.fn()
        fieldValidationService.splitKey.mockReturnValue('abc')

        expect(dataStoreFilterService.parseKey(key, 123, formElement, null, null, {}, { 1: [234] })).toEqual({
            dataStoreAttributeIdtoValueMap: {},
            dataStoreFilterReverseMap: {
                1: [234]
            }
        })
    })
})


describe('test prepareDataStoreFilterMap', () => {
    it('should throw currentElement missing error', () => {
        try {
            dataStoreFilterService.prepareDataStoreFilterMap(null)
        } catch (error) {
            expect(error.message).toEqual(CURRENT_ELEMENT_MISSING)
        }
    })

    it('should throw jobAttributes missing error', () => {
        try {
            dataStoreFilterService.prepareDataStoreFilterMap(1, 2, null)
        } catch (error) {
            expect(error.message).toEqual(JOBATTRIBUTES_MISSING)
        }
    })

    it('should return dataStoreFilterReverseMap, dataStoreAttributeIdtoValueMap', () => {
        let key = 'F[abc]'
        let currentElement = {
            dataStoreFilterMapping: '[]'
        }
        expect(dataStoreFilterService.prepareDataStoreFilterMap(currentElement, null, null, null, {})).toEqual({
            dataStoreAttributeIdtoValueMap: {},
            dataStoreFilterReverseMap: {}
        })
    })

    it('should return dataStoreFilterReverseMap, dataStoreAttributeIdtoValueMap', () => {
        let key = 'F[abc]'
        let currentElement = {
            fieldAttributeMasterId: 123,
            dataStoreFilterMapping: JSON.stringify('[J[123]]')
        }
        let jobAttributes = {
            value: ['123']
        }
        dataStoreFilterService.parseKey = jest.fn()
        dataStoreFilterService.parseKey.mockReturnValue({
            dataStoreFilterReverseMap: { 1: [2] },
            dataStoreAttributeIdtoValueMap: {}
        })
        expect(dataStoreFilterService.prepareDataStoreFilterMap(currentElement, null, null, jobAttributes, { 1: [2] })).toEqual({
            dataStoreAttributeIdtoValueMap: {},
            dataStoreFilterReverseMap: { 1: [2] }
        })
    })
})

describe('test fetchDSF', () => {
    it('should return jsonResponse', () => {
        RestAPIFactory().serviceCall = jest.fn()
        RestAPIFactory().serviceCall.mockReturnValue(null);
        dataStoreFilterService.fetchDSF('token', {})
        expect(RestAPIFactory().serviceCall).toHaveBeenCalledTimes(1);
    })
})



describe('test fetchDataForFilter', () => {
    it('should throw currentElement missing error', () => {
        try {
            dataStoreFilterService.fetchDataForFilter(1, null)
        } catch (error) {
            expect(error.message).toEqual(CURRENT_ELEMENT_MISSING)
        }
    })

    it('should throw token missing error', () => {
        try {
            dataStoreFilterService.fetchDataForFilter()
        } catch (error) {
            expect(error.message).toEqual()
        }
    })

    beforeEach(() => {
        keyValueDBService.getValueFromStore = jest.fn()
        dataStoreFilterService.prepareDataStoreFilterMap = jest.fn()
        dataStoreFilterService.fetchDSF = jest.fn()
    })

    it('should return dataStoreFilterResponse and dataStoreFilterReverseMap', () => {
        let currentElement = {
            dataStoreAttributeId: 123,
            dataStoreMasterId: 234
        }
        keyValueDBService.getValueFromStore.mockReturnValue({})
        dataStoreFilterService.prepareDataStoreFilterMap.mockReturnValue({
            dataStoreAttributeIdtoValueMap: {},
            dataStoreFilterReverseMap: {}
        })
        dataStoreFilterService.fetchDSF.mockReturnValue({ json: { id: 1 } })
        dataStoreFilterService.fetchDataForFilter('temp_token', currentElement, true).then(() => {
            expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(1)
            expect(dataStoreFilterService.prepareDataStoreFilterMap).toHaveBeenCalledTimes(1)
            expect(dataStoreFilterService.fetchDSF).toHaveBeenCalledTimes(1)
            expect(result).toEqual({
                dataStoreFilterResponse: { id: 1 },
                dataStoreFilterReverseMap: {}
            })
        })
    })
})


describe('test fetchDataForFilterInArray', () => {
    beforeEach(() => {
        dataStoreFilterService.fetchDataForFilter = jest.fn()
    })

    it('should return dataStoreFilterResponse and dataStoreFilterReverseMap', () => {
        let currentElement = {
            dataStoreAttributeId: 123,
            dataStoreMasterId: 234
        }
        let functionParamsFromDSF = {
            currentElement: {},
            formElement: { 123: {} },
            jobTransaction: {},
            arrayReverseDataStoreFilterMap: { 121: {} },
            rowId: 123, arrayFieldAttributeMasterId: 121
        }
        dataStoreFilterService.fetchDataForFilter.mockReturnValue({
            dataStoreFilterResponse: {},
            dataStoreFilterReverseMap: {}
        })
        dataStoreFilterService.fetchDSF.mockReturnValue({ json: { id: 1 } })
        dataStoreFilterService.fetchDataForFilterInArray().then(() => {
            expect(dataStoreFilterService.fetchDataForFilter).toHaveBeenCalledTimes(1)
            expect(result).toEqual({
                dataStoreFilterResponse: {},
                dataStoreFilterReverseMap: {}
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