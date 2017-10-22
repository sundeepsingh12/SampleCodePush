'use strict'
import {
    keyValueDBService,
} from '../classes/KeyValueDBService'
import { fixedSKUDetailsService } from '../classes/FixedSKUListing'
import {
    FIXED_SKU_QUANTITY,
    FIXED_SKU_UNIT_PRICE,
    FIXED_SKU_CODE,
    OBJECT_ATTR_ID,
    OBJECT_SAROJ_FAREYE,
    TOTAL_AMOUNT
} from '../../lib/AttributeConstants'

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
        expect(fixedSKUDetailsService.prepareObjectWithFieldAttributeData(fieldAttributeData)).toEqual(result)
    })
    it('should return null when fieldAttributeData is undefined', () => {
        expect(fixedSKUDetailsService.prepareObjectWithFieldAttributeData(undefined)).toEqual(null)
    })
})
describe('test cases for calculateQuantity', () => {
    it('should return updated fixedSKUList and totalQuantity', () => {
        const fixedSKUList = {
            '1': {
                childDataList: {
                    '6': {
                        value: 10
                    }
                }
            }, '2': {
                childDataList: {
                    '6': {
                        value: 100
                    }
                }
            }
        }
        const payload = {
            id: 1,
            quantity: 1000
        }
        const totalQuantity = 110

        const result = {
            fixedSKUList: {
                '1': {
                    childDataList: {
                        '6': {
                            value: 1000
                        }
                    }
                }, '2': {
                    childDataList: {
                        '6': {
                            value: 100
                        }
                    }
                }
            },
            totalQuantity: 1100
        }
        expect(fixedSKUDetailsService.calculateQuantity(fixedSKUList, totalQuantity, payload)).toEqual(result)
    })
    it('should return updated fixedSKUList and totalQuantity and payload.quantity is empty', () => {
        const fixedSKUList = {
            '1': {
                childDataList: {
                    '6': {
                        value: 10
                    }
                }
            }, '2': {
                childDataList: {
                    '6': {
                        value: 100
                    }
                }
            }
        }
        const payload = {
            id: 1,
            quantity: ''
        }
        const totalQuantity = 110

        const result = {
            fixedSKUList: {
                '1': {
                    childDataList: {
                        '6': {
                            value: ''
                        }
                    }
                }, '2': {
                    childDataList: {
                        '6': {
                            value: 100
                        }
                    }
                }
            },
            totalQuantity: 100
        }
        expect(fixedSKUDetailsService.calculateQuantity(fixedSKUList, totalQuantity, payload)).toEqual(result)
    })
})


describe('test cases for calculateTotalAmount', () => {
    it('should return updated fixedSKUList with TotalAmount updated', () => {
        const fixedSKUList = {
            '1': {
                childDataList: {
                    '6': {
                        value: 10
                    },
                    '13': {
                        value: 200
                    }
                }
            }, '2': {
                childDataList: {
                    '6': {
                        value: ''
                    },
                    '13': {
                        value: 100
                    }
                }
            },
            'TotalAmount': {
                value: 0
            }
        }

        const result = {
            '1': {
                childDataList: {
                    '6': {
                        value: 10
                    },
                    '13': {
                        value: 200
                    }
                }
            }, '2': {
                childDataList: {
                    '6': {
                        value: ''
                    },
                    '13': {
                        value: 100
                    }
                }
            },
            'TotalAmount': {
                value: 2000
            }
        }
        expect(fixedSKUDetailsService.calculateTotalAmount(fixedSKUList)).toEqual(result)
    })
})

describe('test cases for prepareFixedSKUObjectsFromTemplate', () => {
    it('should return updated fixedSKUList and no TotalAmount present', () => {
        let fixedSKUTemplate = {
            attributeTypeId: 11,
            fieldAttributeMasterId: 123,
            value: OBJECT_SAROJ_FAREYE,
            label: 'sample_label',
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
            name: 'abc',
            code: 200
        }]
        let fixedSKUList = {}
        let fieldAttributeMasterId = 1234
        let result = {
            '0': {
                attributeTypeId: 11,
                fieldAttributeMasterId: 123,
                value: OBJECT_SAROJ_FAREYE,
                label: 'sample_label',
                id: 0,
                childDataList: {
                    '1': {
                        label: 'sample_label',
                        attributeTypeId: 1,
                        fieldAttributeMasterId: 111,
                        value: 'abc'
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
        expect(fixedSKUDetailsService.prepareFixedSKUObjectsFromTemplate(fixedSKUTemplate, fiedlAttributeValueDataArray, fixedSKUList, fieldAttributeMasterId)).toEqual(result)
    })
    it('should return updated fixedSKUList and TotalAmount present', () => {
        let fixedSKUTemplate = {
            attributeTypeId: 11,
            fieldAttributeMasterId: 123,
            value: OBJECT_SAROJ_FAREYE,
            label: 'sample_label',
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
            name: 'abc',
            code: 200
        }]
        let fixedSKUList = {
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
                childDataList: {
                    '1': {
                        label: 'sample_label',
                        attributeTypeId: 1,
                        fieldAttributeMasterId: 111,
                        value: 'abc'
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
        expect(fixedSKUDetailsService.prepareFixedSKUObjectsFromTemplate(fixedSKUTemplate, fiedlAttributeValueDataArray, fixedSKUList, fieldAttributeMasterId)).toEqual(result)
    })
})

describe('test cases for prepareFixedSKU', () => {
    it('should return fixedSKUList having TotalAmount only', () => {
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
                id: 2
            }
        }
        fixedSKUDetailsService.prepareObjectWithFieldAttributeData = jest.fn()
        fixedSKUDetailsService.prepareObjectWithFieldAttributeData.mockReturnValue({
            attributeTypeId: 13,
            fieldAttributeMasterId: 123,
            label: 'sample_label'
        })
        fixedSKUDetailsService.prepareFixedSKUObjectsFromTemplate = jest.fn()
        fixedSKUDetailsService.prepareFixedSKUObjectsFromTemplate.mockReturnValue({})

        expect(fixedSKUDetailsService.prepareFixedSKU(fieldAttributeMasterList, fieldAttributeValueDataArray, fieldAttributeMasterId)).toEqual(result)
    })

    it('should return fixedSKUList having Object only', () => {
        let fieldAttributeMasterList = [{
            attributeTypeId: 11,
            fieldAttributeMasterId: 123,
            parentId: 1234,
            label: 'sample_label'
        }, {
            attributeTypeId: 1,
            fieldAttributeMasterId: 12345,
            parentId: 123,
            label: 'sample_label'
        }, {
            attributeTypeId: 6,
            fieldAttributeMasterId: 12323,
            parentId: 123,
            label: 'sample_label'
        }, {
            attributeTypeId: 13,
            fieldAttributeMasterId: 12351,
            parentId: 123,
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
                        value: 'abc'
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

        fixedSKUDetailsService.prepareObjectWithFieldAttributeData = jest.fn()
        fixedSKUDetailsService.prepareObjectWithFieldAttributeData.mockReturnValue({
            attributeTypeId: 11,
            fieldAttributeMasterId: 123,
            label: 'sample_label'
        })
        fixedSKUDetailsService.prepareFixedSKUObjectsFromTemplate = jest.fn()
        fixedSKUDetailsService.prepareFixedSKUObjectsFromTemplate.mockReturnValue({
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
                        value: 'abc'
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

        expect(fixedSKUDetailsService.prepareFixedSKU(fieldAttributeMasterList, fieldAttributeValueDataArray, fieldAttributeMasterId)).toEqual(result)
    })
})