'use strict'
var actions = require('../saveActivatedActions')
import {
    ADD_FORM_LAYOUT_STATE,
    LOADER_ACTIVE,
    POPULATE_DATA,
    CheckoutDetails,
    SAVE_ACTIVATED,
    SAVE_ACTIVATED_INITIAL_STATE,
    DELETE_ITEM_SAVE_ACTIVATED,
    Home
} from '../../../lib/constants'
import CONFIG from '../../../lib/config'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { transientStatusService } from '../../../services/classes/TransientStatusService'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

// describe('test for checkout', () => {

//     const expectedActions = [
//         {
//             type: LOADER_ACTIVE,
//             payload: true
//         }
//     ]
//     const previousFormLayoutState = {
//         '1': {
//             id: 1
//         }
//     }
//     const recurringData = {
//         '-1': {
//             id: -1

//         }
//     }
//     const jobMasterId = 123
//     const commonData = {
//         amount: 100
//     }
//     const statusId = 1234
//     it('should navigate to checkoutDetails', () => {
//         transientStatusService.calculateTotalAmount = jest.fn()
//         transientStatusService.calculateTotalAmount(validationsResult);
//         transientStatusService.saveDataInDbAndAddTransactionsToSyncList = jest.fn()
//         const store = mockStore({})
//         return store.dispatch(actions.setValidation(validationArray))
//             .then(() => {
//                 expect(dataStoreService.getValidations).toHaveBeenCalledTimes(1)
//                 expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
//                 expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
//             })
//     })
// })

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

    it('should fill value of matched keys in formElement', () => {
        dataStoreService.fillKeysInFormElement = jest.fn();
        dataStoreService.fillKeysInFormElement.mockReturnValue(formLayoutMapResult);
        const store = mockStore({})
        return store.dispatch(actions.fillKeysAndSave(dataStoreAttributeValueMap, 123))
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
        dataStoreService.dataStoreValuePresentInFieldData = jest.fn()
        dataStoreService.dataStoreValuePresentInFieldData.mockReturnValue(true);
        const store = mockStore({})
        return store.dispatch(actions.uniqueValidationCheck('abhi', 123))
            .then(() => {
                expect(dataStoreService.dataStoreValuePresentInFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
            })
    })

    it('should return false as dataStoreValue is already present', () => {
        dataStoreService.dataStoreValuePresentInFieldData = jest.fn()
        dataStoreService.dataStoreValuePresentInFieldData.mockReturnValue(false);
        const store = mockStore({})
        return store.dispatch(actions.uniqueValidationCheck('abhi', 123, 1))
            .then(() => {
                expect(dataStoreService.dataStoreValuePresentInFieldData).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[1].payload)
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