'use strict'
var actions = require('../dataStoreActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
import {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER,
    SHOW_ERROR_MESSAGE,
    REMARKS,
    MINMAX,
    SPECIAL,
    SAVE_SUCCESSFUL
} from '../../../lib/constants'
import CONFIG from '../../../lib/config'
import {
    EXTERNAL_DATA_STORE,
    DATA_STORE
} from '../../../lib/AttributeConstants'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../../services/classes/DataStoreService'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('test for setValidation', () => {

    const validationsResult = {
        isScannerEnabled: true,
        isAutoStartScannerEnabled: false,
        isSearchEnabled: true,
        isMinMaxValidation: false
    }

    const expectedActions = [
        {
            type: SET_VALIDATIONS,
            payload: validationsResult
        }
    ]

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

    it('should set all validation using validation array from currentElement', () => {
        dataStoreService.getValidations = jest.fn()
        dataStoreService.getValidations.mockReturnValue(validationsResult);
        const store = mockStore({})
        return store.dispatch(actions.setValidation(validationArray))
            .then(() => {
                expect(dataStoreService.getValidations).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})

describe('test for fillKeysAndSave', () => {

    const expectedActions = [{
        type: SAVE_SUCCESSFUL,
        payload: true
    }, {
        type: SHOW_ERROR_MESSAGE,
        payload: {
            errorMessage: 'This value is already added',
            dataStoreAttrValueMap: {},
        }
    }]

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

    it('should fill value of matched keys in formElement from dataStoreAttributeValueMap for DataStore', () => {
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, formLayoutMap, null, null, null, true, DATA_STORE))
            .then(() => {
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should fill value of matched keys in formElement from dataStoreAttributeValueMap for ExternalDataStore and not present in any transaction', () => {
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        dataStoreService.dataStoreValuePresentInFieldData = jest.fn()
        dataStoreService.dataStoreValuePresentInFieldData.mockReturnValue(false)
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, formLayoutMap, null, null, null, true, EXTERNAL_DATA_STORE))
            .then(() => {
                expect(dataStoreService.dataStoreValuePresentInFieldData).toHaveBeenCalledTimes(1)
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should fill value of matched keys in formElement from dataStoreAttributeValueMap for ExternalDataStore and is present in transaction', () => {
        dataStoreService.dataStoreValuePresentInFieldData = jest.fn()
        dataStoreService.dataStoreValuePresentInFieldData.mockReturnValue(true)
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, formLayoutMap, null, null, null, true, EXTERNAL_DATA_STORE))
            .then(() => {
                expect(dataStoreService.dataStoreValuePresentInFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('test for getDataStoreAttrValueMap', () => {

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

    const expectedActions = [
        {
            type: SHOW_LOADER,
            payload: true
        }, {
            type: SET_DATA_STORE_ATTR_MAP,
            payload: {
                dataStoreAttrValueMap: attrValueMap,
                searchText: 'temp_name'
            }
        }, {
            type: SHOW_ERROR_MESSAGE,
            payload: {
                errorMessage: 'No records found for search',
                dataStoreAttrValueMap: {},
            }
        }
    ]

    const dataStoreResponse = {
        status: 200,
        json: {
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
    }

    it('should set dataStoreAttribute Map when value is present in DataStore', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJsonForDS = jest.fn()
        dataStoreService.fetchJsonForDS.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(attrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('temp_name', 123, 123))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJsonForDS).toHaveBeenCalled()
                expect(dataStoreService.getDataStoreAttrValueMapFromJson).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should set errorMessage when value is not present in DataStore', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJsonForDS = jest.fn()
        dataStoreService.fetchJsonForDS.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(expectedActions[2].payload.dataStoreAttrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('abc', 123, 123))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJsonForDS).toHaveBeenCalled()
                expect(dataStoreService.getDataStoreAttrValueMapFromJson).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })

    it('should set dataStoreAttribute Map when value is present in ExternalDataStore', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJsonForExternalDS = jest.fn()
        dataStoreService.fetchJsonForExternalDS.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(attrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('temp_name', null, null, 'http://abc.com', 'EXT_DS'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJsonForExternalDS).toHaveBeenCalled()
                expect(dataStoreService.getDataStoreAttrValueMapFromJson).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should set errorMessage when value is not present in ExternalDataStore', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJsonForExternalDS = jest.fn()
        dataStoreService.fetchJsonForExternalDS.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(expectedActions[2].payload.dataStoreAttrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('abc', null, null, 'http://abc.com', 'EXT_DS'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJsonForExternalDS).toHaveBeenCalled()
                expect(dataStoreService.getDataStoreAttrValueMapFromJson).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
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