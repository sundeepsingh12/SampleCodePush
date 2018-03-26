'use strict'

import { paymentService } from '../payment/Payment'
import { fieldAttributeMasterService } from '../classes/FieldAttributeMaster'
import { fieldValidationService } from '../classes/FieldValidation'
import * as realm from '../../repositories/realmdb'
import { moduleCustomizationService } from '../classes/ModuleCustomization'
import {
    SPLIT_AMOUNT_ERROR
} from '../../lib/ContainerConstants'
import {
    CASH,
    CHEQUE,
    DEMAND_DRAFT,
    DISCOUNT,
    EZE_TAP,
    MOSAMBEE,
    MOSAMBEE_WALLET,
    MPAY,
    M_SWIPE,
    NET_BANKING,
    NOT_PAID,
    PAYNEAR,
    PAYO,
    PAYTM,
    POS,
    RAZOR_PAY,
    SODEXO,
    SPLIT,
    TICKET_RESTAURANT,
    UPI,
} from '../../lib/AttributeConstants'

describe('test cases for checkSplitAmount', () => {
    let actualAmount = 50
    let splitPaymentModeMapSame = {
        1: {
            modeTypeId: 1,
            amount: 20
        },
        4: {
            list: [
                {
                    modeTypeId: 4,
                    amount: 5
                },
                {
                    modeTypeId: 4,
                    amount: 10
                },
            ],
            amount: 15
        },
        5: {
            modeTypeId: 5,
            amount: 10
        },
        6: {
            modeTypeId: 6,
            amount: 5
        }
    }
    let splitPaymentModeMapDifferent = {
        1: {
            modeTypeId: 1,
            amount: 10
        },
        4: {
            list: [
                {
                    modeTypeId: 4,
                    amount: 5
                },
                {
                    modeTypeId: 4,
                    amount: 10
                },
            ],
            amount: 15
        },
        5: {
            modeTypeId: 5,
            amount: 10
        },
        6: {
            modeTypeId: 6,
            amount: 5
        }
    }
    it('split amount and actual amount same', () => {
        expect(paymentService.checkSplitAmount(actualAmount, splitPaymentModeMapSame)).toEqual(true)
    })
    it('split amount and actual amount should not be same', () => {
        try {
            paymentService.checkSplitAmount(actualAmount, splitPaymentModeMapDifferent)
        } catch (error) {
            expect(error.message).toEqual(SPLIT_AMOUNT_ERROR)
        }
    })
    it('throw error for undefined splitPaymentModeMap', () => {
        try {
            paymentService.checkSplitAmount(actualAmount, undefined)
        } catch (error) {
            expect(error.message).toEqual(SPLIT_AMOUNT_ERROR)
        }
    })
})

describe('test cases for prepareSplitPaymentModeList', () => {
    let selectedPaymentMode = {
        cardPaymentMode: 10,
        otherPaymentModeList: {
            1: true,
            4: true,
            5: true,
            6: false
        }
    }
    let splitPaymentModeMapCardResult = {
        1: {
            amount: null,
            modeTypeId: '1'
        },
        10: {
            amount: null,
            modeTypeId: 10
        },
        4: {
            amount: 0,
            list: [{
                amount: null,
                modeTypeId: '4'
            }]
        },
        5: {
            amount: null,
            modeTypeId: '5'
        }
    }
    it('should return splitPaymentModeMap for card and other payment modes', () => {
        expect(paymentService.prepareSplitPaymentModeList(selectedPaymentMode)).toEqual(splitPaymentModeMapCardResult)
    })
})

describe('test cases for checkCardPayment', () => {
    it('should return true for card payemnt mode', () => {
        expect(paymentService.checkCardPayment(16)).toEqual(true)
    })

    it('should return false for non-card payemnt mode', () => {
        expect(paymentService.checkCardPayment(4)).toEqual(false)
    })
})

describe('test cases for getModeTypeFromModeTypeId', () => {
    DEMAND_DRAFT,
        DISCOUNT,
        EZE_TAP,
        MOSAMBEE,
        MOSAMBEE_WALLET,
        MPAY,
        M_SWIPE,
        NET_BANKING,
        NOT_PAID,
        PAYNEAR,
        PAYO,
        PAYTM,
        POS,
        RAZOR_PAY,
        SODEXO,
        SPLIT,
        TICKET_RESTAURANT,
        UPI,
        it('should return modeType for cash payment mode', () => {
            expect(paymentService.getModeTypeFromModeTypeId(CASH.id)).toEqual(CASH.modeType)
        })

    it('should return modeType for CHEQUE payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(CHEQUE.id)).toEqual(CHEQUE.modeType)
    })

    it('should return modeType for DEMAND_DRAFT payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(DEMAND_DRAFT.id)).toEqual(DEMAND_DRAFT.modeType)
    })

    it('should return modeType for DISCOUNT payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(DISCOUNT.id)).toEqual(DISCOUNT.modeType)
    })

    it('should return modeType for EZE_TAP payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(EZE_TAP.id)).toEqual(EZE_TAP.modeType)
    })

    it('should return modeType for MOSAMBEE payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(MOSAMBEE.id)).toEqual(MOSAMBEE.modeType)
    })

    it('should return modeType for MOSAMBEE_WALLET payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(MOSAMBEE_WALLET.id)).toEqual(MOSAMBEE_WALLET.modeType)
    })

    it('should return modeType for MPAY payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(MPAY.id)).toEqual(MPAY.modeType)
    })

    it('should return modeType for M_SWIPE payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(M_SWIPE.id)).toEqual(M_SWIPE.modeType)
    })

    it('should return modeType for NET_BANKING payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(NET_BANKING.id)).toEqual(NET_BANKING.modeType)
    })

    it('should return modeType for NOT_PAID payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(NOT_PAID.id)).toEqual(NOT_PAID.modeType)
    })

    it('should return modeType for PAYNEAR payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(PAYNEAR.id)).toEqual(PAYNEAR.modeType)
    })

    it('should return modeType for PAYO payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(PAYO.id)).toEqual(PAYO.modeType)
    })

    it('should return modeType for PAYTM payment mode', () => {
        expect(paymentService.getModeTypeFromModeTypeId(PAYTM.id)).toEqual(PAYTM.modeType)
    })
})

describe('test cases for setFieldDataKeysAndValues', () => {
    it('should set field data keys and values', () => {
        expect(paymentService.setFieldDataKeysAndValues(1, 1, 1, 1)).toEqual(
            {
                attributeTypeId: 1,
                fieldAttributeMasterId: 1,
                value: 1,
                key: 1
            }
        )
    })
})

describe('test cases for getActualAmount', () => {
    let formElement = {
        childDataList: [
            {
                attributeTypeId: 1,
                value: 'test1'
            },
            {
                attributeTypeId: 2,
                value: 'test2'
            },
            {
                attributeTypeId: 3,
                value: 'test3'
            }
        ]
    }
    let formElementWithNoChildList = {}
    it('should return actual amount from data list', () => {
        expect(paymentService.getActualAmount(formElement, 2)).toEqual('test2')
    })
    it('should return default actual amount', () => {
        expect(paymentService.getActualAmount(formElementWithNoChildList, 2)).toEqual(0)
    })
    it('should return default actual amount', () => {
        expect(paymentService.getActualAmount(formElement, 5)).toEqual(0)
    })
})

describe('test cases for actualAmountEditable', () => {
    let moneyCollectMaster = {
        attributeTypeId: 18,
        childObject: {
            1: {
                attributeTypeId: 25,
                id: 1
            },
            2: {
                attributeTypeId: 26,
                id: 2
            },
            3: {
                attributeTypeId: 12,
                id: 3
            },
        }
    }
    let validationMap = {
        1: [
            {
                fieldAttributeMasterId: 1,
                leftKey: 1,
                rightKey: 1,
                condition: '==',
                timeOfExecution: 'after'
            }
        ],
        2: [
            {
                id: 3924,
                timeOfExecution: "Before",
                leftKey: "+,10||+,100",
                condition: "1",
                rightKey: "1,2,3",
                fieldAttributeMasterId: 2,
                jobMasterId: 446
            }
        ]
    }

    it('should return min and max amount', () => {
        expect(paymentService.actualAmountEditable(moneyCollectMaster, validationMap, 2)).toEqual(
            {
                minValue: 10,
                maxValue: 100
            }
        )
    })
    it('should return null for no validation', () => {
        expect(paymentService.actualAmountEditable(moneyCollectMaster, {}, 2)).toEqual(null)
    })
})

describe('test cases for getTotalActualAmount', () => {
    beforeEach(() => {
        paymentService.getActualAmount = jest.fn()
        paymentService.getActualAmount.mockReturnValueOnce(10)
            .mockReturnValueOnce(20)
            .mockReturnValue(40)
    })
    let moneyCollectMaster = {
        attributeTypeId: 18,
        childObject: {
            1: {
                attributeTypeId: 25,
                id: 1
            },
            2: {
                attributeTypeId: 26,
                id: 2
            },
            3: {
                attributeTypeId: 12,
                id: 3
            },
        },
        id: 3
    }
    let formData = new Map()
    formData.set(1, {
        attributeTypeId: 17,
        positionId: 1
    })
    formData.set(2, {
        attributeTypeId: 50,
        positionId: 2
    })
    formData.set(3, {
        attributeTypeId: 18,
        positionId: 3
    })
    let formDataSku = new Map()
    formDataSku.set(1, {
        attributeTypeId: 17,
        positionId: 4
    })
    formDataSku.set(2, {
        attributeTypeId: 50,
        positionId: 2
    })
    formDataSku.set(3, {
        attributeTypeId: 18,
        positionId: 3
    })
    it('should return sum of sku and fixed sku amount', () => {
        expect(paymentService.getTotalActualAmount(moneyCollectMaster, formData)).toEqual(30)
        expect(paymentService.getActualAmount).toHaveBeenCalledTimes(2)
    })
    it('should return fixed sku amount', () => {
        expect(paymentService.getTotalActualAmount(moneyCollectMaster, formDataSku)).toEqual(10)
        expect(paymentService.getActualAmount).toHaveBeenCalledTimes(1)
    })
})

describe('test cases for prepareMoneyCollectChildFieldDataListDTO', () => {
    const actualAmount = 10
    const fieldAttributeMaster = {
        childObject: {
            1: {
                attributeTypeId: 25,
                id: 1,
                key: 'original amount'
            },
            2: {
                attributeTypeId: 26,
                id: 2,
                key: 'actual amount'
            },
            3: {
                attributeTypeId: 12,
                id: 3,
                key: 'details',
                childObject: {
                    4: {
                        attributeTypeId: 11,
                        id: 4,
                        key: 'details_object',
                        childObject: {
                            5: {
                                attributeTypeId: 1,
                                id: 5,
                                key: 'mode_type',
                            },
                            6: {
                                attributeTypeId: 1,
                                id: 6,
                                key: 'transaction_number',
                            },
                            7: {
                                attributeTypeId: 13,
                                id: 7,
                                key: 'amount',
                            },
                            8: {
                                attributeTypeId: 1,
                                id: 8,
                                key: 'receipt',
                            },
                            9: {
                                attributeTypeId: 1,
                                id: 9,
                                key: 'remarks',
                            },
                        }
                    }
                }
            },
        }
    }
    const originalAmount = 20
    const selectedPaymentMode = 1
    const transactionNumber = null
    const remarks = null
    const receipt = null
    const moneyCollectFieldDataResult = [
        {
            attributeTypeId: 25,
            fieldAttributeMasterId: 1,
            key: 'original amount',
            value: 20
        },
        {
            attributeTypeId: 26,
            fieldAttributeMasterId: 2,
            key: 'actual amount',
            value: 10
        },
        {
            attributeTypeId: 12,
            childDataList: [
                {
                    attributeTypeId: 11,
                    childDataList: [
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 5,
                            key: 'mode_type',
                            value: 'CS'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 6,
                            key: 'transaction_number',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 13,
                            fieldAttributeMasterId: 7,
                            key: 'amount',
                            value: 10
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 8,
                            key: 'receipt',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 9,
                            key: 'remarks',
                            value: 'NA'
                        }
                    ],
                    fieldAttributeMasterId: 4,
                    key: 'details_object',
                    value: 'ObjectSarojFareye'
                }
            ],
            fieldAttributeMasterId: 3,
            key: 'details',
            value: 'ArraySarojFareye'
        }
    ]
    it('should prepare money collect field data for given parameters', () => {
        expect(paymentService.prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster, originalAmount, selectedPaymentMode, transactionNumber, remarks, receipt)).toEqual(moneyCollectFieldDataResult)
    })
})

describe('test cases for prepareMoneyCollectChildFieldDataListDTOForSplit', () => {
    const actualAmount = 50
    const fieldAttributeMaster = {
        childObject: {
            1: {
                attributeTypeId: 25,
                id: 1,
                key: 'original amount'
            },
            2: {
                attributeTypeId: 26,
                id: 2,
                key: 'actual amount'
            },
            3: {
                attributeTypeId: 12,
                id: 3,
                key: 'details',
                childObject: {
                    4: {
                        attributeTypeId: 11,
                        id: 4,
                        key: 'details_object',
                        childObject: {
                            5: {
                                attributeTypeId: 1,
                                id: 5,
                                key: 'mode_type',
                            },
                            6: {
                                attributeTypeId: 1,
                                id: 6,
                                key: 'transaction_number',
                            },
                            7: {
                                attributeTypeId: 13,
                                id: 7,
                                key: 'amount',
                            },
                            8: {
                                attributeTypeId: 1,
                                id: 8,
                                key: 'receipt',
                            },
                            9: {
                                attributeTypeId: 1,
                                id: 9,
                                key: 'remarks',
                            },
                        }
                    }
                }
            },
        }
    }
    const originalAmount = 20
    const splitPaymentModeMap = {
        1: {
            modeTypeId: 1,
            amount: 10
        },
        4: {
            list: [
                {
                    modeTypeId: 4,
                    amount: 14
                },
                {
                    modeTypeId: 4,
                    amount: 16
                },
            ],
            amount: 30
        },
        15: {
            modeTypeId: 15,
            amount: 10
        }
    }
    const moneyCollectSplitFieldDataResult = [
        {
            attributeTypeId: 25,
            fieldAttributeMasterId: 1,
            key: 'original amount',
            value: 20
        },
        {
            attributeTypeId: 26,
            fieldAttributeMasterId: 2,
            key: 'actual amount',
            value: 50
        },
        {
            attributeTypeId: 12,
            childDataList: [
                {
                    attributeTypeId: 11,
                    childDataList: [
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 5,
                            key: 'mode_type',
                            value: 'CS'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 6,
                            key: 'transaction_number',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 13,
                            fieldAttributeMasterId: 7,
                            key: 'amount',
                            value: 10
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 8,
                            key: 'receipt',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 9,
                            key: 'remarks',
                            value: 'NA'
                        }
                    ],
                    fieldAttributeMasterId: 4,
                    key: 'details_object',
                    value: 'ObjectSarojFareye'
                },
                {
                    attributeTypeId: 11,
                    childDataList: [
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 5,
                            key: 'mode_type',
                            value: 'Cheque'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 6,
                            key: 'transaction_number',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 13,
                            fieldAttributeMasterId: 7,
                            key: 'amount',
                            value: 14
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 8,
                            key: 'receipt',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 9,
                            key: 'remarks',
                            value: 'NA'
                        }
                    ],
                    fieldAttributeMasterId: 4,
                    key: 'details_object',
                    value: 'ObjectSarojFareye'
                },
                {
                    attributeTypeId: 11,
                    childDataList: [
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 5,
                            key: 'mode_type',
                            value: 'Cheque'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 6,
                            key: 'transaction_number',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 13,
                            fieldAttributeMasterId: 7,
                            key: 'amount',
                            value: 16
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 8,
                            key: 'receipt',
                            value: 'NA'
                        },
                        {
                            attributeTypeId: 1,
                            fieldAttributeMasterId: 9,
                            key: 'remarks',
                            value: 'NA'
                        }
                    ],
                    fieldAttributeMasterId: 4,
                    key: 'details_object',
                    value: 'ObjectSarojFareye'
                }
            ],
            fieldAttributeMasterId: 3,
            value: 'ArraySarojFareye'
        }
    ]
    it('should prepare money collect field data for given parameters', () => {
        expect(paymentService.prepareMoneyCollectChildFieldDataListDTOForSplit(actualAmount, fieldAttributeMaster, originalAmount, splitPaymentModeMap)).toEqual(moneyCollectSplitFieldDataResult)
    })
})

describe('test cases for getOriginalAmount', () => {
    const jobDataListFromDB = [
        {
            value: 10
        },
        {
            value: 20
        }
    ]
    beforeEach(() => {
        realm.getRecordListOnQuery = jest.fn()
    })
    const moneyCollectMasterField = {
        childObject: {
            1: {
                attributeTypeId: 25,
                id: 1,
                key: 'original amount',
                fieldAttributeMasterId: 2
            },
            2: {
                attributeTypeId: 26,
                id: 2,
                key: 'actual amount'
            },
            3: {
                attributeTypeId: 12,
                id: 3,
                key: 'details',
            },
        }
    }
    const moneyCollectMasterJob = {
        childObject: {
            1: {
                attributeTypeId: 25,
                id: 1,
                key: 'original amount',
                jobAttributeMasterId: 1,
            },
            2: {
                attributeTypeId: 26,
                id: 2,
                key: 'actual amount'
            },
            3: {
                attributeTypeId: 12,
                id: 3,
                key: 'details',
            },
        }
    }

    const singleJobTransaction = {
        jobId: 20
    }

    const multipleJobTransaction = [
        {
            jobId: 20,
            jobTransactionId: 30
        },
        {
            jobId: 22,
            jobTransactionId: 31
        }
    ]

    const formData = new Map()
    formData.set(2, {
        value: 14
    })

    const fieldMapResult = {
        originalAmount: 14,
        jobTransactionIdAmountMap: null
    }

    const singleJobMapResult = {
        originalAmount: '50',
        jobTransactionIdAmountMap: null
    }

    const multipleJobMapResult = {
        jobTransactionIdAmountMap: {
            30: {
                actualAmount: 50,
                originalAmount: 50
            },
            31: {
                actualAmount: 30,
                originalAmount: 30
            }
        },
        originalAmount: '80'
    }

    it('original amount mapped with field attribute master', () => {
        expect(paymentService.getOriginalAmount(moneyCollectMasterField, formData, singleJobTransaction)).toEqual(fieldMapResult)
    })

    it('original amount mapped with job attribute master', () => {
        realm.getRecordListOnQuery.mockReturnValue([{
            value: 50
        }])
        expect(paymentService.getOriginalAmount(moneyCollectMasterJob, formData, singleJobTransaction)).toEqual(singleJobMapResult)
        expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
    })

    it('original amount mapped with job attribute master', () => {
        realm.getRecordListOnQuery.mockReturnValue([
            {
                value: 50,
                jobId: 20
            },
            {
                value: 30,
                jobId: 22
            }
        ])
        expect(paymentService.getOriginalAmount(moneyCollectMasterJob, formData, multipleJobTransaction)).toEqual(multipleJobMapResult)
        expect(realm.getRecordListOnQuery).toHaveBeenCalledTimes(1)
    })
})

describe('test cases for getPaymentModeList', () => {
    const jobMasterMoneyTransactionModesList = [
        {
            id: 1,
            moneyTransactionModeId: 1,
            jobMasterId: 1
        },
        {
            id: 2,
            moneyTransactionModeId: 2,
            jobMasterId: 1
        },
        {
            id: 3,
            moneyTransactionModeId: 20,
            jobMasterId: 1
        },
        {
            id: 4,
            moneyTransactionModeId: 7,
            jobMasterId: 1
        },
        {
            id: 5,
            moneyTransactionModeId: 15,
            jobMasterId: 1
        },
        {
            id: 6,
            moneyTransactionModeId: 1,
            jobMasterId: 2
        },
        {
            id: 7,
            moneyTransactionModeId: 2,
            jobMasterId: 2
        },
        {
            id: 8,
            moneyTransactionModeId: 3,
            jobMasterId: 2
        },
        {
            id: 9,
            moneyTransactionModeId: 4,
            jobMasterId: 3
        },
        {
            id: 10,
            moneyTransactionModeId: 1,
            jobMasterId: 3
        }
    ]

    const jobMasterId = 1

    const paymentModeObject = {
        paymentModeList: {
            endPaymentModeList: [
                {
                    id: 2,
                    jobMasterId: 1,
                    moneyTransactionModeId: 2
                },
                {
                    id: 3,
                    jobMasterId: 1,
                    moneyTransactionModeId: 20
                },
                {
                    id: 5,
                    jobMasterId: 1,
                    moneyTransactionModeId: 15
                }
            ],
            otherPaymentModeList: [
                {
                    id: 1,
                    jobMasterId: 1,
                    moneyTransactionModeId: 1
                }
            ]
        },
        splitPaymentMode: true
    }

    it('payment mode according to job master', () => {
        expect(paymentService.getPaymentModeList(jobMasterMoneyTransactionModesList, jobMasterId)).toEqual(paymentModeObject)
    })
})

describe('test cases for getPaymentParameters', () => {
    beforeEach(() => {
        fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId = jest.fn()
        fieldValidationService.getFieldValidationMap = jest.fn()
        moduleCustomizationService.getModuleCustomizationMapForAppModuleId = jest.fn()
        paymentService.setDisplayNameForPaymentModules = jest.fn()
        fieldAttributeMasterService.setChildFieldAttributeMaster = jest.fn()
        paymentService.getOriginalAmount = jest.fn()
        paymentService.getTotalActualAmount = jest.fn()
        paymentService.actualAmountEditable = jest.fn()
    })

    const jobTransaction = {
        jobMasterId: 1
    }

    const fieldAttributeMasterId = 3

    it('render payment parameters with actual and original amount same', () => {
        const paymentResult = {
            actualAmount: 30,
            amountEditableObject: undefined,
            jobTransactionIdAmountMap: null,
            moneyCollectMaster: {
                attributeTypeId: 18,
                childObject: undefined,
                id: 3
            },
            originalAmount: 30,
            paymentModeList: {
                endPaymentModeList: [],
                otherPaymentModeList: []
            },
            splitPaymentMode: false
        }
        fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId.mockReturnValue(
            {
                1: {
                    'root': {
                        3: {
                            attributeTypeId: 18,
                            id: 3
                        }
                    }
                }
            }
        )
        paymentService.getOriginalAmount.mockReturnValue({
            originalAmount: 30,
            jobTransactionIdAmountMap: null
        })
        expect(paymentService.getPaymentParameters(jobTransaction, fieldAttributeMasterId)).toEqual(paymentResult)
    })

    it('render payment parameters with actual and original amount different', () => {
        const paymentResult = {
            actualAmount: 40,
            amountEditableObject: undefined,
            jobTransactionIdAmountMap: null,
            moneyCollectMaster: {
                attributeTypeId: 18,
                childObject: undefined,
                id: 3
            },
            originalAmount: 30,
            paymentModeList: {
                endPaymentModeList: [],
                otherPaymentModeList: []
            },
            splitPaymentMode: false
        }
        fieldAttributeMasterService.getFieldAttributeMasterMapWithParentId.mockReturnValue(
            {
                1: {
                    'root': {
                        3: {
                            attributeTypeId: 18,
                            id: 3
                        }
                    }
                }
            }
        )
        paymentService.getOriginalAmount.mockReturnValue({
            originalAmount: 30,
            jobTransactionIdAmountMap: null
        })
        paymentService.getTotalActualAmount.mockReturnValue(40)
        paymentService.getOriginalAmount
        expect(paymentService.getPaymentParameters(jobTransaction, fieldAttributeMasterId)).toEqual(paymentResult)
    })
})



// describe('test cases for getPaymentParameters', () => {
//     beforeEach(() => {
//         realm.getRecordListOnQuery = jest.fn()
//         realm.getRecordListOnQuery.mockReturnValue([
//             {
//                 value: '10'
//             }
//         ])
//     })
//     const jobMasterId = 1
//     const fieldAttributeMasterId = 1
//     const jobMasterMoneyTransactionModesList = [
//         {
//             id: 1,
//             moneyTransactionModeId: 1,
//             jobMasterId: 1
//         },
//         {
//             id: 2,
//             moneyTransactionModeId: 2,
//             jobMasterId: 1
//         },
//         {
//             id: 3,
//             moneyTransactionModeId: 3,
//             jobMasterId: 1
//         },
//         {
//             id: 4,
//             moneyTransactionModeId: 4,
//             jobMasterId: 1
//         },
//         {
//             id: 5,
//             moneyTransactionModeId: 5,
//             jobMasterId: 1
//         },
//         {
//             id: 6,
//             moneyTransactionModeId: 1,
//             jobMasterId: 2
//         },
//         {
//             id: 7,
//             moneyTransactionModeId: 2,
//             jobMasterId: 2
//         },
//         {
//             id: 8,
//             moneyTransactionModeId: 3,
//             jobMasterId: 2
//         },
//         {
//             id: 9,
//             moneyTransactionModeId: 4,
//             jobMasterId: 3
//         },
//         {
//             id: 10,
//             moneyTransactionModeId: 1,
//             jobMasterId: 3
//         }
//     ]
//     const fieldAttributeMasterList = [
//         {
//             attributeTypeId: 18,
//             id: 1,
//             jobMasterId: 1,
//             key: 'moneycollection',
//             label: 'moneycollection',
//             parentId: 0,
//         },
//         {
//             attributeTypeId: 26,
//             id: 2,
//             jobMasterId: 1,
//             key: 'actualamount',
//             label: 'actualamount',
//             parentId: 1,
//         },
//         {
//             attributeTypeId: 25,
//             id: 3,
//             jobMasterId: 1,
//             key: 'originalamount',
//             label: 'originalamount',
//             parentId: 1,
//             jobAttributeMasterId: 20,
//             fieldAttributeMasterId: null
//         },
//         {
//             attributeTypeId: 12,
//             id: 4,
//             jobMasterId: 1,
//             key: 'detailsarray',
//             label: 'detailsarray',
//             parentId: 1,
//         },
//         {
//             attributeTypeId: 11,
//             id: 5,
//             jobMasterId: 1,
//             key: 'detailsobject',
//             label: 'detailsobject',
//             parentId: 4,
//         },
//         {
//             attributeTypeId: 13,
//             id: 6,
//             jobMasterId: 1,
//             key: 'amount',
//             label: 'amount',
//             parentId: 5,
//         },
//         {
//             attributeTypeId: 1,
//             id: 7,
//             jobMasterId: 1,
//             key: 'mode_type',
//             label: 'mode_type',
//             parentId: 5,
//         },
//         {
//             attributeTypeId: 1,
//             id: 8,
//             jobMasterId: 1,
//             key: 'receipt',
//             label: 'receipt',
//             parentId: 5,
//         },
//         {
//             attributeTypeId: 2,
//             id: 9,
//             jobMasterId: 1,
//             key: 'remarks',
//             label: 'remarks',
//             parentId: 5,
//         },
//         {
//             attributeTypeId: 1,
//             id: 10,
//             jobMasterId: 1,
//             key: 'transaction_number',
//             label: 'transaction_number',
//             parentId: 5,
//         },
//         {
//             attributeTypeId: 19,
//             id: 11,
//             jobMasterId: 1,
//             key: 'moneypay',
//             label: 'moneypay',
//             parentId: 0,
//         },
//         {
//             attributeTypeId: 26,
//             id: 12,
//             jobMasterId: 1,
//             key: 'actualamountpay',
//             label: 'actualamountpay',
//             parentId: 11,
//         },
//         {
//             attributeTypeId: 25,
//             id: 13,
//             jobMasterId: 1,
//             key: 'originalamountpay',
//             label: 'originalamountpay',
//             parentId: 11,
//         },
//         {
//             attributeTypeId: 13,
//             id: 14,
//             jobMasterId: 2,
//             key: 'cost',
//             label: 'cost',
//             parentId: 0,
//         },
//         {
//             attributeTypeId: 1,
//             id: 15,
//             jobMasterId: 2,
//             key: 'name',
//             label: 'name',
//             parentId: 0,
//         },
//         {
//             attributeTypeId: 13,
//             id: 16,
//             jobMasterId: 2,
//             key: 'cost',
//             label: 'cost',
//             parentId: 0,
//         },
//     ]

//     let formData = new Map()
//     formData.set(1, {
//         attributeTypeId: 17,
//         fieldAttributeMasterId: 20,
//         positionId: 10,
//         parentId: 0,
//         value: 'ArraySarojFareye',
//         childDataList: []
//     })
//     formData.set(1, {
//         attributeTypeId: 50,
//         fieldAttributeMasterId: 21,
//         positionId: 11,
//         parentId: 0,
//         value: 'ArraySarojFareye',
//         childDataList: []
//     })

//     const jobId = 5
//     const jobStatusId = 10
//     const fieldAttributeMasterValidationList = [
//         {
//             id: 16243,
//             executionTime: "Before",
//             leftKey: "+,10||+,100",
//             identifier: "1",
//             rightKey: "10,11",
//             fieldAttributeMasterId: 43889,
//             jobMasterId: 3382,
//             thenArr: [

//             ],
//             elseArr: [

//             ]
//         }
//     ]
//     const modulesCustomizationList = [
//         {
//             id: 1,
//             appModulesId: 9,
//             displayName: null,
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 2,
//             appModulesId: 10,
//             displayName: null,
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 3,
//             appModulesId: 11,
//             displayName: null,
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 4,
//             appModulesId: 18,
//             displayName: null,
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 5,
//             appModulesId: 19,
//             displayName: null,
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 6,
//             appModulesId: 21,
//             displayName: 'upidisplay',
//             remark: "{\"cardCustomName\":\"netcardpay\",\"upiCustomName\":\"netupipay\",\"netBankingCustomName\":\"netnetpay\",\"enableVpa\":false,\"partnerId\":\"asd\",\"apiPassword\":\"asd\",\"secretKey\":\"asd\",\"PayProMID\":\"asd\",\"netBankingURL\":\"https://abc.com\",\"checkTransactionStatusURL\":\"https://abc.com\",\"mosambeeUsername\":\"\"}",
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 7,
//             appModulesId: 22,
//             displayName: 'netbankdisplay',
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 8,
//             appModulesId: 23,
//             displayName: null,
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 9,
//             appModulesId: 24,
//             displayName: null,
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 10,
//             appModulesId: 28,
//             displayName: 'paytmdisplay',
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//         {
//             id: 11,
//             appModulesId: 29,
//             displayName: 'mpaydisplay',
//             remark: null,
//             companyId: 1,
//             selectedUserType: null
//         },
//     ]
//     const actualAmount = 10
//     const moneyCollectMaster = {
//         attributeTypeId: 18,
//         id: 1,
//         jobMasterId: 1,
//         key: 'moneycollection',
//         label: 'moneycollection',
//         parentId: 'root',
//         childObject: {
//             2: {
//                 attributeTypeId: 26,
//                 id: 2,
//                 jobMasterId: 1,
//                 key: 'actualamount',
//                 label: 'actualamount',
//                 parentId: 1,
//                 childObject: null,
//             },
//             3: {
//                 attributeTypeId: 25,
//                 id: 3,
//                 jobMasterId: 1,
//                 key: 'originalamount',
//                 label: 'originalamount',
//                 parentId: 1,
//                 jobAttributeMasterId: 20,
//                 fieldAttributeMasterId: null,
//                 childObject: null,
//             },
//             4: {
//                 attributeTypeId: 12,
//                 id: 4,
//                 jobMasterId: 1,
//                 key: 'detailsarray',
//                 label: 'detailsarray',
//                 parentId: 1,
//                 childObject: {
//                     5: {
//                         attributeTypeId: 11,
//                         id: 5,
//                         jobMasterId: 1,
//                         key: 'detailsobject',
//                         label: 'detailsobject',
//                         parentId: 4,
//                         childObject: {
//                             6: {
//                                 attributeTypeId: 13,
//                                 id: 6,
//                                 jobMasterId: 1,
//                                 key: 'amount',
//                                 label: 'amount',
//                                 parentId: 5,
//                                 childObject: null,
//                             },
//                             7: {
//                                 attributeTypeId: 1,
//                                 id: 7,
//                                 jobMasterId: 1,
//                                 key: 'mode_type',
//                                 label: 'mode_type',
//                                 parentId: 5,
//                                 childObject: null,
//                             },
//                             8: {
//                                 attributeTypeId: 1,
//                                 id: 8,
//                                 jobMasterId: 1,
//                                 key: 'receipt',
//                                 label: 'receipt',
//                                 parentId: 5,
//                                 childObject: null,
//                             },
//                             9: {
//                                 attributeTypeId: 2,
//                                 id: 9,
//                                 jobMasterId: 1,
//                                 key: 'remarks',
//                                 label: 'remarks',
//                                 parentId: 5,
//                                 childObject: null,
//                             },
//                             10: {
//                                 attributeTypeId: 1,
//                                 id: 10,
//                                 jobMasterId: 1,
//                                 key: 'transaction_number',
//                                 label: 'transaction_number',
//                                 parentId: 5,
//                                 childObject: null,
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     const originalAmount = 10
//     const paymentModeList = [
//         {
//             id: 1,
//             moneyTransactionModeId: 1,
//             jobMasterId: 1
//         },
//         {
//             id: 2,
//             moneyTransactionModeId: 2,
//             jobMasterId: 1
//         },
//         {
//             id: 3,
//             moneyTransactionModeId: 3,
//             jobMasterId: 1
//         },
//         {
//             id: 4,
//             moneyTransactionModeId: 4,
//             jobMasterId: 1
//         },
//         {
//             id: 5,
//             moneyTransactionModeId: 5,
//             jobMasterId: 1
//         },
//     ]
//     let amountEditableObject = null
//     const result = {
//         actualAmount,
//         amountEditableObject,
//         moneyCollectMaster,
//         originalAmount,
//         paymentModeList,
//     }
//     it('should return initial payment parameters with no actual amount validation', () => {
//         expect(paymentService.getPaymentParameters(jobMasterId, fieldAttributeMasterId, jobMasterMoneyTransactionModesList, fieldAttributeMasterList, formData, jobId, jobStatusId, fieldAttributeMasterValidationList)).toEqual(result)
//     })
// })

// describe('test cases for prepareMoneyCollectChildFieldDataListDTO', () => {
//     const actualAmount
//     const fieldAttributeMaster
//     const originalAmount
//     const selectedIndex
//     const transactionNumber
//     const remarks
//     const receipt
//     const result
//     expect(paymentService.prepareMoneyCollectChildFieldDataListDTO(actualAmount, fieldAttributeMaster, originalAmount, selectedIndex, transactionNumber, remarks, receipt)).toEqual(result)
// })