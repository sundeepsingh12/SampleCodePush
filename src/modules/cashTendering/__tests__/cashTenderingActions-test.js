'use strict'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { keyValueDBService } from '../../../services/classes/KeyValueDBService'
import { CashTenderingService } from '../../../services/classes/CashTenderingServices'
import { updateFieldDataWithChildData } from '../../form-layout/formLayoutActions'
var actions = require('../cashTenderingActions')
import { setState } from '../../global/globalActions'
import * as formLayoutActions from '../../form-layout/formLayoutActions'
import {
    CHANGE_AMOUNT,
    IS_CASH_TENDERING_LOADER_RUNNING,
    SET_CASH_TENDERING,
    IS_RECEIVE_TOGGLE,
    FETCH_CASH_TENDERING_LIST_RETURN,
    CHANGE_AMOUNT_RETURN,
} from '../../../lib/constants'
import { userExceptionLogsService } from '../../../services/classes/UserException';
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('cashtendering  onsave', () => {

    it('should set action type and payload', () => {
        let type = IS_RECEIVE_TOGGLE
        let payload = false
        expect(setState(type, payload)).toEqual({
            type: type,
            payload: payload
        })
    })
})

describe('cashtendering  getCashTenderingListReturn', () => {
    it('should getCashTenderingListReturn', () => {
        let type = IS_RECEIVE_TOGGLE
        let payload = false
        expect(setState(type, payload)).toEqual({
            type: type,
            payload: payload
        })
    })

    it('should return initialized value in getCashTenderingListReturn ', () => {
        let cashTenderingList = {
            '1': {
                childDataList: {
                    '6': {
                        value: 10
                    },
                    '13': {
                        value: 10
                    },
                    '1': {
                        value: 10
                    }
                }
            }, '2': {
                childDataList: {
                    '6': {
                        value: 100
                    },
                    '13': {
                        value: 10
                    },
                    '1': {
                        value: 10
                    }
                }
            }
        }

        let cashTenderingListInitialized = {
            '1000': {
                childDataList: {
                    '6': {
                        value: 0
                    },
                    '13': {
                        value: 10
                    },
                    '1': {
                        value: 'return'
                    }
                },
                "id": 1000
            }, '1001': {
                childDataList: {
                    '6': {
                        value: 0
                    },
                    '13': {
                        value: 10
                    },
                    '1': {
                        value: 'return'
                    }
                },
                "id": 1001
            }
        }
        const expectedActions = [
            {
                type: IS_CASH_TENDERING_LOADER_RUNNING,
                payload: true
            },
            {
                type: FETCH_CASH_TENDERING_LIST_RETURN,
                payload: {
                    cashTenderingListReturn: cashTenderingListInitialized,
                    isCashTenderingLoaderRunning: false
                }
            }
        ]
        CashTenderingService.initializeValuesOfDenominations = jest.fn()
        CashTenderingService.initializeValuesOfDenominations.mockReturnValue(cashTenderingListInitialized)
        const store = mockStore({})
        return store.dispatch(actions.getCashTenderingListReturn(cashTenderingList))
            .then(() => {
                expect(CashTenderingService.initializeValuesOfDenominations).toHaveBeenCalledTimes(1)
                expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedActions[0].payload)
                expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedActions[1].payload)
            })
    })
})

describe('cashtendering  onChangeQuantity', () => {
    userExceptionLogsService.addUserExceptionLogs = jest.fn()
    const expectedAction = [{
        type: CHANGE_AMOUNT,
        payload: {
            cashtenderingList: { id: 1 },
            totalQuantity: 10
        }
    },
    {
        type: CHANGE_AMOUNT_RETURN,
        payload: {
            cashtenderingList: { id: 1 },
            totalQuantity: 10
        }
    }]
    let cashtenderingList = {
        id: 1
    }
    let totalQuantity = 10
    let payload = {
        id: 1,
        quantity: 1200
    }
    let isReceive = true
    it('should change quantity of individual item', () => {

        CashTenderingService.calculateQuantity = jest.fn()
        CashTenderingService.calculateQuantity.mockReturnValue({
            cashtenderingList: cashtenderingList,
            totalQuantity: totalQuantity
        })
        const store = mockStore({})
        return store.dispatch(actions.onChangeQuantity(cashtenderingList, totalQuantity, payload, isReceive))
            .then(() => {
                expect(CashTenderingService.calculateQuantity).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedAction[0].type)
                expect(store.getActions()[0].payload).toEqual(expectedAction[0].payload)
            })
    })

    it('should change quantity of individual item when isreceive false', () => {

        CashTenderingService.calculateQuantity = jest.fn()
        CashTenderingService.calculateQuantity.mockReturnValue({
            cashtenderingList: cashtenderingList,
            totalQuantity: totalQuantity
        })
        const store = mockStore({})
        return store.dispatch(actions.onChangeQuantity(cashtenderingList, totalQuantity, payload, false))
            .then(() => {
                expect(CashTenderingService.calculateQuantity).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedAction[1].type)
                expect(store.getActions()[0].payload).toEqual(expectedAction[1].payload)
            })
    })

    it('throw error when cashtenderingList is null', () => {
        const store = mockStore({})
        return store.dispatch(actions.onChangeQuantity(null))
            .then(() => {
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalled()
            })
    })
    it('throw error when total amount is null', () => {
        const store = mockStore({})
        return store.dispatch(actions.onChangeQuantity(cashtenderingList))
            .then(() => {
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalled()
            })
    })
})

describe('cashtendering  fetchCashTenderingList', () => {
    it('should fetch fetchCashTenderingList', () => {
        const expectedAction = [{
            type: IS_CASH_TENDERING_LOADER_RUNNING,
        }, {
            type: SET_CASH_TENDERING,
            payload: {
                cashTenderingList: {},
                isCashTenderingLoaderRunning: false
            }
        }]
        let fieldAttributeMasterId = 12345
        keyValueDBService.getValueFromStore = jest.fn()
        keyValueDBService.getValueFromStore.mockReturnValue({})
        CashTenderingService.prepareCashTenderingList = jest.fn()
        CashTenderingService.prepareCashTenderingList.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.fetchCashTenderingList(fieldAttributeMasterId))
            .then(() => {
                expect(keyValueDBService.getValueFromStore).toHaveBeenCalledTimes(2)
                expect(CashTenderingService.prepareCashTenderingList).toHaveBeenCalled()
                expect(store.getActions()[0].type).toEqual(expectedAction[0].type)
                expect(store.getActions()[1].type).toEqual(expectedAction[1].type)
                expect(store.getActions()[1].payload).toEqual(expectedAction[1].payload)
            })
    })
    it('throw error', () => {
        const expectedAction = [{
            type: IS_CASH_TENDERING_LOADER_RUNNING,
        },
        ]
        const store = mockStore({})
        return store.dispatch(actions.fetchCashTenderingList())
            .then(() => {
                expect(store.getActions()[0].type).toEqual(expectedAction[0].type)
                expect(store.getActions()[0].payload).toEqual(false)
            })
    })
})

describe('cashtendering  checkForCash', () => {
    it('should get checkForCash', () => {
        let currentElement = {
            attributeTypeId: 38,
            dataStoreAttributeId: null,
            dataStoreMasterId: null,
            editable: true,
            externalDataStoreMasterUrl: null,
            fieldAttributeMasterId: 44339,
            focus: false,
            helpText: "cashtender",
            hidden: false,
            key: "cashtender",
            label: "cashtender",
            parentId: 0,
            positionId: 6,
            required: false,
            sequenceMasterId: null,
            showHelpText: false,
            subLabel: "cashtender",
            validation: null
        }
        const formElement = new Map();
        formElement.set(44548, {
            label: 'xyz',
            subLabel: null,
            positionId: 4,
            helpText: null,
            key: '7',
            required: false,
            value: 'hello',
            attributeTypeId: 18,
            fieldAttributeMasterId: 1,
            parentId: 0,
            childDataList:
                [{
                    attributeTypeId: 26,
                    id: 2,
                    jobMasterId: 1,
                    key: 'actualamount',
                    label: 'actualamount',
                    parentId: 1,
                    childDataList: null,
                },
                {
                    attributeTypeId: 25,
                    id: 3,
                    jobMasterId: 1,
                    key: 'originalamount',
                    label: 'originalamount',
                    parentId: 1,
                    jobAttributeMasterId: 20,
                    fieldAttributeMasterId: null,
                    childDataList: null,
                },
                {
                    attributeTypeId: 12,
                    id: 4,
                    jobMasterId: 1,
                    key: 'detailsarray',
                    label: 'detailsarray',
                    parentId: 1,
                    childDataList: [
                        {
                            attributeTypeId: 11,
                            id: 5,
                            jobMasterId: 1,
                            key: 'detailsobject',
                            label: 'detailsobject',
                            parentId: 4,
                            childDataList: [
                                {
                                    attributeTypeId: 13,
                                    id: 6,
                                    jobMasterId: 1,
                                    key: 'amount',
                                    label: 'amount',
                                    parentId: 5,
                                    value: 120,
                                    childDataList: null,
                                },
                                {
                                    attributeTypeId: 1,
                                    id: 7,
                                    jobMasterId: 1,
                                    key: 'mode_type',
                                    label: 'mode_type',
                                    parentId: 5,
                                    value: 'CS',
                                    childDataList: null,
                                },
                                {
                                    attributeTypeId: 1,
                                    id: 8,
                                    jobMasterId: 1,
                                    key: 'receipt',
                                    label: 'receipt',
                                    parentId: 5,
                                    childDataList: null,
                                },
                                {
                                    attributeTypeId: 2,
                                    id: 9,
                                    jobMasterId: 1,
                                    key: 'remarks',
                                    label: 'remarks',
                                    parentId: 5,
                                    childDataList: null,
                                },
                                {
                                    attributeTypeId: 1,
                                    id: 10,
                                    jobMasterId: 1,
                                    key: 'transaction_number',
                                    label: 'transaction_number',
                                    parentId: 5,
                                    childDataList: null,
                                }
                            ]
                        }]
                }
                ],
        })
        let routeParams = {
            formLayoutState: {
                formElement,
            },
            currentElement
        }
        let cash = 120
        CashTenderingService.checkForCashInMoneyCollect = jest.fn()
        CashTenderingService.checkForCashInMoneyCollect.mockReturnValue({})
        const store = mockStore({})
        return store.dispatch(actions.checkForCash(routeParams))
            .then(() => {
                expect(CashTenderingService.checkForCashInMoneyCollect).toHaveBeenCalled()
            })
    })
    it('throw error ', () => {
        const store = mockStore({})
        return store.dispatch(actions.checkForCash())
            .then(() => {
                expect(userExceptionLogsService.addUserExceptionLogs).toHaveBeenCalled()
            })
    })
})