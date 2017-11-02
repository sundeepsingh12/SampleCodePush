'use strict'
var actions = require('../dataStoreActions')
var formLayoutActions = require('../../form-layout/formLayoutActions')
const {
    SET_VALIDATIONS,
    SET_DATA_STORE_ATTR_MAP,
    SHOW_LOADER,
    SHOW_ERROR_MESSAGE,
    ON_BLUR,
    GET_SORTED_ROOT_FIELD_ATTRIBUTES
} = require('../../../lib/constants').default
import CONFIG from '../../../lib/config'

const {
    REMARKS,
    MINMAX,
    SPECIAL
} = require('../../../lib/constants').default
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { dataStoreService } from '../../../services/classes/DataStoreService'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)
import { getNextFocusableAndEditableElements } from '../../form-layout/formLayoutActions'

describe('test for setValidation', () => {
    const validationsResult = {
        isScannerEnabled: true,
        isAutoStartScannerEnabled: false,
        isSearchEnabled: true,
        isAllowFromField: false
    }

    const expectedActions = [
        {
            type: SET_VALIDATIONS,
            payload: validationsResult
        },
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

    it('should fill value of matched keys in formElement from dataStoreAttributeValueMap', () => {
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, null, formLayoutMap))
            .then(() => {
                expect(dataStoreService.fillKeysInFormElement).toHaveBeenCalledTimes(1)
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
            payload: attrValueMap
        }, {
            type: SHOW_ERROR_MESSAGE,
            payload: {
                errorMessage: 'No records found for search value: ',
                dataStoreAttrValueMap: {},
            }
        }
    ]
    
    const dataStoreResponse = {
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

    it('should set all dataStoreAttribute Map when value is present in data store', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJson = jest.fn()
        dataStoreService.fetchJson.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(attrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('temp_name', 123, 123))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJson).toHaveBeenCalled()
                expect(dataStoreService.getDataStoreAttrValueMapFromJson).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })

    it('should set errorMessage when value is not present in data store', () => {
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue(CONFIG.SESSION_TOKEN_KEY)
        dataStoreService.fetchJson = jest.fn()
        dataStoreService.fetchJson.mockReturnValue(dataStoreResponse)
        dataStoreService.getDataStoreAttrValueMapFromJson = jest.fn()
        dataStoreService.getDataStoreAttrValueMapFromJson.mockReturnValue(expectedActions[2].payload.dataStoreAttrValueMap)
        const store = mockStore({})
        return store.dispatch(actions.getDataStoreAttrValueMap('abc', 123, 123))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalled()
                expect(dataStoreService.fetchJson).toHaveBeenCalled()
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