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

    it('should return null when fieldAttributeData is undefined', () => {
        expect(CashTenderingService.prepareObjectWithFieldAttributeData(undefined)).toEqual(null)
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
                        value: ''
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
            sequence:1,
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
                        value: ''
                    }
                }
            }
        }
        expect(CashTenderingService.prepareCashTenderingListObjectsFromTemplate(cashTenderingObjectTemplate, fiedlAttributeValueDataArray, cashTenderingList, fieldAttributeMasterId, 1)).toEqual(result)
    })
})
