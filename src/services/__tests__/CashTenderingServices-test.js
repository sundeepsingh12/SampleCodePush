'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'

import {
    NUMBER,
    DECIMAL,
    MONEY_COLLECT,
    ARRAY,
    OBJECT,
    CASH,
    STRING,
    OBJECT_SAROJ_FAREYE,
} from '../../lib/AttributeConstants'
import { CashTenderingService } from '../classes/CashTenderingServices'

describe('test cases for prepareObjectWithFieldAttributeData', () => {
    it('should return object of fieldAttributeData having fieldAttributeMasterId,label,attributeTypeId', () => {
        const result = {
            fieldAttributeMasterId: 1,
            label: 'sample_label',
            attributeTypeId: 11
        }
        const fieldAttributeData = {
            id: 1,
            label: 'sample_label',
            attributeTypeId: 11
        }
        expect(CashTenderingService.prepareObjectWithFieldAttributeData(fieldAttributeData)).toEqual(result)
    })

})

describe('test cases for calculateQuantity', () => {
    it('should return updated cashTenderingList and totalAmount', () => {
        let cashTenderingList = {
            '1': {
                childDataList: {
                    '6': {
                        value: 10
                    },
                    '13': {
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
                    }
                }
            }
        }
        let payload = {
            id: 1,
            quantity: 1000
        }
        let totalAmount = 110

        let result = {
            cashTenderingList: {
                '1': {
                    childDataList: {
                        '6': {
                            value: 1000
                        },
                        '13': {
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
                        }
                    }
                }
            },
            totalAmount: 10010
        }
        expect(CashTenderingService.calculateQuantity(cashTenderingList, totalAmount, payload)).toEqual(result)
    })
    it('should return updated cashTenderingList and totalAmount and payload.quantity is empty', () => {
        let cashTenderingList = {
            '1': {
                childDataList: {
                    '6': {
                        value: 10
                    },
                    '13': {
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
                    }
                }
            }
        }
        let payload = {
            id: 1,
            quantity: ''
        }
        let totalAmount = 110

        let result = {
            cashTenderingList: {
                '1': {
                    childDataList: {
                        '6': {
                            value: ''
                        },
                        '13': {
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
                        }
                    }
                }
            },
            totalAmount: 10
        }
        expect(CashTenderingService.calculateQuantity(cashTenderingList, totalAmount, payload)).toEqual(result)
    })
})

describe('test cases for initializeValuesOfDenominations', () => {
    it('should return initialized value of cashTenderingList', () => {
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
        expect(CashTenderingService.initializeValuesOfDenominations(cashTenderingList)).toEqual(cashTenderingListInitialized)
    })

    it('should return empty initialized value of cashTenderingList', () => {
        let cashTenderingList = null
        let cashTenderingListInitialized = {}
        expect(CashTenderingService.initializeValuesOfDenominations(cashTenderingList)).toEqual(cashTenderingListInitialized)
    })
})

describe('test cases for checkForCashInMoneyCollect', () => {
    it('should return value of cash present in moneycollect', () => {
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

        expect(CashTenderingService.checkForCashInMoneyCollect(formElement, currentElement)).toEqual(120)
    })

    it('should return value of cash present in moneycollect', () => {
        expect(CashTenderingService.checkForCashInMoneyCollect(null, null)).toEqual(0)
    })
})

describe('test cases for prepareCashTenderingListObjectsFromTemplate', () => {
    it('should return updated cashTenderingList and no TotalAmount present', () => {
        let cashTenderingObjectTemplate = {
            attributeTypeId: 11,
            fieldAttributeMasterId: 123,
            value: OBJECT_SAROJ_FAREYE,
            label: 'sample_label',
            sequence: 1,
            view: 'receive',
            childDataList: {
                '1': {
                    label: 'sample_label',
                    attributeTypeId: 1,
                    fieldAttributeMasterId: 111
                },
                '13': {
                    label: 'sample_label',
                    attributeTypeId: 13,
                    fieldAttributeMasterId: 222
                },
                '6': {
                    label: 'sample_label',
                    attributeTypeId: 6,
                    fieldAttributeMasterId: 333
                }
            }
        }
        let fiedlAttributeValueDataArray = [{
            fieldAttributeMasterId: 1234,
            name: 'receive',
            code: 200,
            sequence: 1,
        }]
        let cashTenderingList = {}
        let fieldAttributeMasterId = 1234
        let result = {
            '0': {
                attributeTypeId: 11,
                fieldAttributeMasterId: 123,
                value: OBJECT_SAROJ_FAREYE,
                label: 'sample_label',
                id: 0,
                sequence: 1,
                view: 'receive',
                childDataList: {
                    '1': {
                        label: 'sample_label',
                        attributeTypeId: 1,
                        fieldAttributeMasterId: 111,
                        value: 'receive'
                    },
                    '13': {
                        label: 'sample_label',
                        attributeTypeId: 13,
                        fieldAttributeMasterId: 222,
                        value: 200
                    },
                    '6': {
                        label: 'sample_label',
                        attributeTypeId: 6,
                        fieldAttributeMasterId: 333,
                        value: 0
                    }
                }
            }
        }
        expect(CashTenderingService.prepareCashTenderingListObjectsFromTemplate(cashTenderingObjectTemplate, fiedlAttributeValueDataArray, cashTenderingList, fieldAttributeMasterId, 0)).toEqual(result)
    })
    it('should return updated cashTenderingList and TotalAmount present', () => {
        let cashTenderingObjectTemplate = {
            attributeTypeId: 11,
            fieldAttributeMasterId: 123,
            value: OBJECT_SAROJ_FAREYE,
            label: 'sample_label',
            sequence: 1,
            view: 'receive',
            childDataList: {
                '1': {
                    label: 'sample_label',
                    attributeTypeId: 1,
                    fieldAttributeMasterId: 111
                },
                '13': {
                    label: 'sample_label',
                    attributeTypeId: 13,
                    fieldAttributeMasterId: 222
                },
                '6': {
                    label: 'sample_label',
                    attributeTypeId: 6,
                    fieldAttributeMasterId: 333
                }
            }
        }
        let fiedlAttributeValueDataArray = [{
            fieldAttributeMasterId: 1234,
            name: 'receive',
            code: 200,
            sequence: 1,
        }]
        let cashTenderingList = {
            'TotalAmount': {
                attributeTypeId: 13,
                fieldAttributeMasterId: 12345,
                value: 0,
                label: 'sample_label',
                id: 0
            }
        }
        let fieldAttributeMasterId = 1234
        let result = {
            'TotalAmount': {
                attributeTypeId: 13,
                fieldAttributeMasterId: 12345,
                value: 0,
                label: 'sample_label',
                id: 0
            },
            '1': {
                attributeTypeId: 11,
                fieldAttributeMasterId: 123,
                value: OBJECT_SAROJ_FAREYE,
                label: 'sample_label',
                id: 1,
                sequence: 1,
                view: 'receive',
                childDataList: {
                    '1': {
                        label: 'sample_label',
                        attributeTypeId: 1,
                        fieldAttributeMasterId: 111,
                        value: 'receive'
                    },
                    '13': {
                        label: 'sample_label',
                        attributeTypeId: 13,
                        fieldAttributeMasterId: 222,
                        value: 200
                    },
                    '6': {
                        label: 'sample_label',
                        attributeTypeId: 6,
                        fieldAttributeMasterId: 333,
                        value: 0
                    }
                }
            }
        }
        expect(CashTenderingService.prepareCashTenderingListObjectsFromTemplate(cashTenderingObjectTemplate, fiedlAttributeValueDataArray, cashTenderingList, fieldAttributeMasterId, 1)).toEqual(result)
    })
})


describe('test cases for prepareCashTenderingList', () => {
    it('should return prepareCashTenderingList having TotalAmount only', () => {
        let fieldAttributeMasterList = [{
            attributeTypeId: 13,
            fieldAttributeMasterId: 123,
            parentId: 1234,
            label: 'sample_label'
        }]
        let fieldAttributeMasterId = 1234
        let fieldAttributeValueDataArray = {}
        let result = {
            'TotalAmount': {
                attributeTypeId: 13,
                fieldAttributeMasterId: 123,
                value: 0,
                label: 'sample_label',
                id: 0,
            }
        }
        CashTenderingService.prepareObjectWithFieldAttributeData = jest.fn()
        CashTenderingService.prepareObjectWithFieldAttributeData.mockReturnValue({
            attributeTypeId: 13,
            fieldAttributeMasterId: 123,
            label: 'sample_label'
        })
        CashTenderingService.prepareCashTenderingListObjectsFromTemplate = jest.fn()
        CashTenderingService.prepareCashTenderingListObjectsFromTemplate.mockReturnValue({})

        expect(CashTenderingService.prepareCashTenderingList(fieldAttributeMasterList, fieldAttributeValueDataArray, fieldAttributeMasterId, 0)).toEqual(result)
    })

    it('should return CashTenderingList having Object only', () => {
        let fieldAttributeMasterList = [{
            attributeTypeId: 11,
            fieldAttributeMasterId: 123,
            parentId: 1234,
            label: 'sample_label',
            value: 'abc',
            id: 123,
        }, {
            attributeTypeId: 1,
            fieldAttributeMasterId: 12345,
            parentId: 123,
            label: 'sample_label',
            id: 123,
            value: 'abc',
        }, {
            attributeTypeId: 6,
            fieldAttributeMasterId: 12323,
            parentId: 123,
            value: 'abc',
            id: 123,
            label: 'sample_label',
        }, {
            attributeTypeId: 13,
            fieldAttributeMasterId: 12351,
            parentId: 123,
            id: 123,
            label: 'sample_label'
        }]
        let fieldAttributeMasterId = 1234
        let fieldAttributeValueDataArray = [{
            name: 'abc',
            code: 200,
            fieldAttributeMasterId: 123
        }]
        let result = {
            '1': {
                attributeTypeId: 11,
                fieldAttributeMasterId: 123,
                value: 0,
                label: 'sample_label',
                id: 1,
                childDataList: {
                    '1': {
                        attributeTypeId: 1,
                        fieldAttributeMasterId: 12345,
                        parentId: 123,
                        label: 'sample_label',
                        value: ''
                    }, '6': {
                        attributeTypeId: 6,
                        fieldAttributeMasterId: 12323,
                        parentId: 123,
                        label: 'sample_label',
                        value: ''
                    }, '13': {
                        attributeTypeId: 13,
                        fieldAttributeMasterId: 12351,
                        parentId: 123,
                        label: 'sample_label',
                        value: 200
                    }
                }
            }
        }

        CashTenderingService.prepareObjectWithFieldAttributeData = jest.fn()
        CashTenderingService.prepareObjectWithFieldAttributeData.mockReturnValue({
            attributeTypeId: 1,
            fieldAttributeMasterId: 123,
            label: 'sample_label'
        })
        CashTenderingService.prepareCashTenderingListObjectsFromTemplate = jest.fn()
        CashTenderingService.prepareCashTenderingListObjectsFromTemplate.mockReturnValue({
            '1': {
                attributeTypeId: 11,
                fieldAttributeMasterId: 123,
                value: 0,
                label: 'sample_label',
                id: 1,
                childDataList: {
                    '1': {
                        attributeTypeId: 1,
                        fieldAttributeMasterId: 12345,
                        parentId: 123,
                        label: 'sample_label',
                        value: ''
                    }, '6': {
                        attributeTypeId: 6,
                        fieldAttributeMasterId: 12323,
                        parentId: 123,
                        label: 'sample_label',
                        value: ''
                    }, '13': {
                        attributeTypeId: 13,
                        fieldAttributeMasterId: 12351,
                        parentId: 123,
                        label: 'sample_label',
                        value: 200
                    }
                }
            }
        })

        expect(CashTenderingService.prepareCashTenderingList(fieldAttributeMasterList, fieldAttributeValueDataArray, fieldAttributeMasterId, 0)).toEqual(result)
    })
})