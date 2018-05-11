'use strict'
var actions = require('../dataStoreActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
import {
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER_DS,
    SHOW_ERROR_MESSAGE,
    REMARKS,
    MINMAX,
    SPECIAL,
    SHOW_DETAILS,
    CLEAR_ATTR_MAP_AND_SET_LOADER,
    SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP,
    SET_DSF_REVERSE_MAP,
    SEARCH_DATA_STORE_RESULT,
    SET_ARRAY_DATA_STORE_FILTER_MAP,
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
        let formLayoutState = {
            formElement: formLayoutMap
        }
        let jobTransaction = {
            id: 1,
            jobId: 1
        }
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, formLayoutState, 'abc', null, null, jobTransaction))
            .then(() => {
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
            })
    })

    it('should fill value of matched keys in formElement in case of not called from array', () => {
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, {}, null, false))
            .then(() => {
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
            })
    })

    it('should throw an error', () => {
        dataStoreService.fillKeysInFormElement = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123, {}, null, null, false))
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
            })
    })

    it('should set errorMessage when value is not present in DataStore', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJsonForDS = jest.fn()
        dataStoreService.fetchJsonForDS.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(expectedActions[1].payload.dataStoreAttrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('abc', 123, 123))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJsonForDS).toHaveBeenCalled()
                expect(dataStoreService.getDataStoreAttrValueMapFromJson).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
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
            })
    })

    it('should set errorMessage when value is not present in ExternalDataStore', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJsonForExternalDS = jest.fn()
        dataStoreService.fetchJsonForExternalDS.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(expectedActions[1].payload.dataStoreAttrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('abc', null, null, 'http://abc.com', 'EXT_DS'))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJsonForExternalDS).toHaveBeenCalled()
                expect(dataStoreService.getDataStoreAttrValueMapFromJson).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
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
                expect(store.getActions()[0].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[2].payload)
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
    }, {
        type: SHOW_ERROR_MESSAGE,
        payload: {
            dataStoreAttrValueMap: {},
            errorMessage: 'error'
        }
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

    it('should throw an error', () => {
        keyValueDBService.getValueFromStore = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.getFieldAttribute())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})



describe('test for getJobAttribute', () => {

    const expectedActions = [{
        type: CLEAR_ATTR_MAP_AND_SET_LOADER,
        payload: {}
    }, {
        type: SHOW_ERROR_MESSAGE,
        payload: {
            dataStoreAttrValueMap: {},
            errorMessage: 'error'
        }
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

    it('should throw an error', () => {
        keyValueDBService.getValueFromStore = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.getJobAttribute())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
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
        return store.dispatch(actions.onSave(null, null, null, null, false, 1, 1, {}, {}))
            .then(() => {

            })
    })

    it('should call updateFieldDataWithChildData when it is called from Array', () => {
        const store = mockStore({})
        return store.dispatch(actions.onSave(null, null, null, null, true, EXTERNAL_DATA_STORE))
            .then(() => {

            })
    })
})


describe('test for checkForFiltersAndValidation', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DS,
        payload: true
    }, {
        type: SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP,
        payload: {
            dataStoreAttrValueMap: {
                id: 1
            },
            isFiltersPresent: false,
            validation: {}
        }
    }, {
        type: SHOW_ERROR_MESSAGE,
        payload: {
            dataStoreAttrValueMap: {},
            errorMessage: 'error'
        }
    }, {
        type: SET_DSF_REVERSE_MAP,
        payload: {}
    }]

    it('should set dataStoreAttrValueMap, isFiltersPresent, validation and dataStoreFilterReverseMap', () => {
        dataStoreService.checkForFiltersAndValidations = jest.fn()
        dataStoreService.checkForFiltersAndValidations.mockReturnValue({
            dataStoreAttrValueMap: {
                id: 1
            },
            isFiltersPresent: false,
            validation: {},
            dataStoreFilterReverseMap: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.checkForFiltersAndValidation('temp', 1234, null, null))
            .then(() => {
                expect(dataStoreService.checkForFiltersAndValidations).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[3].payload)
            })
    })

    it('should throw an error', () => {
        dataStoreService.checkForFiltersAndValidations = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.checkForFiltersAndValidation('temp', 1234, null, null))
            .then(() => {
                expect(dataStoreService.checkForFiltersAndValidations).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})


describe('test for searchDataStoreAttributeValueMap', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DS,
        payload: true
    }, {
        type: SEARCH_DATA_STORE_RESULT,
        payload: {
            dataStoreAttrValueMap: {},
            cloneDataStoreAttrValueMap: {},
            searchText: 'abc'
        }
    }, {
        type: SHOW_ERROR_MESSAGE,
        payload: {
            dataStoreAttrValueMap: {},
            errorMessage: 'error'
        }
    }]

    it('should set dataStoreAttrValueMap, cloneDataStoreAttrValueMap and searchText', () => {
        dataStoreService.searchDataStoreAttributeValueMap = jest.fn()
        dataStoreService.searchDataStoreAttributeValueMap.mockReturnValue({
            dataStoreAttrValueMap: {},
            cloneDataStoreAttrValueMap: {},
            searchText: 'abc'
        })
        const store = mockStore({})
        return store.dispatch(actions.searchDataStoreAttributeValueMap('abc', {}, null))
            .then(() => {
                expect(dataStoreService.searchDataStoreAttributeValueMap).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should throw an error', () => {
        dataStoreService.searchDataStoreAttributeValueMap = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.searchDataStoreAttributeValueMap('temp', 1234, null, null))
            .then(() => {
                expect(dataStoreService.searchDataStoreAttributeValueMap).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[2].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[2].payload)
            })
    })
})



describe('test for checkForFiltersAndValidationForArray', () => {

    const expectedActions = [{
        type: SHOW_LOADER_DS,
        payload: true
    }, {
        type: SET_IS_FILTER_PRESENT_AND_DS_ATTR_VALUE_MAP,
        payload: {
            dataStoreAttrValueMap: {
                id: 1
            },
            isFiltersPresent: false,
            validation: {}
        }
    }, {
        type: SHOW_ERROR_MESSAGE,
        payload: {
            dataStoreAttrValueMap: {},
            errorMessage: 'error'
        }
    }, {
        type: SET_ARRAY_DATA_STORE_FILTER_MAP,
        payload: {}
    }]

    it('should set dataStoreAttrValueMap, isFiltersPresent, validation and arrayReverseDataStoreFilterMap', () => {
        dataStoreService.checkForFiltersAndValidationsForArray = jest.fn()
        dataStoreService.checkForFiltersAndValidationsForArray.mockReturnValue({
            dataStoreAttrValueMap: {
                id: 1
            },
            isFiltersPresent: false,
            validation: {},
            arrayReverseDataStoreFilterMap: {}
        })
        const store = mockStore({})
        return store.dispatch(actions.checkForFiltersAndValidationForArray('temp'))
            .then(() => {
                expect(dataStoreService.checkForFiltersAndValidationsForArray).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
                expect(store.getActions()[2].type).toEqual(expectedActions[3].type)
                expect(store.getActions()[2].payload).toEqual(expectedActions[3].payload)
            })
    })

    it('should throw an error', () => {
        dataStoreService.checkForFiltersAndValidationsForArray = jest.fn(() => {
            throw new Error('error')
        })
        const store = mockStore({})
        return store.dispatch(actions.checkForFiltersAndValidationForArray('temp'))
            .then(() => {
                expect(dataStoreService.checkForFiltersAndValidations).toHaveBeenCalledTimes(1)
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