'use strict'
var actions = require('../dataStoreActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
import {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER_DS,
    SHOW_ERROR_MESSAGE,
    REMARKS,
    MINMAX,
    SPECIAL,
    SHOW_DETAILS,
    CLEAR_ATTR_MAP_AND_SET_LOADER,
} from '../../../lib/constants'
import {
    DATA_STORE,
    EXTERNAL_DATA_STORE
} from '../../../lib/AttributeConstants'
import CONFIG from '../../../lib/config'
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

    it('should throw an error', () => {
        dataStoreService.getValidations = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.setValidation(validationArray))
            .then(() => {

            })
    })

    it('should return nothing when validation array is null', () => {
        const store = mockStore({})
        return store.dispatch(actions.setValidation(null))
            .then(() => {

            })
    })
})

describe('test for fillKeysAndSave', () => {

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
            validation: [],
            formLayoutObject: {}
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

    const expectedActions = [{
        type: SHOW_ERROR_MESSAGE,
        payload: {
            errorMessage: 'error',
            dataStoreAttrValueMap: {},
        }
    }]


    it('should fill value of matched keys in formElement in case of called from array', () => {
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, formLayoutObject, null, null, true, 1))
            .then(() => {
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
            })
    })

    it('should fill value of matched keys in formElement in case of not called from array', () => {
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, null, null, null, false))
            .then(() => {
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
            })
    })

    it('should throw an error', () => {
        dataStoreService.fillKeysInFormElement = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, null, null, null, false))
            .then(() => {
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
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
            type: SHOW_LOADER_DS,
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
        }, {
            type: SHOW_ERROR_MESSAGE,
            payload: {
                errorMessage: 'error',
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

    it('should throw an error', () => {
        const dataStoreResponseWith400 = {
            status: 400,
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
            },
            message: 'error'
        }
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJsonForExternalDS = jest.fn()
        dataStoreService.fetchJsonForExternalDS.mockReturnValue(dataStoreResponseWith400)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('abc', null, null, 'http://abc.com', 'EXT_DS'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJsonForExternalDS).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[3].payload)
            })
    })


})

describe('test for uniqueValidationCheck', () => {

    const expectedActions = [{
        type: SHOW_ERROR_MESSAGE,
        payload: {
            errorMessage: 'This value is already added',
            dataStoreAttrValueMap: {}
        }
    }, {
        type: SHOW_DETAILS,
        payload: 1
    }]

    it('should return true as dataStoreValue is already present', () => {
        dataStoreService.checkForUniqueValidation = jest.fn()
        dataStoreService.checkForUniqueValidation.mockReturnValue(true);
        const store = mockStore({})
        return store.dispatch(actions.uniqueValidationCheck('abhi', 123))
            .then(() => {
                expect(dataStoreService.checkForUniqueValidation).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should return false as dataStoreValue is already present', () => {
        dataStoreService.checkForUniqueValidation = jest.fn()
        dataStoreService.checkForUniqueValidation.mockReturnValue(false);
        const store = mockStore({})
        return store.dispatch(actions.uniqueValidationCheck('abhi', 123, 1))
            .then(() => {
                expect(dataStoreService.checkForUniqueValidation).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
            })
    })
})



describe('test for getFieldAttribute', () => {

    const expectedActions = [{
        type: CLEAR_ATTR_MAP_AND_SET_LOADER,
        payload: {}
    }]

    it('should return dataStoreAttrValueMap', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        dataStoreService.getFieldAttribute = jest.fn()
        dataStoreService.getFieldAttribute.mockReturnValue([{
            dataStoreMasterId: 123,
            dataStoreAttributeId: 2345,
            externalDataStoreMasterUrl: null,
            key: 'DS'
        }])
        const store = mockStore({})
        return store.dispatch(actions.getFieldAttribute(123, 'abc'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(dataStoreService.getFieldAttribute).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})



describe('test for getJobAttribute', () => {

    const expectedActions = [{
        type: CLEAR_ATTR_MAP_AND_SET_LOADER,
        payload: {}
    }]

    it('should return dataStoreAttrValueMap', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        dataStoreService.getJobAttribute = jest.fn()
        dataStoreService.getJobAttribute.mockReturnValue([{
            dataStoreMasterId: 123,
            dataStoreAttributeId: 2345,
        }])
        const store = mockStore({})
        return store.dispatch(actions.getJobAttribute(123, 'abc'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(dataStoreService.getJobAttribute).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})




describe('test for checkOfflineDS', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DS,
        payload: true
    }, {
        type: SET_DATA_STORE_ATTR_MAP,
        payload: {
            dataStoreAttrValueMap: {
                id: 1
            },
            searchText: 'temp'
        }
    }, {
        type: SHOW_ERROR_MESSAGE,
        payload: {
            dataStoreAttrValueMap: {},
            errorMessage: 'No records found for search'
        }
    }]

    it('should return dataStoreAttrValueMap in case of offlineDS', () => {
        dataStoreService.checkForOfflineDsResponse = jest.fn()
        dataStoreService.checkForOfflineDsResponse.mockReturnValue({
            offlineDSPresent: true, dataStoreAttrValueMap: {
                id: 1
            }
        })
        const store = mockStore({})
        return store.dispatch(actions.checkOfflineDS('temp', 1234, 12345, null, null, DATA_STORE))
            .then(() => {
                expect(dataStoreService.checkForOfflineDsResponse).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should throw and error as offlineDS present but returned value is empty', () => {
        dataStoreService.checkForOfflineDsResponse = jest.fn()
        dataStoreService.checkForOfflineDsResponse.mockReturnValue({
            offlineDSPresent: true, dataStoreAttrValueMap: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.checkOfflineDS('temp', 1234, 12345, null, null, DATA_STORE))
            .then(() => {
                expect(dataStoreService.checkForOfflineDsResponse).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })

    it('should call getDataStoreAttrValueMap offlineDS not present', () => {
        dataStoreService.checkForOfflineDsResponse = jest.fn()
        dataStoreService.checkForOfflineDsResponse.mockReturnValue({
            offlineDSPresent: false, dataStoreAttrValueMap: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.checkOfflineDS('temp', 1234, 12345, null, null, DATA_STORE))
            .then(() => {
                expect(dataStoreService.checkForOfflineDsResponse).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should call getDataStoreAttrValueMap in case of External DS', () => {
        const store = mockStore({})
        return store.dispatch(actions.checkOfflineDS('temp', 1234, 12345, null, null, EXTERNAL_DATA_STORE))
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })
})


describe('test for onSave', () => {

    it('should call updateFieldDataWithChildData when it is called from DS', () => {
        const store = mockStore({})
        return store.dispatch(actions.onSave(null, null, null, null, false, EXTERNAL_DATA_STORE))
            .then(() => {

            })
    })

    it('should call updateFieldDataWithChildData when it is called from DS', () => {
        const store = mockStore({})
        return store.dispatch(actions.onSave(null, null, null, null, true, EXTERNAL_DATA_STORE))
            .then(() => {

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