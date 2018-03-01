'use strict'

import { paymentService } from '../payment/Payment'
import * as realm from '../../repositories/realmdb'
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